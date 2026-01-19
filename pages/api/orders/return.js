import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getSessionUserId } from "@/lib/user";
import { getPrismaUserFromFirebase } from "@/lib/userUtils";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { orderId, returnType, returnReason, returnComments, returnImages, userId: firebaseUid, email: userEmail } = req.body;

        let userId = null;
        let resolvedEmail = null;

        // 1. Try Firebase Auth
        if (firebaseUid) {
            try {
                userId = await getPrismaUserFromFirebase(firebaseUid, { email: userEmail });
                resolvedEmail = userEmail;
            } catch (e) {
                console.error("Firebase auth resolution failed", e);
            }
        }

        // 2. Fallback to NextAuth
        if (!userId) {
            const session = await getServerSession(req, res, authOptions);
            if (session) {
                userId = await getSessionUserId(session);
                resolvedEmail = session.user.email;
            }
        }

        if (!userId && !resolvedEmail) {
            return res.status(401).json({ error: 'Please login to submit a return request' });
        }

        if (!orderId || !returnType || !returnReason) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const order = await prisma.order.findUnique({
            where: { id: parseInt(orderId) }
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Check ownership
        const isOwner = (order.userId && order.userId === userId) || (resolvedEmail && order.customerEmail === resolvedEmail);

        if (!isOwner) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        if (order.status !== 'DELIVERED') {
            return res.status(400).json({ error: 'Only delivered orders can be returned or refunded' });
        }

        const updatedOrder = await prisma.order.update({
            where: { id: parseInt(orderId) },
            data: {
                status: `${returnType}_REQUESTED`,
                returnType,
                returnReason,
                returnComments,
                returnStatus: 'REQUESTED',
                returnImages: returnImages ? JSON.stringify(returnImages) : null
            }
        });

        res.status(200).json({ success: true, order: updatedOrder });
    } catch (error) {
        console.error('Return request error:', error);
        res.status(500).json({ error: 'Failed to submit return request' });
    }
}

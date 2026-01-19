import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getSessionUserId } from "@/lib/user";
import { getPrismaUserFromFirebase } from "@/lib/userUtils";

export default async function handler(req, res) {
    const { id, userId: queryUserId, email: queryEmail } = req.query;

    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        let userId = null;
        let userEmail = null;
        let isAdmin = false;

        // 1. Try Firebase Auth via Query Params
        if (queryUserId) {
            try {
                userId = await getPrismaUserFromFirebase(queryUserId, { email: queryEmail });
                userEmail = queryEmail;
                // Basic Admin Check (Insecure: Client claims role? No. We need to fetch role from DB using userId)
                if (userId) {
                    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
                    if (dbUser && dbUser.role === 'ADMIN') isAdmin = true;
                }
            } catch (e) {
                console.error("Firebase auth resolution failed", e);
            }
        }

        // 2. Fallback to NextAuth
        if (!userId) {
            const session = await getServerSession(req, res, authOptions);
            if (session) {
                userId = await getSessionUserId(session);
                userEmail = session.user.email;
                isAdmin = session.user.role === 'ADMIN';
            }
        }

        if (!userId && !userEmail) {
            return res.status(401).json({ error: 'Please login to view order details' });
        }

        const orderId = parseInt(id);
        if (isNaN(orderId)) {
            return res.status(400).json({ error: 'Invalid Order ID' });
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                user: true
            }
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Check ownership
        const isOwner = (order.userId && order.userId === userId) ||
            (userEmail && order.customerEmail === userEmail);

        if (!isAdmin && !isOwner) {
            return res.status(403).json({ error: 'You do not have permission to view this order' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Fetch order detail error:', error);
        res.status(500).json({ error: 'Failed to fetch order details' });
    }
}

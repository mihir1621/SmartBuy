import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getSessionUserId } from "@/lib/user";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const session = await getServerSession(req, res, authOptions);
        if (!session) {
            return res.status(401).json({ error: 'Please login to submit a return request' });
        }

        const userId = await getSessionUserId(session);
        const { orderId, returnType, returnReason, returnComments, returnImages } = req.body;

        if (!orderId || !returnType || !returnReason) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const order = await prisma.order.findUnique({
            where: { id: parseInt(orderId) }
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (order.userId !== userId) {
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

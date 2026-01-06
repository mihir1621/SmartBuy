import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getSessionUserId } from "@/lib/user";

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const session = await getServerSession(req, res, authOptions);
        if (!session) {
            return res.status(401).json({ error: 'Please login to view order details' });
        }

        const userId = await getSessionUserId(session);
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

        // Check ownership (unless admin)
        const isAdmin = session.user.role === 'ADMIN';
        if (!isAdmin && order.userId !== userId) {
            return res.status(403).json({ error: 'You do not have permission to view this order' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Fetch order detail error:', error);
        res.status(500).json({ error: 'Failed to fetch order details' });
    }
}

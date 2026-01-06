import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getSessionUserId } from '@/lib/user';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const session = await getServerSession(req, res, authOptions);

        if (!session) {
            return res.status(401).json({ error: 'Please login to view your orders' });
        }

        const userId = await getSessionUserId(session);
        if (!userId) return res.status(200).json([]); // No user, no orders

        const orders = await prisma.order.findMany({
            where: {
                userId: userId
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.status(200).json(orders);
    } catch (error) {
        console.error('Fetch order history error:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
}

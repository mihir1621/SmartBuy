import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user.role !== 'ADMIN') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'GET') {
        try {
            const orders = await prisma.order.findMany({
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    },
                    user: true
                },
                orderBy: { createdAt: 'desc' }
            });
            res.status(200).json(orders);
        } catch (error) {
            console.error('Fetch orders error', error);
            // Fallback for demo if DB not migrate yet
            res.status(200).json([]);
        }
    } else if (req.method === 'PUT') {
        const { id, status, paymentStatus } = req.body;
        try {
            const order = await prisma.order.update({
                where: { id: parseInt(id) },
                data: { status, paymentStatus }
            });
            res.status(200).json(order);
        } catch (error) {
            res.status(500).json({ error: 'Update failed' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user.role !== 'ADMIN') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const order = await prisma.order.findUnique({
                where: { id: parseInt(id) },
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

            res.status(200).json(order);
        } catch (error) {
            console.error('Fetch order detail error', error);
            res.status(500).json({ error: 'Error fetching order' });
        }
    } else if (req.method === 'PUT') {
        const { status, paymentStatus } = req.body;
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

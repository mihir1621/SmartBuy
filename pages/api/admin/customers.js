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
            const users = await prisma.user.findMany({
                include: {
                    orders: true
                },
                orderBy: { createdAt: 'desc' }
            });
            res.status(200).json(users);
        } catch (error) {
            console.error('Fetch users error', error);
            res.status(200).json([]);
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

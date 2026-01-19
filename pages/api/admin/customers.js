import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getPrismaUserFromFirebase } from "@/lib/userUtils";

export default async function handler(req, res) {
    let resolvedRole = null;

    // 1. Try Firebase Auth
    const queryUserId = req.query.userId || req.body.userId;
    const queryEmail = req.query.email || req.body.email;

    if (queryUserId) {
        try {
            const resolvedUserId = await getPrismaUserFromFirebase(queryUserId, { email: queryEmail });
            if (resolvedUserId) {
                const user = await prisma.user.findUnique({ where: { id: resolvedUserId } });
                if (user) resolvedRole = user.role;
            }
        } catch (e) {
            console.error("Firebase admin auth failed", e);
        }
    }

    // 2. Fallback to NextAuth
    if (resolvedRole !== 'ADMIN') {
        const session = await getServerSession(req, res, authOptions);
        if (session && session.user && session.user.role === 'ADMIN') {
            resolvedRole = 'ADMIN';
        }
    }

    if (resolvedRole !== 'ADMIN') {
        return res.status(401).json({ error: 'Unauthorized: Admin access required' });
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

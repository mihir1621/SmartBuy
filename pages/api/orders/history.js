import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getSessionUserId } from '@/lib/user';
import { getPrismaUserFromFirebase } from '@/lib/userUtils';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        // Support for Firebase Auth
        const queryUserId = req.query.userId;
        const queryEmail = req.query.email;

        let userId = null; // SQL Int ID
        let userEmail = null;

        if (queryUserId) {
            try {
                // Resolve SQL ID using provided UID and Email
                userId = await getPrismaUserFromFirebase(queryUserId, {
                    email: queryEmail
                });
                if (queryEmail) userEmail = queryEmail;
            } catch (e) {
                console.error("Firebase user resolution error", e);
            }
        }

        // Fallback to legacy NextAuth session if no query param
        if (!userId) {
            const session = await getServerSession(req, res, authOptions);
            if (session) {
                userId = await getSessionUserId(session);
                userEmail = session.user.email;
            } else {
                return res.status(401).json({ error: 'Please login to view your orders' });
            }
        }

        if (!userId) {
            return res.status(401).json({ error: 'User not found in system' });
        }

        const orders = await prisma.order.findMany({
            where: {
                OR: [
                    { userId: userId }, // Match by Integer User ID
                    {
                        AND: [
                            // Fallback for orders placed with email match but not linked to user ID yet?
                            // Actually, getPrismaUserFromFirebase would have returned the ID of that user.
                            // But for safety:
                            { customerEmail: userEmail ? userEmail : '___non_existent___' },
                            { userId: null }
                        ]
                    }
                ]
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

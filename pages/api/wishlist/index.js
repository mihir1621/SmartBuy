import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getSessionUserId } from '@/lib/user';

export default async function handler(req, res) {
    let userId = null;

    // 1. Try to get userId from Query (GET) or Body (POST) - Firebase Migration Support
    if (req.query.userId) {
        userId = req.query.userId;
    } else if (req.body.userId) {
        userId = req.body.userId;
    }

    // 2. Fallback to NextAuth Session if no direct userId provided
    if (!userId) {
        try {
            const session = await getServerSession(req, res, authOptions);
            if (session) {
                userId = await getSessionUserId(session);
            }
        } catch (e) {
            // Ignore session errors if we are migrating
            console.warn("Session check failed, possibly due to migration", e);
        }
    }

    if (!userId) {
        return res.status(401).json({ error: 'Not authenticated', details: 'No userId provided' });
    }

    if (req.method === 'GET') {
        try {
            const wishlistItems = await prisma.wishlistItem.findMany({
                where: { userId },
                include: { product: true },
                orderBy: { createdAt: 'desc' }
            });
            return res.status(200).json(wishlistItems.map(item => item.product));
        } catch (error) {
            console.error('Wishlist fetch error:', error);
            return res.status(500).json({ error: 'Failed to fetch wishlist' });
        }
    }

    if (req.method === 'POST') {
        const { productId } = req.body;
        if (!productId) return res.status(400).json({ error: 'Product ID required' });

        try {
            // Check if exists
            const existing = await prisma.wishlistItem.findUnique({
                where: {
                    userId_productId: {
                        userId,
                        productId: parseInt(productId)
                    }
                }
            });

            if (existing) {
                // Remove
                await prisma.wishlistItem.delete({
                    where: { id: existing.id }
                });
                return res.status(200).json({ action: 'removed' });
            } else {
                // Add
                await prisma.wishlistItem.create({
                    data: {
                        userId,
                        productId: parseInt(productId)
                    }
                });
                return res.status(201).json({ action: 'added' });
            }
        } catch (error) {
            console.error('Wishlist toggle error:', error);
            return res.status(500).json({ error: 'Failed to toggle wishlist' });
        }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
}

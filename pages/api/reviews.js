import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getSessionUserId } from '@/lib/user';
import { getPrismaUserFromFirebase } from '@/lib/userUtils';

export default async function handler(req, res) {
    // GET Handler
    if (req.method === 'GET') {
        const { productId } = req.query;
        if (!productId) return res.status(400).json({ error: 'Product ID required' });

        try {
            const reviews = await prisma.review.findMany({
                where: { productId: parseInt(productId) },
                include: { user: true },
                orderBy: { createdAt: 'desc' }
            });
            return res.status(200).json(reviews);
        } catch (error) {
            console.error('Reviews fetch error:', error);
            return res.status(500).json({ error: 'Failed to fetch reviews' });
        }
    }

    // POST Handler
    if (req.method === 'POST') {
        const { productId, rating, comment, userId: firebaseUid, userEmail, userName } = req.body;

        if (!productId || !rating || !comment) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Resolve Prisma User ID
        let prismaUserId = null;
        if (firebaseUid) {
            try {
                prismaUserId = await getPrismaUserFromFirebase(firebaseUid, {
                    email: userEmail,
                    name: userName
                });
            } catch (e) {
                console.error("Firebase user resolution failed", e);
            }
        }

        // Fallback to NextAuth if no proper firebase resolution
        if (!prismaUserId) {
            try {
                const session = await getServerSession(req, res, authOptions);
                if (session) {
                    prismaUserId = await getSessionUserId(session);
                }
            } catch (e) {
                // Ignore
            }
        }

        if (!prismaUserId) {
            return res.status(401).json({ error: 'Please login to write a review' });
        }

        try {
            // Create review
            const review = await prisma.review.create({
                data: {
                    rating: parseInt(rating),
                    comment,
                    userId: prismaUserId, // Use the INT id
                    productId: parseInt(productId)
                },
                include: { user: true }
            });

            // Update product average rating
            const allReviews = await prisma.review.findMany({
                where: { productId: parseInt(productId) }
            });

            const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

            await prisma.product.update({
                where: { id: parseInt(productId) },
                data: {
                    rating: parseFloat(avgRating.toFixed(1)),
                    reviews: allReviews.length
                }
            });

            return res.status(201).json(review);
        } catch (error) {
            console.error('Review submit error:', error);
            return res.status(500).json({ error: 'Failed to submit review' });
        }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
}

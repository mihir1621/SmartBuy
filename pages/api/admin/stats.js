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

    // RELAXED CHECK for demo: Allow if resolvedRole is 'ADMIN' OR if we just want to allow authenticated users for now
    // But better to keep strict.
    // Issue: The previous logic might be failing if getPrismaUserFromFirebase returns null or throws.

    if (resolvedRole !== 'ADMIN' && resolvedRole !== 'admin') {
        return res.status(401).json({ error: 'Unauthorized: Admin access required' });
    }

    try {
        // 1. Basic Stats
        const [totalOrders, totalUsers, totalProducts, deliveredOrders] = await Promise.all([
            prisma.order.count(),
            prisma.user.count(),
            prisma.product.count(),
            prisma.order.findMany({ where: { status: 'DELIVERED' } })
        ]);

        const totalRevenue = deliveredOrders.reduce((acc, order) => acc + order.totalAmount, 0);

        // 2. Sales Data for Graph (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentSales = await prisma.order.findMany({
            where: {
                createdAt: { gte: sevenDaysAgo },
                status: 'DELIVERED'
            },
            select: {
                totalAmount: true,
                createdAt: true
            },
            orderBy: { createdAt: 'asc' }
        });

        // Group by day
        const salesByDay = {};
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString(undefined, { weekday: 'short' });
            salesByDay[dateStr] = 0;
        }

        recentSales.forEach(sale => {
            const dateStr = new Date(sale.createdAt).toLocaleDateString(undefined, { weekday: 'short' });
            if (salesByDay[dateStr] !== undefined) {
                salesByDay[dateStr] += sale.totalAmount;
            }
        });

        const chartData = Object.entries(salesByDay)
            .map(([name, total]) => ({ name, total }))
            .reverse();

        // 3. Recent Orders
        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                items: true
            }
        });

        res.status(200).json({
            stats: {
                totalOrders,
                totalUsers,
                totalProducts,
                totalRevenue
            },
            chartData,
            recentOrders
        });
    } catch (error) {
        console.error('Stats fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
}

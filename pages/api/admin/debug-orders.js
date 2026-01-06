import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
    try {
        const ordersCount = await prisma.order.count();
        const orders = await prisma.order.findMany({
            take: 5,
            include: {
                user: true
            }
        });
        const users = await prisma.user.findMany();

        return res.status(200).json({
            ordersCount,
            orders,
            usersCount: users.length,
            users: users.map(u => ({ id: u.id, phone: u.phone, name: u.name }))
        });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}

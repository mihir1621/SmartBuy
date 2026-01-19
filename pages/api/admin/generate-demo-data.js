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

    if (req.method === 'POST') {
        try {
            console.log('Starting demo data generation...');

            // 1. Get some random products to create orders
            // Explicitly select fields to avoid potential schema mismatch errors (e.g. phantom sellerId)
            const products = await prisma.product.findMany({
                take: 10,
                select: {
                    id: true,
                    price: true
                }
            });
            if (products.length === 0) {
                return res.status(400).json({ error: 'No products found. Please seed products first.' });
            }

            // 2. Create a demo customer if not exists
            const demoUser = await prisma.user.upsert({
                where: { phone: '9876543210' },
                update: {},
                create: {
                    phone: '9876543210',
                    name: 'Demo Customer',
                    email: 'demo@example.com',
                    role: 'USER'
                }
            });

            const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
            const names = ['Amit Sharma', 'Priya Patel', 'Raj Malhotra', 'Sanya Gupta', 'Vikram Singh'];

            // 3. Create 15 mock orders
            const createdOrders = [];
            for (let i = 0; i < 15; i++) {
                const randomProduct = products[Math.floor(Math.random() * products.length)];
                const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
                const randomName = names[Math.floor(Math.random() * names.length)];

                const order = await prisma.order.create({
                    data: {
                        customerName: randomName,
                        customerPhone: `900000000${i}`,
                        customerEmail: `${randomName.toLowerCase().replace(' ', '.')}@example.com`,
                        totalAmount: randomProduct.price * 2,
                        status: randomStatus,
                        paymentStatus: Math.random() > 0.3 ? 'PAID' : 'UNPAID',
                        userId: demoUser.id,
                        items: {
                            create: {
                                productId: randomProduct.id,
                                quantity: 2,
                                price: randomProduct.price
                            }
                        }
                    }
                });
                createdOrders.push(order);
            }

            console.log(`Created ${createdOrders.length} mock orders successfully.`);
            res.status(200).json({ message: `Successfully created ${createdOrders.length} mock orders!`, count: createdOrders.length });
        } catch (error) {
            console.error('Demo data generation error:', error);
            res.status(500).json({ error: 'Failed to generate demo data: ' + error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

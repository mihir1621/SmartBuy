import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { getPrismaUserFromFirebase } from "@/lib/userUtils";

const MOCK_CUSTOMERS = [
    { name: 'Rahul Sharma', email: 'rahul@example.com', phone: '9876543210' },
    { name: 'Anjali Gupta', email: 'anjali@example.com', phone: '9123456789' },
    { name: 'Amit Patel', email: 'amit@example.com', phone: '9988776655' },
    { name: 'Priya Singh', email: 'priya@example.com', phone: '9000011111' },
    { name: 'Suresh Kumar', email: 'suresh@example.com', phone: '9888877777' },
];

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
            console.log('Starting data generation...');

            // 1. Fetch some products to create orders
            const products = await prisma.product.findMany({ take: 10 });
            if (products.length === 0) {
                return res.status(400).json({ error: 'No products in database. Seed products first.' });
            }

            const generatedOrders = [];

            for (let i = 0; i < 15; i++) {
                const customer = MOCK_CUSTOMERS[Math.floor(Math.random() * MOCK_CUSTOMERS.length)];

                // Find or create user
                let user = await prisma.user.findUnique({ where: { phone: customer.phone } });
                if (!user) {
                    user = await prisma.user.create({
                        data: {
                            name: customer.name,
                            email: customer.email,
                            phone: customer.phone,
                            role: 'USER'
                        }
                    });
                }

                // Randomly pick products for order
                const numItems = Math.floor(Math.random() * 3) + 1;
                const orderItemsData = [];
                let totalAmount = 0;

                for (let j = 0; j < numItems; j++) {
                    const product = products[Math.floor(Math.random() * products.length)];
                    const quantity = Math.floor(Math.random() * 2) + 1;
                    const price = product.price;
                    totalAmount += price * quantity;

                    orderItemsData.push({
                        productId: product.id,
                        quantity: quantity,
                        price: price
                    });
                }

                const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
                const status = statuses[Math.floor(Math.random() * statuses.length)];

                const order = await prisma.order.create({
                    data: {
                        customerName: customer.name,
                        customerPhone: customer.phone,
                        customerEmail: customer.email,
                        totalAmount: totalAmount,
                        status: status,
                        paymentStatus: status === 'DELIVERED' ? 'PAID' : 'UNPAID',
                        userId: user.id,
                        items: {
                            create: orderItemsData
                        }
                    }
                });
                generatedOrders.push(order);
            }

            res.status(200).json({
                message: 'Mock data generated successfully',
                ordersCreated: generatedOrders.length
            });
        } catch (error) {
            console.error('Data generation error:', error);
            res.status(500).json({ error: 'Failed to generate mock data', details: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

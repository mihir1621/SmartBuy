import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const session = await getServerSession(req, res, authOptions);
        const { customerInfo, items, totalAmount } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // Create the order in a transaction
        const order = await prisma.$transaction(async (tx) => {
            // 1. Check and Update Stock for each item
            for (const item of items) {
                const product = await tx.product.findUnique({
                    where: { id: parseInt(item.id) },
                    select: { stock: true, name: true }
                });

                if (!product || product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for product: ${product?.name || item.id}`);
                }

                // Update product stock
                const newStock = product.stock - item.quantity;
                await tx.product.update({
                    where: { id: parseInt(item.id) },
                    data: {
                        stock: newStock,
                        inStock: newStock > 0
                    }
                });
            }

            // 2. Create the order
            const newOrder = await tx.order.create({
                data: {
                    customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
                    customerPhone: customerInfo.phone || "N/A",
                    customerEmail: customerInfo.email,
                    totalAmount: totalAmount,
                    status: 'PENDING',
                    paymentStatus: 'PAID', // Simplified for demo
                    userId: session?.user?.id ? parseInt(session.user.id) : null,
                    shippingAddress: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.postalCode}`,
                    items: {
                        create: items.map(item => ({
                            productId: item.id,
                            quantity: item.quantity,
                            price: item.price
                        }))
                    }
                },
                include: {
                    items: true
                }
            });

            return newOrder;
        });

        res.status(201).json({ message: 'Order created successfully', orderId: order.id });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ error: 'Failed to create order: ' + error.message });
    }
}

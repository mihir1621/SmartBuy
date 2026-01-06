import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getSessionUserId } from '@/lib/user';

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

        // Safer User ID resolution
        const userId = await getSessionUserId(session);

        console.log('Creating order for:', customerInfo.email);
        console.log('Items count:', items.length);

        // Create the order in a transaction
        const order = await prisma.$transaction(async (tx) => {
            // 1. Check and Update Stock for each item
            for (const item of items) {
                console.log(`Checking stock for SKU: ${item.id}`);
                const product = await tx.product.findUnique({
                    where: { id: parseInt(item.id) },
                    select: { stock: true, name: true }
                });

                if (!product || product.stock < item.quantity) {
                    console.log(`Insufficient stock for ${product?.name || item.id}`);
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

            console.log('Stock updated, creating order record...');
            // 2. Create the order
            const newOrder = await tx.order.create({
                data: {
                    customerName: `${customerInfo.firstName} ${customerInfo.lastName || ''}`.trim(),
                    customerPhone: customerInfo.phone || "N/A",
                    customerEmail: customerInfo.email,
                    totalAmount: parseFloat(totalAmount),
                    status: 'PENDING',
                    paymentStatus: req.body.paymentInfo?.status === 'SUCCESS' ? 'PAID' : 'UNPAID',
                    paymentMethod: req.body.paymentInfo?.method || 'N/A',
                    userId: userId,
                    shippingAddress: `${customerInfo.address}, ${customerInfo.city || ''}, ${customerInfo.postalCode || ''}`.trim(),
                    items: {
                        create: items.map(item => ({
                            productId: parseInt(item.id),
                            quantity: parseInt(item.quantity),
                            price: parseFloat(item.price)
                        }))
                    }
                },
                include: {
                    items: true
                }
            });

            console.log('Order record created:', newOrder.id);
            return newOrder;
        });

        res.status(201).json({ message: 'Order created successfully', orderId: order.id });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ error: 'Failed to create order: ' + error.message });
    }
}

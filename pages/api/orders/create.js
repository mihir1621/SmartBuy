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

        // 1. Pre-calculate total and verify details (Outside transaction)
        let calculatedTotal = 0;
        const productsToUpdate = [];

        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: parseInt(item.id) },
                select: { id: true, stock: true, name: true, price: true }
            });

            if (!product || product.stock < item.quantity) {
                return res.status(400).json({ error: `Insufficient stock for product: ${product?.name || item.id}` });
            }

            calculatedTotal += product.price * item.quantity;
            productsToUpdate.push({
                id: product.id,
                newStock: product.stock - item.quantity,
                item: item
            });
        }

        // 2. Create Razorpay Order (External API - outside DB transaction)
        let razorpayOrderId = null;
        const useRazorpay = ['RAZORPAY', 'EMI'].includes(req.body.paymentMethod);

        if (useRazorpay) {
            const { razorpay } = await import('@/lib/razorpay');
            const razorOrder = await razorpay.orders.create({
                amount: Math.round(calculatedTotal * 100), // Amount in paise
                currency: "INR",
                receipt: `order_rcpt_${Date.now()}`
            });
            razorpayOrderId = razorOrder.id;
        }

        // 3. Execute DB Transaction (Deduct stock and create records)
        const order = await prisma.$transaction(async (tx) => {
            // Update stock
            for (const p of productsToUpdate) {
                await tx.product.update({
                    where: { id: p.id },
                    data: {
                        stock: p.newStock,
                        inStock: p.newStock > 0
                    }
                });
            }

            // Create Order record
            return await tx.order.create({
                data: {
                    customerName: `${customerInfo.firstName} ${customerInfo.lastName || ''}`.trim(),
                    customerPhone: customerInfo.phone || "N/A",
                    customerEmail: customerInfo.email,
                    totalAmount: parseFloat(calculatedTotal),
                    status: 'PENDING',
                    paymentStatus: 'UNPAID',
                    paymentMethod: req.body.paymentMethod || 'N/A',
                    razorpayOrderId: razorpayOrderId,
                    userId: userId,
                    shippingAddress: `${customerInfo.address}, ${customerInfo.city || ''}, ${customerInfo.postalCode || ''}`.trim(),
                    items: {
                        create: items.map(item => ({
                            productId: parseInt(item.id),
                            quantity: parseInt(item.quantity),
                            price: parseFloat(item.price)
                        }))
                    }
                }
            });
        }, {
            timeout: 10000 // 10 seconds timeout for the DB transaction
        });

        res.status(201).json({
            message: 'Order created successfully',
            orderId: order.id,
            razorpayOrderId: razorpayOrderId,
            amount: Math.round(order.totalAmount * 100),
            currency: "INR"
        });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ error: 'Failed to create order: ' + error.message });
    }
}

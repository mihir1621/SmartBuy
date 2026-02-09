import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getSessionUserId } from '@/lib/user';
import { getPrismaUserFromFirebase } from '@/lib/userUtils';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    // Retry helper for DB operations
    const runWithRetry = async (fn, retries = 5) => {
        const delays = [2000, 5000, 10000, 10000, 10000];
        for (let i = 0; i < retries; i++) {
            try {
                return await fn();
            } catch (error) {
                if (i === retries - 1) throw error;
                const waitTime = delays[i] || 10000;
                console.warn(`DB Operation failed, retrying (${i + 1}/${retries}) in ${waitTime}ms...`, error.message);
                await new Promise(res => setTimeout(res, waitTime));
            }
        }
    };

    try {
        const session = await getServerSession(req, res, authOptions);
        const { customerInfo, items, totalAmount, userId: firebaseUid } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // Safer User ID resolution
        let userId = null;

        // 1. Try Firebase Auth
        if (firebaseUid) {
            try {
                userId = await getPrismaUserFromFirebase(firebaseUid, {
                    name: `${customerInfo.firstName} ${customerInfo.lastName || ''}`.trim(),
                    email: customerInfo.email,
                    phone: customerInfo.phone
                });
            } catch (e) {
                console.error("Firebase auth resolution failed in order creation", e);
            }
        }

        // 2. Fallback to NextAuth
        if (!userId && session) {
            userId = await getSessionUserId(session);
        }

        console.log('Creating order for:', customerInfo.email);

        // 1. Pre-calculate total and verify details (Outside transaction)
        let calculatedTotal = 0;
        const productsToUpdate = [];

        for (const item of items) {
            const product = await runWithRetry(() => prisma.product.findUnique({
                where: { id: parseInt(item.id) },
                select: { id: true, stock: true, name: true, price: true }
            }));

            if (!product) {
                return res.status(404).json({ error: `Product not found: ${item.id}. Your cart may contain outdated items. Please clear your cart and try again.` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ error: `Insufficient stock for product: ${product.name}. Available: ${product.stock}` });
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

            if (!razorpay) {
                // Hardcoded fallback for Vercel deployment where env vars might be missing
                const { Razorpay } = await import('razorpay');
                razorpayOrderId = await new Razorpay({
                    key_id: "rzp_live_S0gsfixyYxgeBh",
                    key_secret: "2N1mGTb8pH1VEUG1XoEtpLHW"
                }).orders.create({
                    amount: Math.round(calculatedTotal * 100),
                    currency: "INR",
                    receipt: `order_rcpt_${Date.now()}`
                }).then(order => order.id);
            } else {
                const razorOrder = await razorpay.orders.create({
                    amount: Math.round(calculatedTotal * 100), // Amount in paise
                    currency: "INR",
                    receipt: `order_rcpt_${Date.now()}`
                });
                razorpayOrderId = razorOrder.id;
            }
        }

        // 3. Execute DB Transaction (Deduct stock and create records)
        const order = await runWithRetry(() => prisma.$transaction(async (tx) => {
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
                    userId: userId, // Can be null if guest
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
            timeout: 25000 // Increased timeout for the DB transaction
        }));

        res.status(201).json({
            message: 'Order created successfully',
            orderId: order.id,
            razorpayOrderId: razorpayOrderId,
            amount: Math.round(order.totalAmount * 100),
            currency: "INR",
            razorpayKeyId: process.env.RAZORPAY_KEY_ID || "rzp_live_S0gsfixyYxgeBh"
        });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ error: 'Failed to create order: ' + error.message });
    }
}

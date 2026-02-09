import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(JSON.stringify(req.body))
        .digest('hex');

    if (expectedSignature !== signature) {
        return res.status(400).json({ status: 'invalid signature' });
    }

    const event = req.body.event;
    const payload = req.body.payload.payment.entity;

    // Retry helper
    const runWithRetry = async (fn, retries = 3) => {
        for (let i = 0; i < retries; i++) {
            try {
                return await fn();
            } catch (error) {
                if (i === retries - 1) throw error;
                console.warn(`Webhook DB retry (${i + 1})...`);
                await new Promise(res => setTimeout(res, 1000 * (i + 1)));
            }
        }
    };

    try {
        if (event === 'payment.captured') {
            const razorpayOrderId = payload.order_id;

            // Update order status if not already updated by the frontend verification
            const order = await runWithRetry(() => prisma.order.findUnique({
                where: { razorpayOrderId: razorpayOrderId }
            }));

            if (order && order.paymentStatus !== 'PAID') {
                await runWithRetry(() => prisma.order.update({
                    where: { id: order.id },
                    data: {
                        status: 'PROCESSING',
                        paymentStatus: 'PAID',
                        razorpayPaymentId: payload.id
                    }
                }));
            }
        } else if (event === 'payment.failed') {
            const razorpayOrderId = payload.order_id;
            await runWithRetry(() => prisma.order.updateMany({
                where: { razorpayOrderId: razorpayOrderId },
                data: {
                    status: 'CANCELLED',
                    paymentStatus: 'FAILED'
                }
            }));
        }

        res.status(200).json({ status: 'ok' });
    } catch (error) {
        console.error('Webhook retry failed:', error);
        res.status(500).json({ error: error.message });
    }
}

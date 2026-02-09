import { prisma } from '@/lib/prisma';
import { withRetry } from '@/lib/db-retry';
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

    try {
        if (event === 'payment.captured') {
            const razorpayOrderId = payload.order_id;

            // Update order status if not already updated by the frontend verification
            const order = await withRetry(
                () => prisma.order.findUnique({
                    where: { razorpayOrderId: razorpayOrderId }
                }),
                { operationName: 'Find Order for Payment Capture' }
            );

            if (order && order.paymentStatus !== 'PAID') {
                await withRetry(
                    () => prisma.order.update({
                        where: { id: order.id },
                        data: {
                            status: 'PROCESSING',
                            paymentStatus: 'PAID',
                            razorpayPaymentId: payload.id
                        }
                    }),
                    { operationName: 'Update Order Payment Status' }
                );
            }
        } else if (event === 'payment.failed') {
            const razorpayOrderId = payload.order_id;
            await withRetry(
                () => prisma.order.updateMany({
                    where: { razorpayOrderId: razorpayOrderId },
                    data: {
                        status: 'CANCELLED',
                        paymentStatus: 'FAILED'
                    }
                }),
                { operationName: 'Mark Order as Failed' }
            );
        }

        res.status(200).json({ status: 'ok' });
    } catch (error) {
        console.error('Webhook processing failed:', error);
        res.status(500).json({ error: error.message });
    }
}

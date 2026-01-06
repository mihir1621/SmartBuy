import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId // Our internal order ID
        } = req.body;

        // Verify the signature
        const secret = process.env.RAZORPAY_KEY_SECRET;
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body.toString())
            .digest('hex');

        const isSignatureValid = expectedSignature === razorpay_signature;

        if (isSignatureValid) {
            // Update order status in DB
            await prisma.order.update({
                where: { id: parseInt(orderId) },
                data: {
                    status: 'PROCESSING',
                    paymentStatus: 'PAID',
                    razorpayPaymentId: razorpay_payment_id,
                    razorpaySignature: razorpay_signature
                }
            });

            return res.status(200).json({ status: 'success', message: 'Payment verified and order updated' });
        } else {
            // Potential tampering
            await prisma.order.update({
                where: { id: parseInt(orderId) },
                data: {
                    status: 'CANCELLED',
                    paymentStatus: 'FAILED'
                }
            });
            return res.status(400).json({ status: 'failure', message: 'Invalid signature' });
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ error: 'Verification failed: ' + error.message });
    }
}

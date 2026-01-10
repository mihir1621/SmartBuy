import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user.role !== 'SELLER') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method !== 'PATCH') {
        res.setHeader('Allow', ['PATCH']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { id } = req.query; // This is Order ID
    const { status } = req.body;
    const sellerId = parseInt(session.user.id);
    const orderId = parseInt(id);

    try {
        // Verify this order belongs to seller (has items from seller)
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: { product: true }
                }
            }
        });

        if (!order) return res.status(404).json({ error: "Order not found" });

        const hasSellerItems = order.items.some(item => item.product.sellerId === sellerId);

        if (!hasSellerItems) {
            return res.status(403).json({ error: "Forbidden: Order does not contain your products" });
        }

        // In a real marketplace, we might only update the status of specific Line Items.
        // But for simplicity/MVP requested: "Update order status".
        // Use caution: If multiple sellers are in one order, changing global status is risky.
        // Assuming single-seller cart or global status authority for now based on requirements.

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status: status }
        });

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error("Update order error:", error);
        res.status(500).json({ error: "Failed to update order" });
    }
}

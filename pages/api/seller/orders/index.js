import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user.role !== 'SELLER') {
        return res.status(401).json({ error: 'Unauthorized: Sellers only' });
    }

    const sellerId = parseInt(session.user.id);

    try {
        // Find orders containing items that belong to this seller
        // Prisma doesn't support direct cross-table filtering perfectly in one go for "Order -> OrderItems -> Product -> SellerId" efficiently in `findMany` on top level Order easily without some `where` nesting.
        // Logic: Get orders where ANY orderItem has a product with sellerId = sellerId.

        const orders = await prisma.order.findMany({
            where: {
                items: {
                    some: {
                        product: {
                            sellerId: sellerId
                        }
                    }
                }
            },
            include: {
                items: {
                    include: {
                        product: true
                    },
                    where: {
                        // Only include items that belong to this seller in the response? 
                        // Though typically an order might have mixed items, for a "My Orders" view for a seller, 
                        // they probably should see the whole order or just their parts. 
                        // Usually marketplaces split orders or show just line items. 
                        // Let's filter items here so they don't see other sellers' products if mixed orders exist.
                        product: {
                            sellerId: sellerId
                        }
                    }
                },
                user: {
                    select: { name: true, phone: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json(orders);
    } catch (error) {
        console.error("Fetch seller orders error:", error);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
}

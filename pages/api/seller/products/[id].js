import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user.role !== 'SELLER') {
        return res.status(401).json({ error: 'Unauthorized: Sellers only' });
    }

    const { id } = req.query;
    const sellerId = parseInt(session.user.id);
    const productId = parseInt(id);

    // Verify ownership
    const existingProduct = await prisma.product.findUnique({
        where: { id: productId }
    });

    if (!existingProduct) {
        return res.status(404).json({ error: "Product not found" });
    }

    if (existingProduct.sellerId !== sellerId) {
        return res.status(403).json({ error: "Forbidden: You do not own this product" });
    }

    if (req.method === 'PUT') {
        const { name, description, price, category, stock, brand, image } = req.body;

        try {
            const updatedProduct = await prisma.product.update({
                where: { id: productId },
                data: {
                    name,
                    description,
                    price: parseFloat(price),
                    category,
                    stock: parseInt(stock),
                    inStock: parseInt(stock) > 0,
                    brand,
                    image
                }
            });
            res.status(200).json(updatedProduct);
        } catch (error) {
            console.error("Update product error:", error);
            res.status(500).json({ error: "Failed to update product" });
        }
    } else if (req.method === 'DELETE') {
        try {
            await prisma.product.delete({
                where: { id: productId }
            });
            res.status(200).json({ message: "Product deleted successfully" });
        } catch (error) {
            console.error("Delete product error:", error);
            res.status(500).json({ error: "Failed to delete product" });
        }
    } else {
        res.setHeader('Allow', ['PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

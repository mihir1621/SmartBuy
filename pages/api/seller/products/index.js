import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user.role !== 'SELLER') {
        return res.status(401).json({ error: 'Unauthorized: Seller access required' });
    }

    const sellerId = parseInt(session.user.id);

    if (req.method === 'GET') {
        try {
            const products = await prisma.product.findMany({
                where: { sellerId: sellerId },
                orderBy: { createdAt: 'desc' }
            });
            return res.status(200).json(products);
        } catch (error) {
            return res.status(500).json({ error: "Failed to fetch products" });
        }
    }

    if (req.method === 'POST') {
        try {
            const { name, description, price, originalPrice, stock, category, brand, image } = req.body;

            // Basic validation
            if (!name || !price || !stock) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            const product = await prisma.product.create({
                data: {
                    name,
                    description: description || '',
                    price: parseFloat(price),
                    originalPrice: parseFloat(originalPrice) || parseFloat(price) * 1.2, // Fake original price if missing
                    discount: 20, // Check logic elsewhere if dynamic
                    category,
                    stock: parseInt(stock) || 0,
                    inStock: parseInt(stock) > 0,
                    brand: brand || 'Generic',
                    image: image || 'https://via.placeholder.com/400',
                    sellerId: sellerId,
                    rating: 0,
                    reviews: 0,
                    isNew: true
                }
            });
            res.status(201).json(product);
        } catch (error) {
            console.error("Create product error:", error);
            res.status(500).json({ error: "Failed to create product: " + error.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

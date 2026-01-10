import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user.role !== 'SELLER') {
        return res.status(401).json({ error: 'Unauthorized: Sellers only' });
    }

    const sellerId = parseInt(session.user.id);

    if (req.method === 'POST') {
        try {
            // 1. Create Sample Products
            const sampleProducts = [
                {
                    name: "Vintage Leather Jacket",
                    description: "Premium handcrafted leather jacket with a distressed finish. Perfect for all seasons.",
                    price: 4999,
                    category: "Menswear",
                    image: "https://images.unsplash.com/photo-1551028919-ac66c5f80145?auto=format&fit=crop&w=500&q=80",
                    brand: "UrbanStyle",
                    stock: 15
                },
                {
                    name: "Wireless Noise Cancelling Headphones",
                    description: "High-fidelity audio with active noise cancellation and 30-hour battery life.",
                    price: 12999,
                    category: "Audio",
                    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80",
                    brand: "SoundMax",
                    stock: 8
                },
                {
                    name: "Ceramic Coffee Mug Set",
                    description: "Set of 4 handcrafted ceramic mugs. Microwave and dishwasher safe.",
                    price: 899,
                    category: "Home",
                    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=500&q=80",
                    brand: "HomeArts",
                    stock: 25
                }
            ];

            const createdProducts = [];
            for (const p of sampleProducts) {
                const product = await prisma.product.create({
                    data: {
                        ...p,
                        originalPrice: p.price * 1.2,
                        discount: 20,
                        rating: 4.5,
                        reviews: 12,
                        inStock: true,
                        isNew: true,
                        sellerId: sellerId // Link to seller
                    }
                });
                createdProducts.push(product);
            }

            // 2. Create Sample Orders for these products
            // Create a demo customer if needed (or reuse existing)
            // We'll just create orders directly linked to the user or guest

            const statuses = ['PENDING', 'SHIPPED', 'DELIVERED'];

            for (let i = 0; i < 5; i++) {
                const randomProduct = createdProducts[Math.floor(Math.random() * createdProducts.length)];

                await prisma.order.create({
                    data: {
                        customerName: `Customer ${i + 1}`,
                        customerPhone: `987650000${i}`,
                        customerEmail: `customer${i}@example.com`,
                        totalAmount: randomProduct.price,
                        status: statuses[i % 3], // Rotate statuses
                        paymentStatus: 'PAID',
                        items: {
                            create: {
                                productId: randomProduct.id,
                                quantity: 1,
                                price: randomProduct.price
                            }
                        }
                    }
                });
            }

            res.status(200).json({ message: "Demo data generated successfully!", count: createdProducts.length });
        } catch (error) {
            console.error("Demo data error:", error);
            res.status(500).json({ error: "Failed to generate demo data" });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

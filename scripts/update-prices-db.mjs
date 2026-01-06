import { PrismaClient } from '@prisma/client';
import { products } from '../data/products.js';

const prisma = new PrismaClient();

async function main() {
    console.log('Start updating product prices in DB...');

    for (const p of products) {
        // Try to find the product by name
        const existing = await prisma.product.findFirst({
            where: { name: p.name }
        });

        if (existing) {
            await prisma.product.update({
                where: { id: existing.id },
                data: {
                    price: p.price,
                    originalPrice: p.originalPrice,
                    discount: p.discount,
                    description: p.description // sometimes descriptions change too
                }
            });
            console.log(`Updated price for: ${p.name} -> ₹${p.price}`);
        } else {
            // If doesn't exist, create it (optional, but keep it consistent)
            await prisma.product.create({
                data: {
                    name: p.name,
                    category: p.category,
                    price: p.price,
                    originalPrice: p.originalPrice,
                    discount: p.discount,
                    rating: p.rating,
                    reviews: p.reviews,
                    brand: p.brand,
                    image: p.image,
                    description: p.description,
                    inStock: p.inStock,
                    isNew: p.isNew || false
                }
            });
            console.log(`Created new product: ${p.name}`);
        }
    }

    console.log('Update finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

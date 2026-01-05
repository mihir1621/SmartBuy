import { PrismaClient } from '@prisma/client';
import { products } from '../data/products.js';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    // Clear existing products
    await prisma.product.deleteMany();
    console.log('Deleted existing products');

    for (const p of products) {
        await prisma.product.create({
            data: {
                id: p.id,
                name: p.name,
                category: p.category,
                price: p.price,
                originalPrice: p.originalPrice,
                discount: p.discount,
                rating: p.rating,
                reviews: p.reviews,
                brand: p.brand,
                image: p.image,
                images: p.images ? p.images : null,
                description: p.description,
                inStock: p.inStock,
                isNew: p.isNew || false,
            },
        });
        console.log(`Created product with id: ${p.id}`);
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

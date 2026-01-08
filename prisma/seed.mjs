import { PrismaClient } from '@prisma/client';
import { products } from '../data/products.js';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    // Clear existing related data
    await prisma.orderItem.deleteMany();
    await prisma.review.deleteMany();
    await prisma.wishlistItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    console.log('Deleted existing products and related data');

    for (const p of products) {
        await prisma.product.create({
            data: {
                id: parseInt(p.id),
                name: p.name,
                category: p.category,
                price: parseFloat(p.price),
                originalPrice: parseFloat(p.originalPrice),
                discount: parseInt(p.discount || 0),
                rating: parseFloat(p.rating || 0),
                reviews: parseInt(p.reviews || 0),
                brand: p.brand || 'N/A',
                image: p.image,
                images: p.images ? p.images : null,
                description: p.description || '',
                stock: 999,
                inStock: p.inStock !== undefined ? p.inStock : true,
                isNew: p.isNew || false,
            },
        });
        console.log(`Created product: ${p.name}`);
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

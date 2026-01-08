const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    // Group products by image URL to find duplicates
    const imageCounts = await prisma.product.groupBy({
        by: ['image'],
        _count: {
            image: true,
        },
        orderBy: {
            _count: {
                image: 'desc',
            }
        },
        take: 10
    });

    console.log('Top 10 most frequent images:');
    console.log(imageCounts);

    // Also verify if different categories are using the same image
    const products = await prisma.product.findMany({
        select: {
            id: true,
            name: true,
            category: true,
            image: true
        }
    });

    // Check for "category appropriate" violation
    // e.g. Footwear image used for Electronics
    // For now, let's just inspect some samples.
    console.log('\nSample products and their images:');
    products.slice(0, 5).forEach(p => console.log(`${p.id}: [${p.category}] ${p.name} -> ${p.image}`));
    products.slice(100, 105).forEach(p => console.log(`${p.id}: [${p.category}] ${p.name} -> ${p.image}`));
}
main().finally(() => prisma.$disconnect());

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const products = await prisma.product.findMany({
        where: { category: 'Footwear' },
        select: { id: true, name: true, image: true },
        take: 20
    });
    console.log('Footwear products:');
    products.forEach(p => console.log(`${p.id}: ${p.name} -> ${p.image}`));
}
main().finally(() => prisma.$disconnect());

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const products = await prisma.product.findMany({ select: { id: true, name: true, image: true }, take: 5 });
    console.log('Verified Images in DB:');
    products.forEach(p => console.log(`${p.id}: ${p.name} -> ${p.image}`));
}
main().finally(() => prisma.$disconnect());

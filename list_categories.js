const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const categories = await prisma.product.groupBy({
        by: ['category'],
        _count: { category: true }
    });
    console.log(categories);
}
main().finally(() => prisma.$disconnect());

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const id = 294;
    console.log(`Checking for product ID: ${id}`);
    const product = await prisma.product.findUnique({
        where: { id: id }
    });
    console.log("Result:", product);

    // Also list top 5 products to see what IDs look like
    const all = await prisma.product.findMany({ take: 5, orderBy: { id: 'desc' } });
    console.log("Recent 5 products:", all.map(p => ({ id: p.id, name: p.name })));
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });

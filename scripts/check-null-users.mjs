
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const nullUserOrders = await prisma.order.findMany({
        where: { userId: null },
        orderBy: { createdAt: 'desc' },
        take: 5
    });

    console.log('NULL_USER_ORDERS_START');
    nullUserOrders.forEach(o => {
        console.log(`ID: ${o.id} | Email: ${o.customerEmail} | Date: ${o.createdAt}`);
    });
    console.log('NULL_USER_ORDERS_END');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());

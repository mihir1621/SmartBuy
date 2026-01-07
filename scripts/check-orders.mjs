
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: {
            id: true,
            status: true,
            paymentStatus: true,
            userId: true,
            customerEmail: true,
            createdAt: true
        }
    });

    console.log('ORDER_DUMP_START');
    orders.forEach(o => {
        console.log(`ID: ${o.id} | Status: ${o.status} | Payment: ${o.paymentStatus} | UserID: ${o.userId} | Email: ${o.customerEmail} | Date: ${o.createdAt}`);
    });
    console.log('ORDER_DUMP_END');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());

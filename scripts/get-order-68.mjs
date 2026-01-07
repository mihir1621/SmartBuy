
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const o = await prisma.order.findUnique({ where: { id: 68 } });
    console.log(JSON.stringify(o, null, 2));
}

main().finally(() => prisma.$disconnect());

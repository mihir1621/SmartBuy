
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findUnique({
        where: { phone: '9999999999' }
    });
    console.log(user ? `Found user: ${user.id}` : 'User not found');
}

main().finally(() => prisma.$disconnect());

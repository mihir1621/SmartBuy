
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({ take: 10 });
    console.log('USERS_DUMP_START');
    users.forEach(u => {
        console.log(`ID: ${u.id} | Email: ${u.email} | Phone: ${u.phone}`);
    });
    console.log('USERS_DUMP_END');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());

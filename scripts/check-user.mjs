
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findUnique({
        where: { email: 'johm@gmail.com' }
    });

    console.log('USER_CHECK_START');
    console.log(user ? `ID: ${user.id} | Email: ${user.email}` : 'User not found');
    console.log('USER_CHECK_END');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());

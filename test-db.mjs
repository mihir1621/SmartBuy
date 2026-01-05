import { prisma } from './lib/prisma.js';

async function test() {
    try {
        console.log('Testing database connection...');
        const count = await prisma.product.count();
        console.log(`Connection successful! Product count: ${count}`);
    } catch (error) {
        console.error('Database connection failed:');
        console.error(error.message);
    } finally {
        await prisma.$disconnect();
    }
}

test();

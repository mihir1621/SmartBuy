import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('Starting demo data generation...');

    // 1. Get some random products
    const products = await prisma.product.findMany({
        take: 10,
        select: {
            id: true,
            price: true
        }
    });

    if (products.length === 0) {
        console.error('No products found. Please seed products first.');
        return;
    }

    // 2. Create a demo customer if not exists
    const demoUser = await prisma.user.upsert({
        where: { phone: '9876543210' },
        update: {},
        create: {
            phone: '9876543210',
            name: 'Demo Customer',
            email: 'demo@example.com',
            role: 'USER'
        }
    });

    const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    const names = ['Amit Sharma', 'Priya Patel', 'Raj Malhotra', 'Sanya Gupta', 'Vikram Singh'];

    // 3. Create 15 mock orders
    const createdOrders = [];
    for (let i = 0; i < 15; i++) {
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const randomName = names[Math.floor(Math.random() * names.length)];

        const order = await prisma.order.create({
            data: {
                customerName: randomName,
                customerPhone: `900000000${i}`,
                customerEmail: `${randomName.toLowerCase().replace(' ', '.')}@example.com`,
                totalAmount: randomProduct.price * 2,
                status: randomStatus,
                paymentStatus: Math.random() > 0.3 ? 'PAID' : 'UNPAID',
                userId: demoUser.id,
                items: {
                    create: {
                        productId: randomProduct.id,
                        quantity: 2,
                        price: randomProduct.price
                    }
                }
            }
        });
        createdOrders.push(order);
    }

    console.log(`Successfully created ${createdOrders.length} mock orders!`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

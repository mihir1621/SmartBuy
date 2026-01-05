import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { category, brand, minPrice, maxPrice, sort } = req.query;

            let where = {};
            if (category) where.category = category;
            if (brand) where.brand = brand;
            if (minPrice || maxPrice) {
                where.price = {
                    gte: minPrice ? parseFloat(minPrice) : undefined,
                    lte: maxPrice ? parseFloat(maxPrice) : undefined,
                };
            }

            let orderBy = {};
            if (sort === 'price_low') orderBy = { price: 'asc' };
            else if (sort === 'price_high') orderBy = { price: 'desc' };
            else if (sort === 'rating') orderBy = { rating: 'desc' };
            else orderBy = { createdAt: 'desc' };

            const products = await prisma.product.findMany({
                where,
                orderBy,
            });

            res.status(200).json(products);
        } catch (error) {
            console.error('Request error', error);
            res.status(500).json({ error: 'Error fetching products' });
        }
    } else if (req.method === 'POST') {
        try {
            const data = req.body;
            delete data.id; // Prisma handles autoincrement ID
            const product = await prisma.product.create({
                data: data
            });
            res.status(201).json(product);
        } catch (error) {
            console.error('Create product error', error);
            res.status(500).json({ error: 'Error creating product' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

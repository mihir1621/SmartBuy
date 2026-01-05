import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const product = await prisma.product.findUnique({
                where: { id: parseInt(id) },
            });

            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            res.status(200).json(product);
        } catch (error) {
            console.error('Request error', error);
            res.status(500).json({ error: 'Error fetching product' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

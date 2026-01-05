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
    } else if (req.method === 'PUT') {
        try {
            const data = req.body;
            delete data.id; // Ensure we don't try to update the ID
            const product = await prisma.product.update({
                where: { id: parseInt(id) },
                data: data,
            });
            res.status(200).json(product);
        } catch (error) {
            console.error('Update product error', error);
            res.status(500).json({ error: 'Error updating product' });
        }
    } else if (req.method === 'DELETE') {
        try {
            await prisma.product.delete({
                where: { id: parseInt(id) },
            });
            res.status(200).json({ message: 'Product deleted' });
        } catch (error) {
            console.error('Delete product error', error);
            res.status(500).json({ error: 'Error deleting product' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

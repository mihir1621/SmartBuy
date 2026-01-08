import { products } from '../../data/products';

export default function handler(req, res) {
    if (req.method === 'GET') {
        const categories = [...new Set(products.map(product => product.category))];
        const brands = [...new Set(products.map(product => product.brand))];

        res.status(200).json({
            products,
            blocks: {
                categories,
                brands
            },
            total: products.length
        });
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

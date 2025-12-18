import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';

import Link from 'next/link';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 group relative"
        >
            <Link href={`/product/${product.id}`} className="absolute inset-0 z-10">
                <span className="sr-only">View {product.name}</span>
            </Link>

            <div className="relative h-64 w-full overflow-hidden bg-gray-100">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm z-20">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-bold text-gray-700">{product.rating}</span>
                </div>
            </div>

            <div className="p-5">
                <div className="text-xs font-medium text-blue-500 mb-1 uppercase tracking-wider">{product.category}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">{product.name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between mt-auto">
                    <span className="text-xl font-bold text-gray-900">${product.price}</span>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                            e.preventDefault(); // Prevent link navigation
                            addToCart(product);
                        }}
                        className="bg-gray-900 text-white p-2.5 rounded-full hover:bg-gray-800 transition-colors shadow-md flex items-center justify-center relative z-20"
                        aria-label="Add to cart"
                    >
                        <ShoppingCart className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}

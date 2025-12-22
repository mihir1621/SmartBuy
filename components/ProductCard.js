import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Heart, Eye } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import Link from 'next/link';
import QuickViewModal from './QuickViewModal';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const isWishlisted = isInWishlist(product.id);
    const [showQuickView, setShowQuickView] = useState(false);

    return (
        <>
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

                    {/* Overlay Elements */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleWishlist(product);
                            }}
                            className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full hover:scale-110 transition-transform shadow-sm flex items-center justify-center"
                            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                        >
                            <Heart className={`w-4 h-4 ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                        </button>

                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowQuickView(true);
                            }}
                            className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full hover:scale-110 transition-transform shadow-sm flex items-center justify-center text-gray-700 hover:text-blue-600"
                            title="Quick View"
                        >
                            <Eye className="w-4 h-4" />
                        </button>

                        <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm mt-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs font-bold text-gray-700">{product.rating}</span>
                        </div>
                    </div>
                </div>

                <div className="p-5">
                    <div className="text-xs font-medium text-blue-500 mb-1 uppercase tracking-wider">{product.category}</div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">{product.name}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>

                    <div className="flex items-center justify-between mt-auto">
                        <span className="text-xl font-bold text-gray-900">₹{product.price}</span>

                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
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

            <QuickViewModal
                isOpen={showQuickView}
                onClose={() => setShowQuickView(false)}
                product={product}
            />
        </>
    );
}

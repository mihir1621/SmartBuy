import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, Heart } from 'lucide-react';
import StoreNavbar from '@/components/StoreNavbar';
import CartSidebar from '@/components/CartSidebar';
import Footer from '@/components/Footer';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

export default function Wishlist() {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Head>
                <title>My Wishlist | SmartBuy</title>
            </Head>

            <StoreNavbar onSearch={setSearchQuery} />
            <CartSidebar />

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <div className="flex items-center gap-3 mb-8">
                    <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                    <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                    <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-bold">
                        {wishlist.length} Items
                    </span>
                </div>

                {wishlist.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-12 h-12 text-red-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Your wishlist is empty</h2>
                        <p className="text-gray-500 max-w-md mx-auto mb-8">
                            Explore more items and add your favorites to the wishlist.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-all shadow-lg hover:shadow-xl"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {wishlist.map((product) => (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group relative"
                                >
                                    <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                removeFromWishlist(product.id);
                                            }}
                                            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm z-10"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="text-xs font-medium text-blue-500 mb-1 uppercase tracking-wider">{product.category}</div>
                                        <Link href={`/product/${product.id}`} className="block">
                                            <h3 className="text-lg font-bold text-gray-800 mb-1 truncate hover:text-blue-600 transition-colors">
                                                {product.name}
                                            </h3>
                                        </Link>
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                                            <span className="text-sm text-gray-400 line-through">₹{(product.price * 1.2).toFixed(0)}</span>
                                        </div>

                                        <button
                                            onClick={() => addToCart(product)}
                                            className="mt-auto w-full bg-gray-900 text-white font-medium py-3 rounded-xl hover:bg-gray-800 transition-all shadow-md flex items-center justify-center gap-2"
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            Move to Cart
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}

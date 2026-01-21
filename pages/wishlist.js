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

import { WishlistSkeleton } from '@/components/skeletons/PageSkeletons';

export default function Wishlist() {
    const { wishlist, removeFromWishlist, isInitialized } = useWishlist();
    const { addToCart } = useCart();
    const [searchQuery, setSearchQuery] = useState("");

    if (!isInitialized) return <WishlistSkeleton />;

    return (
        <div className="min-h-screen bg-black flex flex-col text-white">
            <Head>
                <title>My Wishlist | SmartBuy</title>
            </Head>

            <StoreNavbar onSearch={setSearchQuery} />
            <CartSidebar />

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
                <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-12">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                        <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-red-500 fill-red-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">My Wishlist</h1>
                        <p className="text-[10px] sm:text-xs font-black text-gray-500 uppercase tracking-[0.2em] mt-1">
                            {wishlist.length} {wishlist.length === 1 ? 'Product' : 'Products'} Saved
                        </p>
                    </div>
                </div>

                {wishlist.length === 0 ? (
                    <div className="text-center py-20 sm:py-32 bg-gray-900/40 rounded-[2.5rem] border border-gray-800/50 backdrop-blur-md">
                        <div className="bg-gray-800/50 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-700">
                            <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-white mb-2 sm:mb-3 uppercase tracking-tight">Your wishlist is empty</h2>
                        <p className="text-gray-500 text-sm sm:text-base max-w-xs sm:max-w-md mx-auto mb-8 sm:mb-10 font-medium">
                            Explore our premium collection and save your favorites for later.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-8 sm:px-10 py-3.5 sm:py-4 border border-transparent text-xs sm:text-sm font-black rounded-xl sm:rounded-2xl text-black bg-white hover:bg-gray-200 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-95 uppercase tracking-widest"
                        >
                            Explore Shop
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        <AnimatePresence>
                            {wishlist.map((product) => (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-gray-900/40 rounded-3xl border border-gray-800/50 overflow-hidden flex flex-col group relative hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/5"
                                >
                                    <div className="relative aspect-[4/5] bg-gray-950 overflow-hidden">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                removeFromWishlist(product.id);
                                            }}
                                            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 sm:p-2.5 bg-black/60 backdrop-blur-md rounded-xl text-gray-400 hover:text-red-500 transition-all shadow-xl z-20 hover:scale-110"
                                        >
                                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </button>
                                    </div>

                                    <div className="p-4 sm:p-6 flex flex-col flex-1">
                                        <div className="flex justify-between items-start mb-2 gap-2">
                                            <div className="text-[9px] sm:text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] truncate">{product.category}</div>
                                        </div>
                                        <Link href={`/product/${product.id}`} className="block">
                                            <h3 className="text-sm sm:text-base font-bold text-gray-100 mb-2 line-clamp-1 hover:text-white transition-colors tracking-tight">
                                                {product.name}
                                            </h3>
                                        </Link>
                                        <div className="flex items-center gap-2 mb-5 sm:mb-6">
                                            <span className="text-lg sm:text-xl font-black text-white tracking-tighter">₹{product.price.toLocaleString()}</span>
                                            <span className="text-[10px] sm:text-xs text-gray-600 line-through font-bold">₹{(product.price * 1.2).toLocaleString()}</span>
                                        </div>

                                        <button
                                            onClick={() => addToCart(product)}
                                            className="mt-auto w-full bg-white text-black font-black py-3 sm:py-3.5 rounded-xl sm:rounded-2xl hover:bg-gray-200 transition-all shadow-lg flex items-center justify-center gap-2 group/btn text-[10px] sm:text-xs uppercase tracking-widest active:scale-[0.98]"
                                        >
                                            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:scale-110 transition-transform" />
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

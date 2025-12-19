import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Truck, ShieldCheck, RotateCcw, Heart } from 'lucide-react';
import StoreNavbar from '@/components/StoreNavbar';
import CartSidebar from '@/components/CartSidebar';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { products } from '@/data/products';

import Link from 'next/link';
import Footer from '@/components/Footer';
import ProductReviews from "@/components/ProductReviews";
import ProductCard from '@/components/ProductCard';
import RecentlyViewed from "@/components/RecentlyViewed";

export default function ProductDetail() {
    const router = useRouter();
    const { id } = router.query;
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [selectedImage, setSelectedImage] = useState(0);
    const [recentProducts, setRecentProducts] = useState([]);

    // Find product
    const product = products.find((p) => p.id === parseInt(id));

    // Handle Recently Viewed Logic
    useEffect(() => {
        if (product) {
            const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
            const newViewed = [product, ...viewed.filter(p => p.id !== product.id)].slice(0, 10);
            localStorage.setItem('recentlyViewed', JSON.stringify(newViewed));
            setRecentProducts(newViewed.filter(p => p.id !== product.id));
        }
    }, [product]);

    // Get Related Products
    const relatedProducts = product
        ? products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)
        : [];

    const isWishlisted = product ? isInWishlist(product.id) : false;

    if (!product) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Head>
                <title>{product.name} | SmartBuy</title>
            </Head>

            <StoreNavbar />
            <CartSidebar />

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group">
                                <Image
                                    src={product.images ? product.images[selectedImage] : product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    priority
                                />
                                <button
                                    onClick={() => toggleWishlist(product)}
                                    className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform z-10"
                                >
                                    <Heart className={`w-6 h-6 ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                                </button>
                            </div>
                            {/* Thumbnail strip */}
                            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                                {(product.images || [product.image]).map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${selectedImage === idx ? 'border-gray-900 ring-2 ring-gray-200' : 'border-transparent opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col">
                            <div className="mb-6 border-b border-gray-100 pb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-blue-600 font-medium text-sm set-caps tracking-wider bg-blue-50 px-3 py-1 rounded-full">
                                        {product.category}
                                    </span>
                                </div>

                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
                                {product.brand && <p className="text-gray-500 font-medium mb-4">by {product.brand}</p>}

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100">
                                        <span className="font-bold text-gray-900 mr-1">{product.rating}</span>
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.floor(product.rating)
                                                    ? 'text-yellow-400 fill-yellow-400'
                                                    : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-500 border-l border-gray-200 pl-4">
                                        {product.reviews} verified ratings
                                    </span>
                                </div>

                                <div className="flex items-baseline gap-4">
                                    <span className="text-4xl font-bold text-gray-900">${product.price}</span>
                                    <span className="text-lg text-gray-400 line-through decoration-gray-400">${(product.price * 1.2).toFixed(0)}</span>
                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-bold">-20%</span>
                                </div>
                            </div>

                            <div className="space-y-8 flex-1">
                                <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>

                                {/* Features */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                                        <Truck className="w-5 h-5 text-gray-900" />
                                        <span>Free Delivery</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                                        <ShieldCheck className="w-5 h-5 text-gray-900" />
                                        <span>2 Year Warranty</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                                        <RotateCcw className="w-5 h-5 text-gray-900" />
                                        <span>30 Day Returns</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-4">
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => addToCart(product)}
                                        className="flex-1 bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg"
                                    >
                                        <ShoppingCart className="w-6 h-6" />
                                        Add to Cart
                                    </motion.button>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:bg-blue-700 text-lg"
                                    >
                                        Buy Now
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <ProductReviews product={product} />

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <ProductCard key={relatedProduct.id} product={relatedProduct} />
                            ))}
                        </div>
                    </section>
                )}

                <RecentlyViewed products={recentProducts} />
            </main>
            <Footer />
        </div>
    );
}

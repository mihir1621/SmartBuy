import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingCart, Truck, ShieldCheck, RotateCcw, Heart, CreditCard, X } from 'lucide-react';
import StoreNavbar from '@/components/StoreNavbar';
import CartSidebar from '@/components/CartSidebar';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { products as staticProducts } from '@/data/products';
import { prisma } from '@/lib/prisma';

import Link from 'next/link';
import Footer from '@/components/Footer';
import ProductReviews from "@/components/ProductReviews";
import ProductCard from '@/components/ProductCard';
import RecentlyViewed from "@/components/RecentlyViewed";
import EMICalculatorModal from "@/components/EMICalculatorModal";

export async function getServerSideProps({ params }) {
    const { id } = params;
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
        });

        if (!product) {
            return { notFound: true };
        }

        const relatedProducts = await prisma.product.findMany({
            where: {
                category: product.category,
                NOT: { id: product.id },
            },
            take: 4,
        });

        return {
            props: {
                initialProduct: JSON.parse(JSON.stringify(product)),
                initialRelatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
            },
        };
    } catch (error) {
        console.error("Database error:", error);
        const product = staticProducts.find((p) => p.id === parseInt(id));
        if (!product) return { notFound: true };
        const related = staticProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
        return {
            props: {
                initialProduct: product,
                initialRelatedProducts: related,
            },
        };
    }
}

export default function ProductDetail({ initialProduct, initialRelatedProducts }) {
    const product = initialProduct;
    const relatedProducts = initialRelatedProducts;
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [selectedImage, setSelectedImage] = useState(0);
    const [showEMIModal, setShowEMIModal] = useState(false);
    const [activeFeature, setActiveFeature] = useState(null);
    const [recentProducts, setRecentProducts] = useState([]);

    // Handle Recently Viewed Logic
    useEffect(() => {
        if (product) {
            const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
            const newViewed = [product, ...viewed.filter(p => p.id !== product.id)].slice(0, 10);
            localStorage.setItem('recentlyViewed', JSON.stringify(newViewed));
            setRecentProducts(newViewed.filter(p => p.id !== product.id));
        }
    }, [product]);

    const isWishlisted = product ? isInWishlist(product.id) : false;

    if (!product) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <Head>
                <title>{product.name} | SmartBuy</title>
            </Head>

            <StoreNavbar />
            <CartSidebar />

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="bg-gray-900 rounded-2xl shadow-sm border border-gray-800 overflow-hidden mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div className="relative aspect-square bg-gray-800 rounded-xl overflow-hidden group">
                                <Image
                                    src={product.images ? (typeof product.images === 'string' ? JSON.parse(product.images)[selectedImage] : product.images[selectedImage]) : product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    priority
                                />
                                <button
                                    onClick={() => toggleWishlist(product)}
                                    className="absolute top-4 right-4 p-3 bg-black/50 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform z-10"
                                >
                                    <Heart className={`w-6 h-6 ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-300'}`} />
                                </button>
                            </div>
                            {/* Thumbnail strip */}
                            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                                {((typeof product.images === 'string' ? JSON.parse(product.images) : product.images) || [product.image]).map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${selectedImage === idx ? 'border-white ring-2 ring-gray-700' : 'border-transparent opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col">
                            <div className="mb-6 border-b border-gray-800 pb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-blue-400 font-medium text-sm set-caps tracking-wider bg-blue-900/30 px-3 py-1 rounded-full">
                                        {product.category}
                                    </span>
                                </div>

                                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{product.name}</h1>
                                {product.brand && <p className="text-gray-400 font-medium mb-4">by {product.brand}</p>}

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex items-center gap-1 bg-yellow-900/30 px-2 py-1 rounded-md border border-yellow-900/50">
                                        <span className="font-bold text-gray-200 mr-1">{product.rating}</span>
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.floor(product.rating)
                                                    ? 'text-yellow-400 fill-yellow-400'
                                                    : 'text-gray-600'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-400 border-l border-gray-700 pl-4">
                                        {product.reviews} verified ratings
                                    </span>
                                </div>

                                <div className="flex items-baseline gap-4">
                                    <span className="text-4xl font-bold text-white">₹{product.price}</span>
                                    <span className="text-lg text-gray-500 line-through decoration-gray-500">₹{(product.price * 1.2).toFixed(0)}</span>
                                    <span className="bg-green-900/30 text-green-400 px-2 py-1 rounded text-sm font-bold border border-green-900">-20%</span>
                                </div>
                            </div>

                            <div className="space-y-8 flex-1">
                                <p className="text-gray-300 leading-relaxed text-lg">{product.description}</p>

                                {/* Features & Terms */}
                                <div className="min-h-[140px]">
                                    <AnimatePresence mode="wait">
                                        {activeFeature ? (
                                            <motion.div
                                                key="details"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="bg-gray-800 p-6 rounded-xl border border-gray-700 relative h-full"
                                            >
                                                <button
                                                    onClick={() => setActiveFeature(null)}
                                                    className="absolute top-4 right-4 p-1 hover:bg-gray-700 rounded-full transition-colors"
                                                >
                                                    <X className="w-5 h-5 text-gray-400" />
                                                </button>

                                                <div className="flex items-center gap-3 mb-4">
                                                    {activeFeature.icon}
                                                    <h3 className="font-bold text-white text-lg">{activeFeature.title}</h3>
                                                </div>

                                                <ul className="space-y-2">
                                                    {activeFeature.points.map((point, index) => (
                                                        <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                                            <span>{point}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="grid"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="grid grid-cols-2 gap-4"
                                            >
                                                <button
                                                    onClick={() => setActiveFeature({
                                                        title: "Free Delivery",
                                                        icon: <Truck className="w-5 h-5 text-blue-400" />,
                                                        points: [
                                                            "Free delivery on all orders above ₹499",
                                                            "Standard delivery: 3-5 business days",
                                                            "Express delivery options available at checkout"
                                                        ]
                                                    })}
                                                    className="flex items-center gap-3 text-sm text-gray-300 bg-gray-800 p-3 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors text-left"
                                                >
                                                    <Truck className="w-5 h-5 text-gray-100" />
                                                    <span>Free Delivery</span>
                                                </button>
                                                <button
                                                    onClick={() => setActiveFeature({
                                                        title: "2 Year Warranty",
                                                        icon: <ShieldCheck className="w-5 h-5 text-green-400" />,
                                                        points: [
                                                            "Covers manufacturing defects & hardware failures",
                                                            "Valid for 2 years from date of purchase",
                                                            "Excludes accidental & physical damage"
                                                        ]
                                                    })}
                                                    className="flex items-center gap-3 text-sm text-gray-300 bg-gray-800 p-3 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors text-left"
                                                >
                                                    <ShieldCheck className="w-5 h-5 text-gray-100" />
                                                    <span>2 Year Warranty</span>
                                                </button>
                                                <button
                                                    onClick={() => setActiveFeature({
                                                        title: "7 Day Returns",
                                                        icon: <RotateCcw className="w-5 h-5 text-orange-400" />,
                                                        points: [
                                                            "Returns accepted within 7 days of delivery",
                                                            "Item must be unused with original tags intact",
                                                            "Refund processed within 3 working days of pickup"
                                                        ]
                                                    })}
                                                    className="flex items-center gap-3 text-sm text-gray-300 bg-gray-800 p-3 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors text-left"
                                                >
                                                    <RotateCcw className="w-5 h-5 text-gray-100" />
                                                    <span>7 Day Returns</span>
                                                </button>
                                                <button
                                                    onClick={() => setShowEMIModal(true)}
                                                    className="flex items-center gap-3 text-sm text-gray-300 bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors w-full text-left border border-gray-700"
                                                >
                                                    <CreditCard className="w-5 h-5 text-gray-100" />
                                                    <span className="font-medium underline decoration-dotted underline-offset-2">Buy with EMI</span>
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                            <EMICalculatorModal
                                isOpen={showEMIModal}
                                onClose={() => setShowEMIModal(false)}
                                price={product.price}
                            />

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-4">
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => addToCart(product)}
                                    className="flex-1 bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg"
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

                {/* Reviews Section */}
                <ProductReviews product={product} />

                {/* Related Products */}
                {
                    relatedProducts.length > 0 && (
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-6">Similar Products</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts.map((relatedProduct) => (
                                    <ProductCard key={relatedProduct.id} product={relatedProduct} />
                                ))}
                            </div>
                        </section>
                    )
                }

                <RecentlyViewed products={recentProducts} />
            </main >
            <Footer />
        </div >
    );
}

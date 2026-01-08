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
    const isInStock = product ? (product.inStock !== undefined ? product.inStock : (product.stock > 0)) : false;

    const [mainImg, setMainImg] = useState(null);
    const [thumbs, setThumbs] = useState([]);

    useEffect(() => {
        if (product) {
            const images = (typeof product.images === 'string' ? JSON.parse(product.images) : product.images) || [product.image];
            setThumbs(images);
            setMainImg(images[selectedImage] || product.image);
        }
    }, [product, selectedImage]);

    if (!product) return <div>Loading...</div>;

    const handleImgError = (idx) => {
        const newThumbs = [...thumbs];
        newThumbs[idx] = 'https://via.placeholder.com/800x800?text=Image+Unavailable';
        setThumbs(newThumbs);
        if (selectedImage === idx) setMainImg(newThumbs[idx]);
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <Head>
                <title>{product.name} | SmartBuy</title>
            </Head>

            <StoreNavbar />
            <CartSidebar />

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 w-full">
                <div className="bg-gray-900 rounded-2xl shadow-sm border border-gray-800 overflow-hidden mb-8 sm:mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-4 sm:p-8">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div className="relative aspect-square bg-gray-800 rounded-xl overflow-hidden group">
                                <Image
                                    src={mainImg || product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    priority
                                    onError={() => handleImgError(selectedImage)}
                                />
                                <button
                                    onClick={() => toggleWishlist(product)}
                                    className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2.5 sm:p-3 bg-black/50 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform z-10"
                                >
                                    <Heart className={`w-5 sm:w-6 h-5 sm:h-6 ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-300'}`} />
                                </button>
                            </div>
                            {/* Thumbnail strip */}
                            <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 no-scrollbar">
                                {thumbs.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`relative w-16 sm:w-20 h-16 sm:h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${selectedImage === idx ? 'border-white ring-2 ring-gray-700' : 'border-transparent opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`Thumbnail ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                            onError={() => handleImgError(idx)}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col">
                            <div className="mb-4 sm:mb-6 border-b border-gray-800 pb-4 sm:pb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-blue-400 font-bold text-[10px] sm:text-xs set-caps tracking-wider bg-blue-900/30 px-2.5 sm:px-3 py-1 rounded-full uppercase">
                                        {product.category}
                                    </span>
                                </div>

                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1.5 sm:mb-2 leading-tight">{product.name}</h1>
                                {product.brand && <p className="text-gray-400 font-medium text-sm sm:text-base mb-3 sm:mb-4 tracking-wide">by <span className="text-gray-300 font-bold">{product.brand}</span></p>}

                                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                                    <div className="flex items-center gap-1 bg-yellow-900/20 px-2 py-0.5 rounded border border-yellow-900/30">
                                        <span className="font-bold text-gray-200 text-xs sm:text-sm mr-0.5 sm:mr-1">{product.rating}</span>
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-3 sm:w-4 h-3 sm:h-4 ${i < Math.floor(product.rating)
                                                    ? 'text-yellow-400 fill-yellow-400'
                                                    : 'text-gray-800'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[10px] sm:text-sm text-gray-500 border-l border-gray-800 pl-3 sm:pl-4 uppercase tracking-widest font-bold">
                                        {product.reviews} reviews
                                    </span>
                                </div>

                                <div className="flex items-baseline gap-3 sm:gap-4">
                                    <span className="text-3xl sm:text-4xl font-black text-white">₹{product.price.toLocaleString()}</span>
                                    {product.originalPrice > product.price && (
                                        <>
                                            <span className="text-base sm:text-lg text-gray-500 line-through decoration-gray-600">₹{product.originalPrice.toLocaleString()}</span>
                                            <span className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded-lg text-xs sm:text-sm font-black border border-green-500/20">SAVE {Math.round((1 - product.price / product.originalPrice) * 100)}%</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6 sm:space-y-8 flex-1">
                                <p className="text-gray-400 leading-relaxed text-sm sm:text-base font-medium">{product.description}</p>

                                {/* Features & Terms */}
                                <div className="min-h-[120px] sm:min-h-[140px]">
                                    <AnimatePresence mode="wait">
                                        {activeFeature ? (
                                            <motion.div
                                                key="details"
                                                initial={{ opacity: 0, scale: 0.98 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.98 }}
                                                className="bg-gray-950/50 p-4 sm:p-6 rounded-2xl border border-gray-800 relative h-full backdrop-blur-sm"
                                            >
                                                <button
                                                    onClick={() => setActiveFeature(null)}
                                                    className="absolute top-4 right-4 p-1.5 hover:bg-gray-800 rounded-full transition-colors"
                                                >
                                                    <X className="w-4 h-4 text-gray-400" />
                                                </button>

                                                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                                                    {activeFeature.icon}
                                                    <h3 className="font-bold text-white text-sm sm:text-base uppercase tracking-widest">{activeFeature.title}</h3>
                                                </div>

                                                <ul className="space-y-1.5 sm:space-y-2">
                                                    {activeFeature.points.map((point, index) => (
                                                        <li key={index} className="flex items-start gap-2.5 text-[11px] sm:text-sm text-gray-400 font-medium leading-relaxed">
                                                            <div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 sm:mt-2 flex-shrink-0" />
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
                                                className="grid grid-cols-2 gap-3 sm:gap-4"
                                            >
                                                <button
                                                    onClick={() => setActiveFeature({
                                                        title: "Free Delivery",
                                                        icon: <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />,
                                                        points: [
                                                            "Free delivery on all orders above ₹499",
                                                            "Standard delivery: 3-5 business days",
                                                            "Express delivery options available at checkout"
                                                        ]
                                                    })}
                                                    className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 text-[10px] sm:text-sm text-gray-400 bg-gray-950/40 p-3 sm:p-3 rounded-xl border border-gray-800/50 hover:bg-gray-800/50 hover:border-gray-700 transition-all font-bold uppercase tracking-widest"
                                                >
                                                    <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
                                                    <span>Free Delivery</span>
                                                </button>
                                                <button
                                                    onClick={() => setActiveFeature({
                                                        title: "2 Year Warranty",
                                                        icon: <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />,
                                                        points: [
                                                            "Covers manufacturing defects & hardware failures",
                                                            "Valid for 2 years from date of purchase",
                                                            "Excludes accidental & physical damage"
                                                        ]
                                                    })}
                                                    className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 text-[10px] sm:text-sm text-gray-400 bg-gray-950/40 p-3 sm:p-3 rounded-xl border border-gray-800/50 hover:bg-gray-800/50 hover:border-gray-700 transition-all font-bold uppercase tracking-widest"
                                                >
                                                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
                                                    <span>2 Yr Warranty</span>
                                                </button>
                                                <button
                                                    onClick={() => setActiveFeature({
                                                        title: "7 Day Returns",
                                                        icon: <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />,
                                                        points: [
                                                            "Returns accepted within 7 days of delivery",
                                                            "Item must be unused with original tags intact",
                                                            "Refund processed within 3 working days of pickup"
                                                        ]
                                                    })}
                                                    className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 text-[10px] sm:text-sm text-gray-400 bg-gray-950/40 p-3 sm:p-3 rounded-xl border border-gray-800/50 hover:bg-gray-800/50 hover:border-gray-700 transition-all font-bold uppercase tracking-widest"
                                                >
                                                    <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
                                                    <span>7 Day Returns</span>
                                                </button>
                                                <button
                                                    onClick={() => setShowEMIModal(true)}
                                                    className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 text-[10px] sm:text-sm text-gray-400 bg-gray-950/40 p-3 sm:p-3 rounded-xl border border-gray-800/50 hover:bg-gray-800/50 hover:border-gray-700 transition-all font-bold uppercase tracking-widest"
                                                >
                                                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
                                                    <span className="underline decoration-dotted underline-offset-2">Buy with EMI</span>
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
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-auto pt-6 border-t border-gray-800">
                                <div className="w-full">
                                    <div className="flex items-center gap-2.5 mb-4">
                                        <div className={`h-2 w-2 rounded-full ${isInStock ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`} />
                                        <span className={`text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] ${isInStock ? 'text-emerald-500' : 'text-red-500'}`}>
                                            {isInStock ? 'In Stock — Ships Today' : 'Out of Stock'}
                                        </span>
                                    </div>

                                    {isInStock && product.stock > 0 && product.stock < 10 && (
                                        <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 sm:p-3 rounded-xl mb-4 flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                                            <p className="text-amber-500 text-[10px] sm:text-xs font-black uppercase tracking-wider">Hurry! Only {product.stock} items remaining</p>
                                        </div>
                                    )}

                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                        <motion.button
                                            whileTap={isInStock ? { scale: 0.98 } : {}}
                                            disabled={!isInStock}
                                            onClick={() => addToCart(product)}
                                            className={`flex-1 font-black py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base uppercase tracking-widest ${isInStock
                                                ? "bg-white text-black hover:bg-gray-100"
                                                : "bg-gray-800 text-gray-600 cursor-not-allowed"
                                                }`}
                                        >
                                            <ShoppingCart className="w-5 h-5" />
                                            {isInStock ? "Add to Cart" : "Sold Out"}
                                        </motion.button>
                                        <motion.button
                                            whileTap={isInStock ? { scale: 0.98 } : {}}
                                            disabled={!isInStock}
                                            className={`flex-1 font-black py-4 rounded-xl transition-all shadow-lg text-sm sm:text-base uppercase tracking-widest ${isInStock
                                                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20"
                                                : "bg-gray-900 text-gray-700 border border-gray-800 cursor-not-allowed"
                                                }`}
                                        >
                                            {isInStock ? "Checkout Now" : "Unavailable"}
                                        </motion.button>
                                    </div>
                                </div>
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

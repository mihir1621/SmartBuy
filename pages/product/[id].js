import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Truck, ShieldCheck, RotateCcw, Heart } from 'lucide-react';
import StoreNavbar from '@/components/StoreNavbar';
import CartSidebar from '@/components/CartSidebar';
import { useCart } from '@/context/CartContext';
import { products } from '@/data/products';

export default function ProductDetail() {
    const router = useRouter();
    const { id } = router.query;
    const { addToCart } = useCart();
    const [selectedImage, setSelectedImage] = useState(0);

    // Find product
    const product = products.find((p) => p.id === parseInt(id));

    if (!product) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <Head>
                <title>{product.name} | SmartBuy</title>
            </Head>

            <StoreNavbar />
            <CartSidebar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
                                <Image
                                    src={product.images ? product.images[selectedImage] : product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                            {/* Thumbnail strip */}
                            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                                {(product.images || [product.image]).map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${selectedImage === idx ? 'border-blue-500' : 'border-transparent'
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
                                    <span className="text-blue-600 font-medium text-sm uppercase tracking-wider">
                                        {product.category}
                                    </span>
                                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                                        <Heart className="w-6 h-6" />
                                    </button>
                                </div>

                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex items-center gap-1">
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
                                    <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                                        {product.reviews} ratings
                                    </span>
                                </div>

                                <div className="flex items-baseline gap-4">
                                    <span className="text-4xl font-bold text-gray-900">${product.price}</span>
                                    <span className="text-lg text-gray-500 line-through">${(product.price * 1.2).toFixed(0)}</span>
                                    <span className="text-green-600 font-bold text-sm">20% OFF</span>
                                </div>
                            </div>

                            <div className="space-y-6 flex-1">
                                <p className="text-gray-600 leading-relaxed">{product.description}</p>

                                {/* Features */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <Truck className="w-5 h-5 text-blue-500" />
                                        <span>Free Delivery</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <ShieldCheck className="w-5 h-5 text-blue-500" />
                                        <span>2 Year Warranty</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <RotateCcw className="w-5 h-5 text-blue-500" />
                                        <span>30 Day Returns</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-4 mt-auto pt-8">
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => addToCart(product)}
                                        className="flex-1 bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors shadow-sm flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        Add to Cart
                                    </motion.button>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                                    >
                                        Buy Now
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

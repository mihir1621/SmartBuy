import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import useRequireAuth from '@/hooks/useRequireAuth';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const isWishlisted = isInWishlist(product.id);

    // Robust inStock check: use boolean if available, fallback to checking stock count
    const isInStock = product.inStock !== undefined ? product.inStock : (product.stock > 0);

    const discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

    const [imgSrc, setImgSrc] = useState(product.image);

    useRequireAuth();
    const { user } = useAuth();
    const router = useRouter();
    const handleAddToCart = (productItem) => {
        if (!user) {
            router.replace(`/login?redirect=${encodeURIComponent(router.asPath)}`);
            return;
        }
        addToCart(productItem);
    };

    return (
        <Link href={`/product/${product.id}`} className="group block h-full">
            <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:shadow-lg hover:border-gray-600 transition-all duration-300 relative h-full flex flex-col">
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-800">
                    <Image
                        src={imgSrc}
                        alt={product.name}
                        fill
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={() => setImgSrc('https://via.placeholder.com/800x1000?text=Image+Unavailable')}
                    />

                    {/* Wishlist Button */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(product);
                        }}
                        className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm transition-all shadow-sm ${isWishlisted
                            ? 'bg-white/20 text-white'
                            : 'bg-black/50 text-gray-300 hover:bg-black hover:text-white'
                            }`}
                    >
                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>

                    {/* Discount Badge */}
                    {discountPercentage > 0 && (
                        <div className="absolute top-2 left-2 bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                            {discountPercentage}% OFF
                        </div>
                    )}

                    {/* Out of Stock Overlay */}
                    {!isInStock && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                            <span className="bg-white text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-xl">
                                Out of Stock
                            </span>
                        </div>
                    )}

                    {/* Low Stock Badge */}
                    {isInStock && product.stock > 0 && product.stock < 10 && (
                        <div className="absolute bottom-2 left-2 bg-gray-200 text-black text-[9px] font-black px-2 py-0.5 rounded shadow-lg animate-pulse">
                            ONLY {product.stock} LEFT!
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-2 sm:p-3 flex flex-col flex-1">
                    {/* Brand & Rating */}
                    <div className="flex justify-between items-start mb-1 sm:mb-1.5">
                        <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate pr-1 sm:pr-2">{product.brand}</span>
                        <div className="flex items-center gap-0.5 sm:gap-1 bg-gray-800 px-1 sm:px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold text-gray-300 border border-gray-700 shrink-0">
                            <span>{product.rating}</span>
                            <Star className="w-2 sm:w-2.5 h-2 sm:h-2.5 fill-current" />
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xs sm:text-sm font-medium text-white line-clamp-2 mb-1.5 sm:mb-2 group-hover:text-gray-300 transition-colors leading-snug">
                        {product.name}
                    </h3>

                    {/* Price Section */}
                    <div className="mt-auto">
                        <div className="flex items-baseline gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                            <span className="text-sm sm:text-base font-bold text-white">₹{product.price.toLocaleString()}</span>
                            {product.originalPrice > product.price && (
                                <span className="text-[10px] sm:text-xs text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                            )}
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            disabled={!isInStock}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleAddToCart(product);
                            }}
                            className={`w-full text-[10px] sm:text-xs font-bold py-1.5 sm:py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 sm:gap-2 active:scale-95 ${isInStock
                                ? "bg-white hover:bg-gray-200 text-black shadow-lg shadow-white/5"
                                : "bg-gray-800 text-gray-600 cursor-not-allowed"
                                }`}
                        >
                            <ShoppingCart className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                            {isInStock ? "Add to Cart" : "Sold Out"}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}

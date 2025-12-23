import Link from 'next/link';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const isWishlisted = isInWishlist(product.id);

    const discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

    return (
        <Link href={`/product/${product.id}`} className="group block h-full">
            <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:shadow-lg hover:border-blue-900 transition-all duration-300 relative h-full flex flex-col">
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-800">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                    />

                    {/* Wishlist Button */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(product);
                        }}
                        className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm transition-all shadow-sm ${isWishlisted
                            ? 'bg-red-900/50 text-red-400'
                            : 'bg-black/50 text-gray-300 hover:bg-black hover:text-red-400'
                            }`}
                    >
                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>

                    {/* Discount Badge if Applicable */}
                    {discountPercentage > 0 && (
                        <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                            {discountPercentage}% OFF
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-3 flex flex-col flex-1">
                    {/* Brand & Rating */}
                    <div className="flex justify-between items-start mb-1.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate pr-2">{product.brand}</span>
                        <div className="flex items-center gap-1 bg-green-900/30 px-1.5 py-0.5 rounded text-[10px] font-bold text-green-400 border border-green-900 shrink-0">
                            <span>{product.rating}</span>
                            <Star className="w-2.5 h-2.5 fill-current" />
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-medium text-white line-clamp-2 mb-2 group-hover:text-blue-400 transition-colors leading-snug">
                        {product.name}
                    </h3>

                    {/* Price Section */}
                    <div className="mt-auto">
                        <div className="flex items-baseline gap-2 mb-3">
                            <span className="text-base font-bold text-white">₹{product.price.toLocaleString()}</span>
                            {product.originalPrice > product.price && (
                                <span className="text-xs text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                            )}
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addToCart(product);
                            }}
                            className="w-full bg-white hover:bg-gray-200 text-black text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 active:scale-95"
                        >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}

import { useRef } from "react";
import { X, Star, Check, ShoppingCart, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { useBehaviorTracking } from "@/hooks/useBehaviorTracking";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

export default function QuickViewModal({ product, isOpen, onClose }) {
    const modalRef = useRef(null);
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const router = useRouter();
    const { trackAction } = useBehaviorTracking();
    const { user } = useAuth();

    useEffect(() => {
        if (isOpen && product && user) {
            trackAction(user.uid || user.id, 'VIEW', {
                productId: product.id,
                name: product.name,
                category: product.category,
                brand: product.brand
            });
        }
    }, [isOpen, product, user, trackAction]);

    if (!isOpen || !product) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-background/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative bg-background rounded-3xl overflow-hidden shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row border border-border"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 bg-background/50 backdrop-blur-sm rounded-full hover:bg-background transition-colors border border-border"
                    >
                        <X className="w-5 h-5 text-foreground" />
                    </button>

                    {/* Image Side */}
                    <div className="md:w-1/2 relative h-64 md:h-auto bg-secondary-bg">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                    </div>

                    {/* Content Side */}
                    <div className="md:w-1/2 p-6 md:p-10 overflow-y-auto bg-background">
                        <div className="text-xs font-bold text-accent uppercase tracking-widest mb-2">{product.category}</div>
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{product.name}</h2>

                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex text-yellow-500">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="text-foreground font-bold ml-1">{product.rating}</span>
                            </div>
                            <span className="text-border text-sm">•</span>
                            <span className="text-secondary-text text-sm">{product.reviews} reviews</span>
                        </div>

                        <div className="text-3xl font-bold text-foreground mb-6">₹{product.price}</div>

                        <p className="text-secondary-text leading-relaxed mb-6">
                            {product.description}
                        </p>

                        <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-3 text-sm text-secondary-text">
                                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                    <Check className="w-4 h-4" />
                                </div>
                                In Stock & Ready to Ship
                            </div>
                            <div className="flex items-center gap-3 text-sm text-secondary-text">
                                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                    <Check className="w-4 h-4" />
                                </div>
                                Free Shipping & Returns
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    addToCart(product);
                                    onClose();
                                }}
                                className="flex-1 bg-accent text-white font-bold py-4 rounded-xl hover:bg-accent/90 transition-all flex items-center justify-center gap-2 shadow-saas active:scale-95"
                            >
                                <ShoppingCart className="w-5 h-5" /> Add to Cart
                            </button>
                            <button
                                onClick={() => {
                                    router.push(`/product/${product.id}`);
                                }}
                                className="px-6 py-4 border border-border text-foreground rounded-xl hover:bg-secondary-bg transition-all"
                                title="View Full Details"
                            >
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

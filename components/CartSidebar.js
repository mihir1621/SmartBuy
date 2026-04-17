import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function CartSidebar() {
    const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal } = useCart();
    const router = useRouter();

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-background shadow-2xl z-50 flex flex-col border-l border-border"
                    >
                        {/* Header */}
                        <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between bg-surface/95 backdrop-blur-md">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-accent" />
                                <h2 className="text-lg sm:text-xl font-black text-foreground uppercase tracking-tight">Your Cart</h2>
                                <span className="bg-accent text-white text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full">
                                    {cart.length}
                                </span>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 hover:bg-secondary rounded-full transition-colors group"
                            >
                                <X className="w-5 h-5 sm:w-6 sm:h-6 text-secondary-text group-hover:text-foreground" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 sm:space-y-6 custom-scrollbar">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 px-4">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-secondary rounded-full flex items-center justify-center border border-border">
                                        <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-secondary-text" />
                                    </div>
                                    <div>
                                        <p className="text-foreground font-black text-base sm:text-lg uppercase tracking-tight">Empty Cart</p>
                                        <p className="text-secondary-text text-[11px] sm:text-sm mt-1 max-w-[200px] mx-auto">Looks like you haven&apos;t added anything yet.</p>
                                    </div>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="mt-4 px-6 py-2.5 bg-accent text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-accent-hover transition-all active:scale-95 shadow-saas"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <motion.div
                                        layout
                                        key={item.id}
                                        className="flex gap-3 sm:gap-4 bg-surface p-2.5 sm:p-3 rounded-2xl border border-border hover:border-gray-400 transition-all shadow-sm"
                                    >
                                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-xl overflow-hidden bg-secondary border border-border">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between min-w-0">
                                            <div>
                                                <h3 className="font-bold text-foreground text-[11px] sm:text-sm truncate pr-2">{item.name}</h3>
                                                <p className="text-[10px] sm:text-xs font-bold text-secondary-text uppercase tracking-widest mt-0.5">{item.category}</p>
                                            </div>

                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-2.5 sm:gap-3 bg-secondary border border-border rounded-lg px-2 py-0.5 sm:py-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 text-secondary-text hover:text-foreground transition-colors"
                                                    >
                                                        <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                    </button>
                                                    <span className="text-[11px] sm:text-xs font-black w-4 text-center text-foreground">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 text-secondary-text hover:text-foreground transition-colors"
                                                    >
                                                        <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                    </button>
                                                </div>
                                                <span className="font-black text-foreground text-xs sm:text-sm">₹{(item.price * item.quantity).toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="self-start p-1.5 text-secondary-text hover:text-error transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        </button>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="p-4 sm:p-5 border-t border-border bg-surface/95 backdrop-blur-md">
                                <div className="space-y-2.5 sm:space-y-3 mb-5">
                                    <div className="flex justify-between text-secondary-text text-[11px] sm:text-sm font-bold uppercase tracking-wider">
                                        <span>Subtotal</span>
                                        <span className="text-foreground">₹{cartTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-secondary-text text-[11px] sm:text-sm font-bold uppercase tracking-wider">
                                        <span>Shipping</span>
                                        <span className="text-foreground font-black">Free</span>
                                    </div>
                                    <div className="flex justify-between text-foreground font-black text-lg sm:text-xl pt-3 sm:pt-4 border-t border-border">
                                        <span>Total</span>
                                        <span className="text-foreground">₹{cartTotal.toLocaleString()}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setIsCartOpen(false);
                                        router.push('/checkout');
                                    }}
                                    className="w-full bg-accent text-white py-3.5 sm:py-4 rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-[0.2em] hover:bg-accent-hover transition-all active:scale-[0.98] shadow-saas"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

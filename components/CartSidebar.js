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
                        className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-gray-900 shadow-2xl z-50 flex flex-col border-l border-gray-800"
                    >
                        {/* Header */}
                        <div className="p-5 border-b border-gray-800 flex items-center justify-between bg-gray-900">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-gray-300" />
                                <h2 className="text-xl font-bold text-white">Your Cart</h2>
                                <span className="bg-gray-800 text-gray-300 text-xs font-bold px-2 py-1 rounded-full">
                                    {cart.length}
                                </span>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-400 hover:text-white" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-6">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center">
                                        <ShoppingBag className="w-10 h-10 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium text-lg">Your cart is empty</p>
                                        <p className="text-gray-400 text-sm mt-1">Looks like you haven't added anything yet.</p>
                                    </div>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="mt-4 px-6 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <motion.div
                                        layout
                                        key={item.id}
                                        className="flex gap-4 bg-gray-800/50 p-3 rounded-xl border border-gray-700"
                                    >
                                        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-700">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-semibold text-white text-sm line-clamp-1">{item.name}</h3>
                                                <p className="text-gray-400 text-xs mt-0.5">{item.category}</p>
                                            </div>

                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-3 bg-gray-900 border border-gray-700 rounded-lg px-2 py-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-0.5 text-gray-400 hover:text-white transition-colors"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-xs font-medium w-4 text-center text-white">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-0.5 text-gray-400 hover:text-white transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <span className="font-bold text-white text-sm">₹{(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="self-start p-1 text-gray-500 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="p-5 border-t border-gray-800 bg-gray-900">
                                <div className="space-y-3 mb-5">
                                    <div className="flex justify-between text-gray-400 text-sm">
                                        <span>Subtotal</span>
                                        <span>₹{cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400 text-sm">
                                        <span>Shipping</span>
                                        <span>Free</span>
                                    </div>
                                    <div className="flex justify-between text-white font-bold text-lg pt-3 border-t border-gray-800">
                                        <span>Total</span>
                                        <span>₹{cartTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setIsCartOpen(false);
                                        router.push('/checkout');
                                    }}
                                    className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-200 transition-all active:scale-95 shadow-lg shadow-gray-900/50"
                                >
                                    Checkout
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

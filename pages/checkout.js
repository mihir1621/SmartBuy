import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import { CreditCard, Truck, ShieldCheck, Lock, ChevronRight } from 'lucide-react';
import StoreNavbar from '@/components/StoreNavbar';
import Footer from '@/components/Footer';

export default function Checkout() {
    const { cart, cartTotal, clearCart } = useCart();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate API call
        setTimeout(() => {
            clearCart();
            setIsProcessing(false);
            router.push('/order-success');
        }, 2000);
    };

    if (cart.length === 0) {
        return (

            <div className="min-h-screen bg-black flex flex-col">
                <StoreNavbar />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-white mb-4">Your cart is empty</h1>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Start Shopping
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );

    }

    return (
        <div className="min-h-screen bg-black flex flex-col text-white">
            <Head>
                <title>Checkout | SmartBuy</title>
            </Head>
            <StoreNavbar />

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shipping Details */}
                        <div className="bg-gray-900 rounded-2xl shadow-sm border border-gray-800 p-6">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Truck className="w-5 h-5 text-blue-500" />
                                Shipping Information
                            </h2>
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-300">First Name</label>
                                    <input type="text" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white" placeholder="John" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-300">Last Name</label>
                                    <input type="text" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white" placeholder="Doe" />
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-sm font-medium text-gray-300">Email Address</label>
                                    <input type="email" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white" placeholder="john@example.com" />
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-sm font-medium text-gray-300">Street Address</label>
                                    <input type="text" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white" placeholder="123 Main St" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-300">City</label>
                                    <input type="text" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white" placeholder="New York" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-300">Postal Code</label>
                                    <input type="text" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white" placeholder="10001" />
                                </div>
                            </form>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-gray-900 rounded-2xl shadow-sm border border-gray-800 p-6">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-blue-500" />
                                Payment Method
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 border border-blue-500 bg-blue-900/20 rounded-xl cursor-pointer">
                                    <div className="w-5 h-5 rounded-full border-4 border-blue-500 bg-white"></div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-white">Credit / Debit Card</span>
                                            <div className="flex gap-2">
                                                <div className="w-8 h-5 bg-gray-700 rounded"></div>
                                                <div className="w-8 h-5 bg-gray-700 rounded"></div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-400">Safe money transfer using your bank account. Visa, Maestro, Discover, American Express.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-300">Card Number</label>
                                        <input type="text" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white" placeholder="0000 0000 0000 0000" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-300">Expiry Date</label>
                                        <input type="text" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white" placeholder="MM/YY" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-300">CVC</label>
                                        <input type="text" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white" placeholder="123" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-300">Card Holder</label>
                                        <input type="text" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white" placeholder="Name on card" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-900 rounded-2xl shadow-sm border border-gray-800 p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden relative flex-shrink-0">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium text-white line-clamp-1">{item.name}</h3>
                                            <p className="text-xs text-gray-400 mb-1">Qty: {item.quantity}</p>
                                            <p className="text-sm font-bold text-white">₹{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 py-6 border-t border-gray-800">
                                <div className="flex justify-between text-gray-400 text-sm">
                                    <span>Subtotal</span>
                                    <span>₹{cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400 text-sm">
                                    <span>Shipping</span>
                                    <span className="text-green-400 font-medium">Free</span>
                                </div>
                                <div className="flex justify-between text-gray-400 text-sm">
                                    <span>Tax (5%)</span>
                                    <span>₹{(cartTotal * 0.05).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-white font-bold text-lg pt-3 border-t border-gray-800">
                                    <span>Total</span>
                                    <span>₹{(cartTotal * 1.05).toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={isProcessing}
                                className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-200 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:bg-gray-600 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        Place Order <ChevronRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>

                            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                                <Lock className="w-3 h-3" />
                                Secure Checkout
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

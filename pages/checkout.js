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
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: ''
    });
    const [cardData, setCardData] = useState({
        number: '',
        expiry: '',
        cvc: '',
        holder: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStep, setPaymentStep] = useState(''); // '', 'validating', 'authorizing', 'done'

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCardChange = (e) => {
        const { name, value } = e.target;
        // Basic card formatting simulation
        let val = value;
        if (name === 'number') {
            val = value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim().substring(0, 19);
        } else if (name === 'expiry') {
            val = value.replace(/\W/gi, '').replace(/(.{2})/g, '$1/').trim().substring(0, 5);
            if (val.endsWith('/')) val = val.slice(0, -1);
        } else if (name === 'cvc') {
            val = value.replace(/\D/g, '').substring(0, 3);
        }
        setCardData(prev => ({ ...prev, [name]: val }));
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (!formData.firstName || !formData.email || !formData.address) {
            alert('Please fill in the required fields');
            return;
        }

        if (cardData.number.length < 16) {
            alert('Please enter a valid card number');
            return;
        }

        setIsProcessing(true);
        setPaymentStep('validating');

        try {
            // Simulate Payment Gateway delay
            await new Promise(r => setTimeout(r, 1500));
            setPaymentStep('authorizing');
            await new Promise(r => setTimeout(r, 2000));

            const res = await fetch('/api/orders/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerInfo: formData,
                    items: cart,
                    paymentInfo: {
                        method: 'CARD',
                        last4: cardData.number.slice(-4),
                        status: 'SUCCESS'
                    },
                    totalAmount: cartTotal * 1.05 // Including tax
                })
            });

            let data = {};
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await res.json();
            }

            if (res.ok) {
                setPaymentStep('done');
                await new Promise(r => setTimeout(r, 500));
                clearCart();
                router.push('/order-success?id=' + data.orderId);
            } else {
                setPaymentStep('');
                alert(data.error || 'The server returned an error (500). Please check your connection or try again later.');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            setPaymentStep('');
            alert('Failed to place order. Please try again.');
        } finally {
            setIsProcessing(false);
        }
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
                                    <label className="text-sm font-medium text-gray-300">First Name *</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white"
                                        placeholder="John"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-300">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white"
                                        placeholder="Doe"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-300">Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-300">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white"
                                        placeholder="+91 00000 00000"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-sm font-medium text-gray-300">Street Address *</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white"
                                        placeholder="123 Main St"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-300">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white"
                                        placeholder="New York"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-300">Postal Code</label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white"
                                        placeholder="10001"
                                    />
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
                                <div className="flex items-center gap-4 p-4 border border-blue-500 bg-blue-900/20 rounded-xl">
                                    <div className="w-5 h-5 rounded-full border-4 border-blue-500 bg-white"></div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-white">Credit / Debit Card</span>
                                            <div className="flex gap-2 text-[10px] font-black tracking-widest text-blue-400 bg-blue-900/40 px-2 py-0.5 rounded border border-blue-800">DEMO MODE</div>
                                        </div>
                                        <p className="text-sm text-gray-400">Safe money transfer using your bank account. Visa, Maestro, Discover, American Express.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-800/30 p-6 rounded-2xl border border-gray-800 mb-2">
                                    <div className="md:col-span-2 space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Card Number</label>
                                        <input
                                            type="text"
                                            name="number"
                                            value={cardData.number}
                                            onChange={handleCardChange}
                                            className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-white font-mono tracking-[0.2em]"
                                            placeholder="0000 0000 0000 0000"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Expiry Date</label>
                                        <input
                                            type="text"
                                            name="expiry"
                                            value={cardData.expiry}
                                            onChange={handleCardChange}
                                            className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-white font-mono"
                                            placeholder="MM/YY"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">CVC</label>
                                        <input
                                            type="text"
                                            name="cvc"
                                            value={cardData.cvc}
                                            onChange={handleCardChange}
                                            className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-white font-mono"
                                            placeholder="123"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Card Holder</label>
                                        <input
                                            type="text"
                                            name="holder"
                                            value={cardData.holder}
                                            onChange={handleCardChange}
                                            className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-white font-medium"
                                            placeholder="NAME AS PER CARD"
                                        />
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
                                className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-200 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed group overflow-hidden relative"
                            >
                                {isProcessing ? (
                                    <div className="flex flex-col items-center py-1">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 animate-pulse">
                                            {paymentStep === 'validating' ? 'Verifying Card...' :
                                                paymentStep === 'authorizing' ? 'Securing Funds...' :
                                                    paymentStep === 'done' ? 'Transaction Success!' : 'Processing...'}
                                        </span>
                                        <div className="w-24 h-1 bg-gray-900 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ x: '-100%' }}
                                                animate={{ x: '100%' }}
                                                transition={{ repeat: Infinity, duration: 1 }}
                                                className="w-12 h-full bg-blue-500"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        Complete Payment <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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


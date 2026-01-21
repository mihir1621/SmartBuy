import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { CreditCard, Truck, ShieldCheck, Lock, ChevronRight } from 'lucide-react';
import StoreNavbar from '@/components/StoreNavbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { calculateTotalGST, getStateFromCity } from '@/utils/gstUtils';

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export default function Checkout() {
    const { user } = useAuth();
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

    useEffect(() => {
        if (user) {
            const nameParts = user.displayName ? user.displayName.split(' ') : (user.name ? user.name.split(' ') : ['', '']);
            setFormData(prev => ({
                ...prev,
                firstName: nameParts[0] || '',
                lastName: nameParts.slice(1).join(' ') || '',
                email: user.email || prev.email,
                phone: user.phoneNumber || prev.phone || '' // Firebase user has phoneNumber
            }));
        }
    }, [user]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStep, setPaymentStep] = useState(''); // '', 'creating', 'payment', 'verifying'
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('RAZORPAY'); // 'RAZORPAY', 'COD', 'EMI'

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

        setIsProcessing(true);
        setPaymentStep('creating');

        try {
            // 1. Only load Razorpay Script if needed
            if (selectedPaymentMethod !== 'COD') {
                const resScript = await loadRazorpayScript();
                if (!resScript) {
                    alert("Razorpay SDK failed to load. Are you online?");
                    setIsProcessing(false);
                    return;
                }
            }

            // 2. Create internal order and Razorpay order
            const res = await fetch('/api/orders/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerInfo: formData,
                    items: cart,
                    paymentMethod: selectedPaymentMethod === 'COD' ? 'COD' : 'RAZORPAY',
                    totalAmount: cartTotal,
                    userId: user?.uid // Pass Firebase UID
                })
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 404) {
                    alert('Your cart contains items that are no longer available (ID: ' + (data.error?.split(':')[1]?.split('.')[0] || 'Unknown') + '). We have cleared your cart to resolve this compatibility issue. Please add items again.');
                    // Force clear persistent storage immediately
                    localStorage.removeItem('smartbuy_cart');
                    clearCart();
                    router.push('/');
                    return;
                }
                throw new Error(data.error || 'Failed to initialize order');
            }

            // If COD, we're done with creating. Redirect to success.
            if (selectedPaymentMethod === 'COD') {
                setPaymentStep('done');
                clearCart();
                router.push('/order-success?id=' + data.orderId);
                return;
            }

            setPaymentStep('payment');

            // 3. Open Razorpay Modal
            const options = {
                key: data.razorpayKeyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use server key or fallback
                amount: data.amount,
                currency: data.currency,
                name: "SmartBuy Store",
                description: selectedPaymentMethod === 'EMI' ? "EMI / Buy Now Pay Later" : "Secure Checkout Payment",
                order_id: data.razorpayOrderId,
                handler: async function (response) {
                    setPaymentStep('verifying');

                    // 4. Verify Payment Signature
                    const verifyRes = await fetch('/api/checkout/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderId: data.orderId
                        })
                    });

                    const verifyData = await verifyRes.json();
                    if (verifyRes.ok) {
                        setPaymentStep('done');
                        clearCart();
                        router.push('/order-success?id=' + data.orderId);
                    } else {
                        alert(verifyData.message || "Payment verification failed");
                        setIsProcessing(false);
                        setPaymentStep('');
                    }
                },
                prefill: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: {
                    color: "#3b82f6"
                },
                config: selectedPaymentMethod === 'EMI' ? {
                    display: {
                        blocks: {
                            emi: {
                                name: 'EMI / Pay Later',
                                instruments: [
                                    {
                                        method: 'emi',
                                    },
                                    {
                                        method: 'paylater',
                                    }
                                ],
                            },
                        },
                        sequence: ['block.emi', 'block.other'],
                        preferences: {
                            show_default_blocks: true,
                        },
                    },
                } : undefined,
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                        setPaymentStep('');
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error('Checkout error:', error);
            alert(error.message || 'Failed to place order. Please try again.');
            setIsProcessing(false);
            setPaymentStep('');
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
                            className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
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

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
                <h1 className="text-2xl sm:text-3xl font-black text-white mb-6 sm:mb-8 tracking-tight">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Left Column: Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shipping Details */}
                        <div className="bg-gray-900 rounded-2xl shadow-sm border border-gray-800 p-5 sm:p-6">
                            <h2 className="text-lg sm:text-xl font-bold text-white mb-5 flex items-center gap-2">
                                <Truck className="w-5 h-5 text-white" />
                                Shipping Information
                            </h2>
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">First Name *</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-white/20 focus:border-white outline-none text-white text-sm transition-all"
                                        placeholder="John"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-white/20 focus:border-white outline-none text-white text-sm transition-all"
                                        placeholder="Doe"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-white/20 focus:border-white outline-none text-white text-sm transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-white/20 focus:border-white outline-none text-white text-sm transition-all"
                                        placeholder="+91 00000 00000"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-[11px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">Street Address *</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-white/20 focus:border-white outline-none text-white text-sm transition-all"
                                        placeholder="123 Main St"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-white/20 focus:border-white outline-none text-white text-sm transition-all"
                                        placeholder="New York"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">Postal Code</label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-white/20 focus:border-white outline-none text-white text-sm transition-all"
                                        placeholder="10001"
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-gray-900 rounded-2xl shadow-sm border border-gray-800 p-5 sm:p-6">
                            <h2 className="text-lg sm:text-xl font-bold text-white mb-5 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-white" />
                                Payment Method
                            </h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                    {/* Razorpay Option */}
                                    <div
                                        onClick={() => setSelectedPaymentMethod('RAZORPAY')}
                                        className={`flex items-center gap-3 sm:gap-4 p-4 sm:p-5 border rounded-2xl transition-all cursor-pointer ${selectedPaymentMethod === 'RAZORPAY' ? 'border-white bg-white/10' : 'border-gray-800 bg-gray-900 hover:border-gray-700'}`}
                                    >
                                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-lg shrink-0 ${selectedPaymentMethod === 'RAZORPAY' ? 'bg-white shadow-white/20' : 'bg-gray-800'}`}>
                                            <CreditCard className={`w-5 h-5 sm:w-6 sm:h-6 ${selectedPaymentMethod === 'RAZORPAY' ? 'text-black' : 'text-white'}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 overflow-hidden">
                                                <span className="font-black text-xs sm:text-sm text-white uppercase tracking-wider truncate">Online Payment</span>
                                                {selectedPaymentMethod === 'RAZORPAY' && <div className="text-[8px] sm:text-[10px] font-black tracking-widest text-white bg-gray-800 px-2 py-0.5 rounded border border-gray-700 uppercase shrink-0">Active</div>}
                                            </div>
                                            <p className="text-[11px] sm:text-sm text-gray-500 mt-1 font-medium truncate">UPI, Cards, Wallets.</p>
                                        </div>
                                    </div>

                                    {/* EMI Option */}
                                    <div
                                        onClick={() => setSelectedPaymentMethod('EMI')}
                                        className={`flex items-center gap-3 sm:gap-4 p-4 sm:p-5 border rounded-2xl transition-all cursor-pointer ${selectedPaymentMethod === 'EMI' ? 'border-white bg-white/10' : 'border-gray-800 bg-gray-900 hover:border-gray-700'}`}
                                    >
                                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-lg shrink-0 ${selectedPaymentMethod === 'EMI' ? 'bg-white shadow-white/20' : 'bg-gray-800'}`}>
                                            <CreditCard className={`w-5 h-5 sm:w-6 sm:h-6 ${selectedPaymentMethod === 'EMI' ? 'text-black' : 'text-white'}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 overflow-hidden">
                                                <span className="font-black text-xs sm:text-sm text-white uppercase tracking-wider truncate">EMI / Buy Now Pay Later</span>
                                                {selectedPaymentMethod === 'EMI' && <div className="text-[8px] sm:text-[10px] font-black tracking-widest text-white bg-gray-800 px-2 py-0.5 rounded border border-gray-700 uppercase shrink-0">Flexible</div>}
                                            </div>
                                            <p className="text-[11px] sm:text-sm text-gray-500 mt-1 font-medium truncate">Monthly installments.</p>
                                        </div>
                                    </div>

                                    {/* COD Option */}
                                    <div
                                        onClick={() => setSelectedPaymentMethod('COD')}
                                        className={`flex items-center gap-3 sm:gap-4 p-4 sm:p-5 border rounded-2xl transition-all cursor-pointer ${selectedPaymentMethod === 'COD' ? 'border-white bg-white/10' : 'border-gray-800 bg-gray-900 hover:border-gray-700'}`}
                                    >
                                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-lg shrink-0 ${selectedPaymentMethod === 'COD' ? 'bg-white shadow-white/20' : 'bg-gray-800'}`}>
                                            <Truck className={`w-5 h-5 sm:w-6 sm:h-6 ${selectedPaymentMethod === 'COD' ? 'text-black' : 'text-white'}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 overflow-hidden">
                                                <span className="font-black text-xs sm:text-sm text-white uppercase tracking-wider truncate">Cash on Delivery</span>
                                                {selectedPaymentMethod === 'COD' && <div className="text-[8px] sm:text-[10px] font-black tracking-widest text-white bg-gray-800 px-2 py-0.5 rounded border border-gray-700 uppercase shrink-0">Verified</div>}
                                            </div>
                                            <p className="text-[11px] sm:text-sm text-gray-500 mt-1 font-medium truncate">Pay cash at doorstep.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-800/10 border border-gray-800/50 p-4 sm:p-6 rounded-2xl mt-4">
                                    <div className="flex items-center gap-3 mb-3 sm:mb-4">
                                        <ShieldCheck className="w-4 h-4 text-gray-400" />
                                        <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">Safe & Secure Payments</p>
                                    </div>
                                    <p className="text-[10px] sm:text-xs text-gray-500 leading-relaxed font-medium">
                                        By proceeding with this payment, you agree to our Terms of Service and Privacy Policy. All transactions are encrypted and processed securely by 128-bit SSL.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-900 rounded-2xl shadow-sm border border-gray-800 p-5 sm:p-6 sticky top-24">
                            <h2 className="text-lg sm:text-xl font-bold text-white mb-5 sm:mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6 max-h-64 sm:max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-800 rounded-lg overflow-hidden relative flex-shrink-0 border border-gray-800">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1">{item.name}</h3>
                                            <p className="text-[10px] sm:text-xs text-gray-500 mb-1 font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                                            <p className="text-xs sm:text-sm font-black text-white">₹{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {(() => {
                                const shippingState = getStateFromCity(formData.city);
                                const gstDetails = calculateTotalGST(cart, shippingState);

                                return (
                                    <div className="space-y-3 py-5 sm:py-6 border-t border-gray-800">
                                        <div className="flex justify-between text-gray-400 text-xs sm:text-sm">
                                            <span>Subtotal</span>
                                            <span className="text-white font-bold">₹{gstDetails.taxableValue.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-400 text-xs sm:text-sm">
                                            <span>Shipping</span>
                                            <span className="text-white font-bold uppercase text-[10px] tracking-widest">Free</span>
                                        </div>
                                        {gstDetails.cgst > 0 && (
                                            <div className="flex justify-between text-gray-500 text-[10px] sm:text-xs">
                                                <span>CGST ({gstDetails.totalGst > 0 ? (cart[0]?.category?.toLowerCase() === 'fashion' ? '6%' : '9%') : '0%'})</span>
                                                <span className="text-gray-400 font-medium">₹{gstDetails.cgst.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
                                            </div>
                                        )}
                                        {gstDetails.sgst > 0 && (
                                            <div className="flex justify-between text-gray-500 text-[10px] sm:text-xs">
                                                <span>SGST ({gstDetails.totalGst > 0 ? (cart[0]?.category?.toLowerCase() === 'fashion' ? '6%' : '9%') : '0%'})</span>
                                                <span className="text-gray-400 font-medium">₹{gstDetails.sgst.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
                                            </div>
                                        )}
                                        {gstDetails.igst > 0 && (
                                            <div className="flex justify-between text-gray-500 text-[10px] sm:text-xs">
                                                <span>IGST ({gstDetails.totalGst > 0 ? (cart[0]?.category?.toLowerCase() === 'fashion' ? '12%' : '18%') : '0%'})</span>
                                                <span className="text-gray-400 font-medium">₹{gstDetails.igst.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-white font-black text-lg sm:text-xl pt-3.5 sm:pt-4 border-t border-gray-800">
                                            <span>Total</span>
                                            <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">₹{cartTotal.toLocaleString()}</span>
                                        </div>
                                    </div>
                                );
                            })()}

                            <button
                                onClick={handlePlaceOrder}
                                disabled={isProcessing}
                                className="w-full bg-white text-black py-3.5 sm:py-4 rounded-xl font-black hover:bg-gray-200 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed group overflow-hidden relative text-xs sm:text-sm uppercase tracking-widest"
                            >
                                {isProcessing ? (
                                    <div className="flex flex-col items-center py-1">
                                        <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] mb-1 animate-pulse">
                                            {paymentStep === 'creating' ? 'Preparing Order...' :
                                                paymentStep === 'payment' ? 'Awaiting Payment...' :
                                                    paymentStep === 'verifying' ? 'Verifying Transaction...' :
                                                        paymentStep === 'done' ? 'Success!' : 'Processing...'}
                                        </span>
                                        <div className="w-20 h-1 bg-gray-900 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ x: '-100%' }}
                                                animate={{ x: '100%' }}
                                                transition={{ repeat: Infinity, duration: 1 }}
                                                className="w-12 h-full bg-white"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {selectedPaymentMethod === 'COD' ? 'Confirm Order' : 'Complete Payment'} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                <Lock className="w-3 h-3 text-white" />
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


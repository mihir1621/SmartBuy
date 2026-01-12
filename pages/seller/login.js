import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Smartphone, ArrowRight, Store, ShieldCheck, Mail, Lock } from 'lucide-react';
import { signIn, getSession } from "next-auth/react";

export default function SellerLogin() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [method, setMethod] = useState('phone'); // 'phone' or 'email'

    // Phone State
    const [mobileStep, setMobileStep] = useState('phone'); // 'phone', 'otp'
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);
    const [otpHash, setOtpHash] = useState('');

    // Email State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleMobileSubmit = async (e) => {
        e.preventDefault();
        if (mobileStep === 'phone') {
            setIsLoading(true);
            try {
                const res = await fetch('/api/auth/otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phone: phoneNumber })
                });
                const data = await res.json();
                if (data.success) {
                    setOtpHash(data.hash);
                    setMobileStep('otp');
                    console.log(`Hash: ${data.hash}`);
                } else {
                    alert('Failed to send OTP');
                }
            } catch (err) {
                alert('Error sending OTP');
            } finally {
                setIsLoading(false);
            }
        } else {
            setIsLoading(true);
            const otpValue = otp.join("");
            const res = await signIn('credentials', {
                redirect: false,
                phone: phoneNumber,
                otp: otpValue,
                hash: otpHash
            });

            setIsLoading(false);
            if (res?.error) {
                alert(res.error);
            } else {
                router.push('/seller');
            }
        }
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        alert("Email login coming soon for sellers! Please use Mobile Number for now.");
        // Implement credential signin if supported
    }

    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return;
        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
        if (element.nextSibling && element.value !== "") {
            element.nextSibling.focus();
        }
    };

    return (
        <div className="min-h-screen bg-black flex overflow-hidden">
            <Head>
                <title>Seller Login - SmartBuy</title>
            </Head>

            {/* Left Side - Hero */}
            <div className="hidden lg:flex w-1/2 relative bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/40 to-black/80 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=1287"
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="Seller Dashboard"
                />
                <div className="relative z-20 flex flex-col justify-between p-16 h-full text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center font-bold text-xl">S</div>
                        <span className="text-2xl font-bold">SmartBuy Seller</span>
                    </div>
                    <div>
                        <h1 className="text-5xl font-black mb-6 leading-tight">Grow your business <br />with SmartBuy.</h1>
                        <p className="text-xl text-gray-300 max-w-md">Join thousands of sellers who maximize their sales with our powerful platform.</p>
                    </div>
                    <div className="flex gap-8 text-sm font-medium text-gray-400">
                        <span>© 2025 SmartBuy</span>
                        <Link href="/terms">Terms</Link>
                        <Link href="/privacy">Privacy</Link>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-black relative">
                <Link href="/" className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">Return Home</Link>

                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-tr from-orange-500 to-red-600 rounded-2xl mx-auto flex items-center justify-center shadow-2xl shadow-orange-500/20 mb-6">
                            <Store className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-2">Seller Portal</h2>
                        <p className="text-gray-400">Log in to manage your products and orders</p>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 space-y-6 shadow-xl">
                        {/* Method Toggle */}
                        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-950 rounded-xl border border-gray-800">
                            <button
                                onClick={() => setMethod('phone')}
                                className={`py-2 rounded-lg text-sm font-bold transition-all ${method === 'phone' ? 'bg-gray-800 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                Phone Number
                            </button>
                            <button
                                onClick={() => setMethod('email')}
                                className={`py-2 rounded-lg text-sm font-bold transition-all ${method === 'email' ? 'bg-gray-800 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                Email
                            </button>
                        </div>

                        {method === 'phone' ? (
                            <form onSubmit={handleMobileSubmit} className="space-y-5">
                                {mobileStep === 'phone' ? (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Mobile Number</label>
                                        <div className="relative">
                                            <Smartphone className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                                            <input
                                                type="tel"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                className="w-full bg-black border border-gray-700 rounded-xl px-12 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder:text-gray-600"
                                                placeholder="9999999999"
                                                required
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-400">Enter OTP sent to {phoneNumber}</span>
                                            <button type="button" onClick={() => setMobileStep('phone')} className="text-orange-500 font-bold hover:underline">Change</button>
                                        </div>
                                        <div className="flex gap-3 justify-center">
                                            {otp.map((digit, idx) => (
                                                <input
                                                    key={idx}
                                                    type="text"
                                                    maxLength="1"
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(e.target, idx)}
                                                    className="w-14 h-14 bg-black border border-gray-700 rounded-xl text-center text-2xl font-bold text-white focus:border-orange-500 outline-none transition-all"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? 'Processing...' : (
                                        <>
                                            {mobileStep === 'phone' ? 'Get OTP' : 'Login securely'}
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleEmailSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                                        <input
                                            type="email"
                                            className="w-full bg-black border border-gray-700 rounded-xl px-12 py-3 text-white focus:border-orange-500 outline-none transition-all placeholder:text-gray-600"
                                            placeholder="seller@smartbuy.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                                        <input
                                            type="password"
                                            className="w-full bg-black border border-gray-700 rounded-xl px-12 py-3 text-white focus:border-orange-500 outline-none transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                                <button className="w-full bg-gray-800 text-gray-400 font-bold py-3.5 rounded-xl cursor-not-allowed">
                                    Login (Coming Soon)
                                </button>
                            </form>
                        )}
                    </div>

                    <div className="text-center">
                        <p className="text-gray-500 text-sm">
                            New Seller? <Link href="/register-seller" className="text-orange-500 font-bold hover:underline">Apply here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Smartphone, ArrowRight, Store, ShieldCheck, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';

export default function SellerLogin() {
    const router = useRouter();
    const { login, user, loading: authLoading } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [method, setMethod] = useState('email'); // Default to email now

    // Email State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (!authLoading && user) {
            if (user.role === 'SELLER' || user.role === 'seller') {
                router.push('/seller');
            } else {
                toast.error("Access denied. Seller account required.");
                // Optionally sign out or redirect to home
            }
        }
    }, [user, authLoading, router]);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(email, password);
            toast.success("Welcome back!");
            // Redirect handled by useEffect
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to login");
            setIsLoading(false);
        }
    };

    const handleMobileSubmit = (e) => {
        e.preventDefault();
        toast.info("Mobile login is currently being upgraded. Please use Email login.");
    };

    return (
        <div className="min-h-screen bg-black flex overflow-hidden">
            <Head>
                <title>Seller Login - SmartBuy</title>
            </Head>

            {/* Left Side - Hero */}
            <div className="hidden lg:flex w-1/2 relative bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/40 to-black/80 z-10" />
                <Image
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=1287"
                    className="object-cover"
                    alt="Seller Dashboard"
                    fill
                    priority
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
                                onClick={() => setMethod('email')}
                                className={`py-2 rounded-lg text-sm font-bold transition-all ${method === 'email' ? 'bg-gray-800 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                Email
                            </button>
                            <button
                                onClick={() => setMethod('phone')}
                                className={`py-2 rounded-lg text-sm font-bold transition-all ${method === 'phone' ? 'bg-gray-800 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                Phone Number
                            </button>
                        </div>

                        {method === 'phone' ? (
                            <form onSubmit={handleMobileSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Mobile Number</label>
                                    <div className="relative">
                                        <Smartphone className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                                        <input
                                            type="tel"
                                            disabled={true}
                                            className="w-full bg-black border border-gray-700 rounded-xl px-12 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder:text-gray-600 disabled:opacity-50"
                                            placeholder="Mobile login temporary disabled"
                                        />
                                    </div>
                                    <p className="text-xs text-yellow-500 text-center">Please use Email login as we upgrade our systems.</p>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleEmailSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
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
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full bg-black border border-gray-700 rounded-xl px-12 py-3 text-white focus:border-orange-500 outline-none transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? 'Logging in...' : (
                                        <>
                                            Login securely
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
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

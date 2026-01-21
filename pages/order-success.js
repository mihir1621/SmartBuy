import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag, ArrowRight, Home, Clock } from 'lucide-react';
import StoreNavbar from '@/components/StoreNavbar';
import Footer from '@/components/Footer';
import Confetti from 'react-confetti';

export default function OrderSuccess() {
    const router = useRouter();
    const { id } = router.query;
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOrder = useCallback(async () => {
        try {
            const res = await fetch(`/api/orders/${id}`);
            const data = await res.json();
            if (res.ok) {
                setOrder(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchOrder();
        }
    }, [id, fetchOrder]);

    if (loading && id) {
        return (
            <div className="min-h-screen bg-black flex flex-col">
                <StoreNavbar />
                <div className="flex-grow flex items-center justify-center">
                    <Clock className="animate-spin text-white w-10 h-10" />
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex flex-col text-white">
            <Head>
                <title>Order Confirmed | SmartBuy</title>
            </Head>
            <StoreNavbar />

            <main className="flex-grow flex items-center justify-center p-4 relative overflow-hidden">
                <Confetti numberOfPieces={200} recycle={false} gravity={0.1} colors={['#ffffff', '#a3a3a3', '#525252']} />

                <div className="max-w-xl w-full relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-900 rounded-[2rem] sm:rounded-[2.5rem] border border-gray-800 shadow-2xl overflow-hidden text-center p-8 sm:p-12 md:p-16 relative"
                    >
                        {/* Status Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-20 h-20 sm:w-28 sm:h-28 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 border border-white/20"
                        >
                            <CheckCircle className="w-10 h-10 sm:w-14 sm:h-14 text-white" />
                        </motion.div>

                        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 sm:mb-4 tracking-tight">Success!</h1>
                        <p className="text-gray-400 mb-8 sm:mb-10 text-base sm:text-lg leading-relaxed font-medium">
                            Your order has been placed successfully.
                            We&apos;ve sent a confirmation email to <span className="text-white font-bold">{order?.customerEmail || 'your inbox'}</span>.
                        </p>

                        <div className="bg-gray-950/50 rounded-[1.5rem] sm:rounded-3xl p-6 sm:p-8 mb-8 sm:mb-10 text-left border border-gray-800/50 backdrop-blur-sm">
                            <div className="flex justify-between mb-3 sm:mb-4 gap-2">
                                <span className="text-gray-500 font-bold uppercase text-[9px] sm:text-[10px] tracking-[0.2em] shrink-0">Order Ref</span>
                                <span className="text-white font-black text-xs sm:text-sm truncate">#ORD-{order?.id || id || '---'}</span>
                            </div>
                            <div className="flex justify-between mb-3 sm:mb-4 gap-2">
                                <span className="text-gray-500 font-bold uppercase text-[9px] sm:text-[10px] tracking-[0.2em] shrink-0">Purchased</span>
                                <span className="text-white font-bold text-xs sm:text-sm">{order ? new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' }) : new Date().toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                            </div>
                            <div className="flex justify-between pt-3 sm:pt-4 border-t border-gray-800 gap-2">
                                <span className="text-gray-500 font-bold uppercase text-[9px] sm:text-[10px] tracking-[0.2em] shrink-0">Total Amount</span>
                                <span className="text-white font-black text-lg sm:text-xl">₹{order?.totalAmount.toLocaleString() || '---'}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <Link
                                href="/"
                                className="bg-gray-800 text-white font-bold py-3.5 sm:py-4 rounded-xl sm:rounded-2xl hover:bg-gray-700 transition-all border border-gray-700 flex items-center justify-center gap-2 group text-sm sm:text-base"
                            >
                                <Home className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-y-0.5 transition-transform" />
                                Home
                            </Link>
                            <Link
                                href={order ? `/orders/${order.id}` : "/orders"}
                                className="bg-white text-black font-black py-3.5 sm:py-4 rounded-xl sm:rounded-2xl hover:bg-gray-200 transition-all shadow-xl shadow-white/10 flex items-center justify-center gap-2 group text-sm sm:text-base"
                            >
                                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                                Track Order
                            </Link>
                        </div>

                        {/* Decorative Glow */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 blur-[80px] rounded-full" />
                        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/5 blur-[80px] rounded-full" />
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

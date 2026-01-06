import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
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

    useEffect(() => {
        if (id) {
            fetchOrder();
        }
    }, [id]);

    const fetchOrder = async () => {
        try {
            const res = await fetch('/api/orders/history');
            const data = await res.json();
            if (res.ok) {
                const found = data.find(o => o.id === parseInt(id));
                if (found) setOrder(found);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && id) {
        return (
            <div className="min-h-screen bg-black flex flex-col">
                <StoreNavbar />
                <div className="flex-grow flex items-center justify-center">
                    <Clock className="animate-spin text-blue-500 w-10 h-10" />
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
                <Confetti numberOfPieces={200} recycle={false} gravity={0.1} colors={['#3b82f6', '#1e40af', '#ffffff']} />

                <div className="max-w-xl w-full relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-900 rounded-[2.5rem] border border-gray-800 shadow-2xl overflow-hidden text-center p-10 md:p-16 relative"
                    >
                        {/* Status Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-28 h-28 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-blue-500/20"
                        >
                            <CheckCircle className="w-14 h-14 text-blue-500" />
                        </motion.div>

                        <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Success!</h1>
                        <p className="text-gray-400 mb-10 text-lg leading-relaxed font-medium">
                            Your order has been placed successfully.
                            We&apos;ve sent a confirmation email to <span className="text-white font-bold">{order?.customerEmail || 'your inbox'}</span>.
                        </p>

                        <div className="bg-gray-950/50 rounded-3xl p-8 mb-10 text-left border border-gray-800/50 backdrop-blur-sm">
                            <div className="flex justify-between mb-4">
                                <span className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">Order ID</span>
                                <span className="text-blue-400 font-black">#ORD-{order?.id || id || '---'}</span>
                            </div>
                            <div className="flex justify-between mb-4">
                                <span className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">Purchase Date</span>
                                <span className="text-white font-bold">{order ? new Date(order.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between pt-4 border-t border-gray-800">
                                <span className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">Total Amount</span>
                                <span className="text-white font-black text-xl">₹{order?.totalAmount.toLocaleString() || '---'}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link
                                href="/"
                                className="bg-gray-800 text-white font-bold py-4 rounded-2xl hover:bg-gray-700 transition-all border border-gray-700 flex items-center justify-center gap-2 group"
                            >
                                <Home className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                                Return Home
                            </Link>
                            <Link
                                href={order ? `/orders/${order.id}` : "/orders"}
                                className="bg-white text-black font-black py-4 rounded-2xl hover:bg-gray-200 transition-all shadow-xl shadow-white/10 flex items-center justify-center gap-2 group"
                            >
                                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                Track Order
                            </Link>
                        </div>

                        {/* Decorative Glow */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 blur-[80px] rounded-full" />
                        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/5 blur-[80px] rounded-full" />
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag, ArrowRight, Home } from 'lucide-react';
import StoreNavbar from '@/components/StoreNavbar';
import Footer from '@/components/Footer';
import Confetti from 'react-confetti';

export default function OrderSuccess() {
    const router = useRouter();

    // Redirect to home if accessed directly? No, let them see the state even if refreshed for demo purposes.

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Head>
                <title>Order Confirmed | SmartBuy</title>
            </Head>
            <StoreNavbar />

            <main className="flex-grow flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <Confetti numberOfPieces={200} recycle={false} />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl shadow-xl overflow-hidden text-center p-8 md:p-12"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </motion.div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                        <p className="text-gray-500 mb-8">
                            Thank you for your purchase. Your order has been received and is being processed.
                        </p>

                        <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
                            <div className="flex justify-between mb-3 text-sm">
                                <span className="text-gray-500">Order ID</span>
                                <span className="text-gray-900 font-medium">#{Math.floor(Math.random() * 1000000)}</span>
                            </div>
                            <div className="flex justify-between mb-3 text-sm">
                                <span className="text-gray-500">Date</span>
                                <span className="text-gray-900 font-medium">{new Date().toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Email</span>
                                <span className="text-gray-900 font-medium">user@example.com</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Link
                                href="/"
                                className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                <Home className="w-5 h-5" />
                                Return to Home
                            </Link>
                            <button
                                className="w-full bg-white text-gray-900 font-bold py-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                View Order Details
                            </button>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

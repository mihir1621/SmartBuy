import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import StoreNavbar from '@/components/StoreNavbar';
import Footer from '@/components/Footer';
import { ShoppingBag, Package, ChevronRight, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const statusIcons = {
    'PENDING': <Clock className="w-4 h-4 text-amber-500" />,
    'PROCESSING': <Package className="w-4 h-4 text-blue-500" />,
    'SHIPPED': <Truck className="w-4 h-4 text-violet-500" />,
    'DELIVERED': <CheckCircle className="w-4 h-4 text-emerald-500" />,
    'CANCELLED': <XCircle className="w-4 h-4 text-red-500" />,
};

const statusClasses = {
    'PENDING': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'PROCESSING': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'SHIPPED': 'bg-violet-500/10 text-violet-500 border-violet-500/20',
    'DELIVERED': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    'CANCELLED': 'bg-red-500/10 text-red-500 border-red-500/20',
};

export default function OrderHistory() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            fetchOrders();
        }
    }, [status]);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders/history');
            const data = await res.json();
            if (res.ok) {
                setOrders(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex flex-col">
                <StoreNavbar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex flex-col text-white">
            <Head>
                <title>My Orders | SmartBuy</title>
            </Head>
            <StoreNavbar />

            <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-blue-500/10 rounded-2xl">
                        <ShoppingBag className="w-8 h-8 text-blue-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">My Orders</h1>
                        <p className="text-gray-400">Manage and track your recent purchases</p>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-12 text-center">
                        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="w-10 h-10 text-gray-500" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">No orders found</h2>
                        <p className="text-gray-400 mb-8">It looks like you haven&apos;t placed any orders yet.</p>
                        <Link href="/" className="inline-block bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order, idx) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden hover:border-gray-700 transition-all group"
                            >
                                <div className="p-6 sm:p-8 flex flex-col md:row justify-between gap-6 bg-gray-950/20">
                                    <div className="flex flex-wrap gap-x-8 gap-y-4">
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Order ID</p>
                                            <p className="font-bold text-blue-400">#ORD-{order.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Date</p>
                                            <p className="font-medium">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Amount</p>
                                            <p className="font-black text-lg">₹{order.totalAmount.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Status</p>
                                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold ${statusClasses[order.status]}`}>
                                                {statusIcons[order.status]}
                                                {order.status}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => router.push(`/orders/${order.id}`)}
                                            className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all border border-gray-700 flex items-center justify-center gap-2"
                                        >
                                            Track Order <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 sm:p-8 space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex gap-4 p-3 bg-gray-950/40 rounded-2xl border border-gray-800/50">
                                                <div className="w-16 h-16 relative rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
                                                    <Image
                                                        src={item.product?.image || 'https://via.placeholder.com/100'}
                                                        alt={item.product?.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-white text-sm truncate">{item.product?.name}</p>
                                                    <p className="text-xs text-gray-500 mb-1">{item.product?.category}</p>
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-xs text-gray-400 font-medium">Qty: {item.quantity}</p>
                                                        <p className="font-bold text-white text-sm">₹{item.price.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

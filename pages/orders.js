import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import StoreNavbar from '@/components/StoreNavbar';
import Footer from '@/components/Footer';

import { ShoppingBag, Package, ChevronRight, Clock, CheckCircle, Truck, XCircle, Search } from 'lucide-react';
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
    const [activeTab, setActiveTab] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
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

    const filteredOrders = orders.filter(order => {
        // Tab Filtering
        let matchesTab = true;
        if (activeTab === 'ONGOING') {
            matchesTab = ['PENDING', 'PROCESSING', 'SHIPPED'].includes(order.status);
        } else if (activeTab === 'COMPLETED') {
            matchesTab = order.status === 'DELIVERED';
        } else if (activeTab === 'CANCELLED') {
            matchesTab = order.status === 'CANCELLED';
        }

        // Search Filtering
        const matchesSearch = order.id.toString().includes(searchTerm) ||
            order.items.some(item => item.product?.name.toLowerCase().includes(searchTerm.toLowerCase()));

        return matchesTab && matchesSearch;
    });

    const tabs = [
        { id: 'ALL', label: 'All Orders' },
        { id: 'ONGOING', label: 'Ongoing' },
        { id: 'COMPLETED', label: 'Completed' },
        { id: 'CANCELLED', label: 'Cancelled' }
    ];

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
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                            <ShoppingBag className="w-8 h-8 text-blue-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight underline decoration-blue-500/30 decoration-4 underline-offset-8">My Orders</h1>
                            <p className="text-gray-400 mt-2 font-medium">Manage and track your recent purchases</p>
                        </div>
                    </div>

                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Find an order..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all"
                        />
                    </div>
                </div>

                {/* Status Tabs */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar mb-8 p-1 bg-gray-900/50 rounded-2xl border border-gray-800/50 w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                                ? "bg-white text-black shadow-lg shadow-white/5"
                                : "text-gray-500 hover:text-white hover:bg-gray-800"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="bg-gray-900/30 border border-gray-800/50 rounded-[2.5rem] p-16 text-center backdrop-blur-sm">
                        <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-700/50">
                            <Package className="w-10 h-10 text-gray-600" />
                        </div>
                        <h2 className="text-2xl font-black mb-3">No matching orders</h2>
                        <p className="text-gray-500 mb-10 max-w-xs mx-auto">We couldn&apos;t find any orders matching your current filters.</p>
                        <Link href="/" className="inline-block bg-white text-black px-10 py-4 rounded-2xl font-black hover:bg-gray-200 transition-all shadow-xl shadow-white/5 active:scale-95">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {filteredOrders.map((order, idx) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-gray-900/50 border border-gray-800 rounded-[2rem] overflow-hidden hover:border-gray-700 transition-all group backdrop-blur-sm"
                            >
                                <div className="p-6 sm:p-8 flex flex-col lg:flex-row justify-between lg:items-center gap-6 bg-gray-950/40">
                                    <div className="flex flex-wrap gap-x-10 gap-y-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Order Ref</p>
                                            <p className="font-black text-white">#ORD-{order.id}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Ordered On</p>
                                            <p className="font-bold text-gray-300">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Total Paid</p>
                                            <p className="font-black text-xl text-blue-500">₹{order.totalAmount.toLocaleString()}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Track Status</p>
                                            <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${statusClasses[order.status]}`}>
                                                {statusIcons[order.status]}
                                                {order.status}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <button
                                            onClick={() => router.push(`/orders/${order.id}`)}
                                            className="w-full sm:w-auto bg-white text-black px-8 py-3 rounded-xl text-xs font-black transition-all shadow-lg hover:shadow-white/10 flex items-center justify-center gap-2 group/btn active:scale-95"
                                        >
                                            TRACK SHIPMENT <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 sm:p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex gap-5 p-4 bg-gray-950/60 rounded-2xl border border-gray-800/30 hover:border-gray-700 transition-colors">
                                                <div className="w-16 h-16 relative rounded-xl overflow-hidden bg-gray-800 flex-shrink-0 border border-gray-800 shadow-inner">
                                                    <Image
                                                        src={item.product?.image || '/placeholder.png'}
                                                        alt={item.product?.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                    <h4 className="font-bold text-white text-sm truncate">{item.product?.name}</h4>
                                                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-0.5">{item.product?.category}</p>
                                                    <div className="flex justify-between items-center mt-2">
                                                        <span className="text-[11px] font-bold text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded">Qty: {item.quantity}</span>
                                                        <span className="font-black text-white text-sm">₹{item.price.toLocaleString()}</span>
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

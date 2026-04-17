import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import StoreNavbar from '@/components/StoreNavbar';
import Footer from '@/components/Footer';

import { ShoppingBag, Package, ChevronRight, Clock, CheckCircle, Truck, XCircle, Search, RefreshCcw, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { OrderSkeleton } from '@/components/skeletons/PageSkeletons';
import { usePersonalization } from '@/hooks/usePersonalization';
import { products as staticProducts } from '@/data/products';

// ... (keep statusIcons and statusClasses constants as they are unless they need to be moved down? No, they are outside the component, so I must start from line 1 if I want to be safe, or just targeted replacement)

const statusIcons = {
    'PENDING': <Clock className="w-4 h-4 text-accent" />,
    'PROCESSING': <Package className="w-4 h-4 text-accent" />,
    'SHIPPED': <Truck className="w-4 h-4 text-accent" />,
    'DELIVERED': <CheckCircle className="w-4 h-4 text-success" />,
    'CANCELLED': <XCircle className="w-4 h-4 text-error" />,
    'RETURN_REQUESTED': <RefreshCcw className="w-4 h-4 text-warning" />,
    'REFUND_REQUESTED': <RotateCcw className="w-4 h-4 text-warning" />,
};

const statusClasses = {
    'PENDING': 'bg-accent/10 text-accent border-accent/20',
    'PROCESSING': 'bg-accent/10 text-accent border-accent/20',
    'SHIPPED': 'bg-accent/10 text-accent border-accent/20',
    'DELIVERED': 'bg-success/10 text-success border-success/20',
    'CANCELLED': 'bg-error/10 text-error border-error/20',
    'RETURN_REQUESTED': 'bg-warning/10 text-warning border-warning/20',
    'REFUND_REQUESTED': 'bg-warning/10 text-warning border-warning/20',
};

export default function OrderHistory() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Personalization Engine
    const { recommendations, isNewUser } = usePersonalization(user?.uid || user?.id, staticProducts);

    const fetchOrders = useCallback(async () => {
        if (!user) return;
        try {
            const res = await fetch(`/api/orders/history?userId=${user.id || user.uid}&email=${encodeURIComponent(user.email)}`);
            const data = await res.json();
            if (res.ok) {
                setOrders(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/login');
            } else {
                fetchOrders();
            }
        }
    }, [user, authLoading, router, fetchOrders]);

    const filteredOrders = orders.filter(order => {
        let matchesTab = true;
        if (activeTab === 'ONGOING') {
            matchesTab = ['PENDING', 'PROCESSING', 'SHIPPED'].includes(order.status);
        } else if (activeTab === 'COMPLETED') {
            matchesTab = order.status === 'DELIVERED';
        } else if (activeTab === 'CANCELLED') {
            matchesTab = order.status === 'CANCELLED';
        }

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
        return <OrderSkeleton />;
    }

    return (
        <div className="min-h-screen bg-background flex flex-col text-foreground font-sans">
            <Head>
                <title>My Orders | SmartBuy</title>
            </Head>
            <StoreNavbar />

            <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10 sm:mb-14">
                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="p-4 sm:p-5 bg-accent/5 rounded-[1.5rem] border border-accent/10 shadow-sm">
                            <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground uppercase">My Orders</h1>
                            <p className="text-secondary-text mt-1 font-medium text-xs sm:text-sm uppercase tracking-widest">Tracking {orders.length} purchases</p>
                        </div>
                    </div>

                    <div className="relative w-full lg:w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text" />
                        <input
                            type="text"
                            placeholder="Find an order..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none text-sm transition-all shadow-sm"
                        />
                    </div>
                </div>
                
                {/* User Dashboard Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
                    <div className="lg:col-span-2 space-y-6">
                        <section className="bg-surface p-6 sm:p-8 rounded-[2rem] border border-border shadow-saas">
                            <h2 className="text-sm font-black mb-6 uppercase tracking-[0.2em] flex items-center gap-3 text-secondary-text">
                                <Clock className="w-4 h-4 text-accent" /> Recent Activity
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-5 bg-background rounded-2xl border border-border/50">
                                    <p className="text-[10px] uppercase font-black text-secondary-text mb-1 tracking-widest">Lifetime Orders</p>
                                    <p className="text-3xl font-black text-foreground tracking-tighter">{orders.length}</p>
                                </div>
                                <div className="p-5 bg-accent/5 rounded-2xl border border-accent/10">
                                    <p className="text-[10px] uppercase font-black text-accent mb-1 tracking-widest">Active Status</p>
                                    <p className="text-3xl font-black text-accent tracking-tighter">Premium</p>
                                </div>
                            </div>
                        </section>

                        {recommendations.length > 0 && (
                            <section className="bg-surface p-6 sm:p-8 rounded-[2rem] border border-border shadow-saas">
                                <h2 className="text-sm font-black mb-6 uppercase tracking-[0.2em] flex items-center gap-3 text-secondary-text">
                                    <CheckCircle className="w-4 h-4 text-success" /> Recommended For You
                                </h2>
                                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                                    {recommendations.slice(0, 4).map(product => (
                                        <Link key={product.id} href={`/product/${product.id}`} className="w-44 flex-shrink-0 bg-background p-3 rounded-2xl border border-border hover:border-accent/30 transition-all group">
                                            <div className="aspect-square relative rounded-xl overflow-hidden mb-3">
                                                <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            <p className="text-[11px] font-bold text-foreground truncate">{product.name}</p>
                                            <p className="text-xs font-black text-accent mt-1">₹{product.price.toLocaleString()}</p>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                    
                    <div className="space-y-6 h-full">
                        <section className="bg-accent text-white p-7 sm:p-8 rounded-[2rem] border border-accent/20 h-full relative overflow-hidden shadow-2xl shadow-accent/20">
                            <div className="relative z-10">
                                <h3 className="font-black text-white/90 mb-2 uppercase tracking-[0.15em] text-xs">Your Profile</h3>
                                <p className="text-white/80 text-lg font-bold mb-8">Curated for <span className="text-white">{user?.displayName || 'VIP Guest'}</span></p>
                                <div className="space-y-5">
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white border border-white/30 backdrop-blur-md">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <p className="text-xs text-white/90 font-bold uppercase tracking-tight">AI personalization active</p>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white border border-white/30 backdrop-blur-md">
                                        <Truck className="w-5 h-5" />
                                    </div>
                                    <p className="text-xs text-white/90 font-bold uppercase tracking-tight">Express delivery enabled</p>
                                  </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
                        </section>
                    </div>
                </div>

                {/* Status Tabs */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar mb-10 p-1.5 bg-secondary/50 rounded-2xl border border-border w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id
                                ? "bg-surface text-accent shadow-sm border border-border"
                                : "text-secondary-text hover:text-foreground"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="bg-surface border border-border rounded-[2.5rem] p-12 sm:p-20 text-center shadow-saas">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-background rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-border shadow-sm">
                            <Package className="w-8 h-8 sm:w-10 sm:h-10 text-secondary-text" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black mb-3 text-foreground tracking-tight uppercase">No matching orders</h2>
                        <p className="text-secondary-text mb-10 max-w-xs mx-auto text-sm font-medium">We couldn&apos;t find any orders matching your filters.</p>
                        <Link href="/" className="inline-block bg-accent text-white px-10 py-4 rounded-2xl font-black hover:bg-accent-hover transition-all shadow-saas active:scale-95 text-xs uppercase tracking-widest">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8 sm:space-y-10">
                        {filteredOrders.map((order, idx) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-surface border border-border rounded-[2.5rem] overflow-hidden hover:border-accent/20 transition-all group shadow-saas"
                            >
                                <div className="p-6 sm:p-10 flex flex-col lg:flex-row justify-between lg:items-center gap-8 bg-secondary/30 border-b border-border/50">
                                    <div className="flex flex-wrap gap-x-10 sm:gap-x-16 gap-y-6">
                                        <div className="space-y-1.5">
                                            <p className="text-[10px] font-black text-secondary-text uppercase tracking-widest">Order Ref</p>
                                            <p className="font-black text-foreground text-sm sm:text-base tracking-tighter">#ORD-{order.id}</p>
                                        </div>
                                        <div className="space-y-1.5">
                                            <p className="text-[10px] font-black text-secondary-text uppercase tracking-widest">Ordered On</p>
                                            <p className="font-bold text-foreground/80 text-sm sm:text-base">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p>
                                        </div>
                                        <div className="space-y-1.5">
                                            <p className="text-[10px] font-black text-secondary-text uppercase tracking-widest">Total Paid</p>
                                            <p className="font-black text-xl sm:text-2xl text-foreground tracking-tighter">₹{order.totalAmount.toLocaleString()}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-secondary-text uppercase tracking-widest">Track Status</p>
                                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest shadow-sm ${statusClasses[order.status]}`}>
                                                {statusIcons[order.status]}
                                                {order.status.replace('_', ' ')}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <button
                                            onClick={() => router.push(`/orders/${order.id}`)}
                                            className="w-full sm:w-auto bg-accent text-white px-8 py-4 rounded-2xl text-xs font-black transition-all shadow-saas hover:bg-accent-hover flex items-center justify-center gap-3 group/btn active:scale-95 uppercase tracking-widest"
                                        >
                                            Track Order <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 sm:p-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex gap-5 p-5 bg-background rounded-[1.5rem] border border-border/50 hover:border-accent/20 transition-all hover:shadow-sm">
                                                <div className="w-20 h-20 relative rounded-xl overflow-hidden bg-secondary flex-shrink-0 border border-border">
                                                    <Image
                                                        src={item.product?.image || '/placeholder.png'}
                                                        alt={item.product?.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                    <h4 className="font-bold text-foreground text-sm truncate tracking-tight">{item.product?.name}</h4>
                                                    <p className="text-[9px] font-black text-secondary-text uppercase tracking-widest mt-1">{item.product?.category}</p>
                                                    <div className="flex justify-between items-center mt-3">
                                                        <span className="text-[10px] font-black text-secondary-text bg-secondary/50 px-2 py-1 rounded-lg">Qty {item.quantity}</span>
                                                        <span className="font-black text-foreground text-sm tracking-tighter">₹{item.price.toLocaleString()}</span>
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

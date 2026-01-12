import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ShoppingBag, Package, TrendingUp, DollarSign, Plus, ArrowRight, AlertTriangle } from 'lucide-react';
import SellerLayout from '@/components/seller/SellerLayout';
import { useSession } from 'next-auth/react';

export default function SellerDashboard() {
    const { data: session } = useSession();
    const [stats, setStats] = useState({
        orders: 0,
        products: 0,
        revenue: 0,
        pending: 0
    });

    useEffect(() => {
        // Optimistic stats loading from local or mock
        const loadStats = () => {
            const localProducts = JSON.parse(localStorage.getItem('seller_products') || '[]');
            setStats(prev => ({ ...prev, products: localProducts.length }));

            // Mock revenue/orders for demo
            setStats(prev => ({
                ...prev,
                orders: 12,
                revenue: 45000,
                pending: 3,
                products: localProducts.length
            }));
        };
        loadStats();
    }, []);

    return (
        <SellerLayout title="Overview">
            {/* Welcome Section */}
            <div className="mb-10">
                <h1 className="text-3xl font-black text-white mb-2">
                    Hello, {session?.user?.name || 'Seller'} 👋
                </h1>
                <p className="text-gray-400">Here&apos;s what&apos;s happening with your store today.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Revenue</p>
                            <h3 className="text-2xl font-black text-white">₹{stats.revenue.toLocaleString()}</h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-400/10 py-1.5 px-3 rounded-lg w-fit">
                        <TrendingUp size={14} />
                        +12.5% vs last month
                    </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                            <Package size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Products</p>
                            <h3 className="text-2xl font-black text-white">{stats.products}</h3>
                        </div>
                    </div>
                    <Link href="/seller/products/new" className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1">
                        Add New <ArrowRight size={12} />
                    </Link>
                </div>

                <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                            <ShoppingBag size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Orders</p>
                            <h3 className="text-2xl font-black text-white">{stats.orders}</h3>
                        </div>
                    </div>
                    <Link href="/seller/orders" className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1">
                        View Orders <ArrowRight size={12} />
                    </Link>
                </div>

                <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Pending Actions</p>
                            <h3 className="text-2xl font-black text-white">{stats.pending}</h3>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500">Orders requiring attention</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-3xl p-8 relative overflow-hidden group">
                    {/* Decor */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full -mr-32 -mt-32 pointer-events-none" />

                    <div className="relative z-10">
                        <h3 className="text-2xl font-black text-white mb-2">Add New Product</h3>
                        <p className="text-gray-400 mb-8 max-w-sm">Expand your catalog by listing new items with detailed descriptions, prices, and offers.</p>

                        <Link href="/seller/products/new" className="bg-white text-black font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-white/10 hover:bg-gray-100 transition-all inline-flex items-center gap-2">
                            <Plus size={20} />
                            List Item
                        </Link>
                    </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
                    <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-800/50 rounded-xl transition-colors cursor-pointer text-sm">
                                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
                                    <ShoppingBag size={16} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-white font-medium">New Order #102{i}</p>
                                    <p className="text-gray-500 text-xs">2 minutes ago</p>
                                </div>
                                <span className="text-blue-500 font-bold">+₹1,299</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
}

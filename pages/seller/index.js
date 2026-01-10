import SellerLayout from '@/components/seller/SellerLayout';
import { Package, ShoppingBag, TrendingUp, DollarSign, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SellerDashboard() {
    // In a real app, these would come from an API call
    const stats = [
        { label: 'Total Sales', value: '₹0', icon: DollarSign, color: 'from-green-500 to-emerald-600' },
        { label: 'Total Orders', value: '0', icon: ShoppingBag, color: 'from-blue-500 to-indigo-600' },
        { label: 'My Products', value: '0', icon: Package, color: 'from-orange-500 to-red-600' },
        { label: 'Growth', value: '+0%', icon: TrendingUp, color: 'from-purple-500 to-pink-600' },
    ];

    return (
        <SellerLayout title="Dashboard">
            <div className="space-y-8">
                {/* Welcome Section */}
                <div className="flex justify-between items-center bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-3xl border border-gray-700 relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-3xl font-black text-white mb-2">Welcome back, Seller!</h1>
                        <p className="text-gray-400 max-w-xl">
                            Ready to grow your business? Track your sales, manage your products, and fulfill orders all in one place.
                        </p>
                        <Link href="/seller/products/new" className="inline-flex items-center gap-2 mt-6 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-orange-500/20">
                            <Plus size={20} />
                            Add New Product
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-gray-900 border border-gray-800 p-6 rounded-2xl relative overflow-hidden group hover:border-gray-600 transition-all"
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}>
                                <stat.icon className="text-white" size={24} />
                            </div>
                            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">{stat.label}</h3>
                            <p className="text-3xl font-black text-white mt-1">{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Recent Activity Placeholder */}
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
                    <h3 className="text-xl font-bold text-white mb-6">Recent Orders</h3>
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <ShoppingBag className="w-16 h-16 text-gray-700 mb-4" />
                        <h4 className="text-lg font-bold text-white">No orders yet</h4>
                        <p className="text-gray-500 max-w-sm mt-2">
                            Once you start selling, your recent orders will appear here. make sure to add attractive products!
                        </p>
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
}

import AdminLayout from '@/components/admin/AdminLayout';
import {
    TrendingUp,
    Users,
    ShoppingBag,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Package,
    CheckCircle,
    Clock,
    ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const stats = [
    {
        label: 'Total Revenue',
        value: '₹12,45,800',
        change: '+12.5%',
        isPositive: true,
        icon: DollarSign,
        color: 'from-blue-500 to-indigo-600'
    },
    {
        label: 'New Orders',
        value: '456',
        change: '+18.2%',
        isPositive: true,
        icon: ShoppingBag,
        color: 'from-emerald-500 to-teal-600'
    },
    {
        label: 'Total Customers',
        value: '2,840',
        change: '+5.4%',
        isPositive: true,
        icon: Users,
        color: 'from-violet-500 to-purple-600'
    },
    {
        label: 'Active Products',
        value: '142',
        change: '-2.1%',
        isPositive: false,
        icon: Package,
        color: 'from-amber-500 to-orange-600'
    },
];

const recentOrders = [
    { id: '#ORD-7829', customer: 'Rahul Sharma', status: 'Delivered', amount: '₹14,999', date: '2 mins ago' },
    { id: '#ORD-7828', customer: 'Anjali Gupta', status: 'Processing', amount: '₹2,499', date: '15 mins ago' },
    { id: '#ORD-7827', customer: 'Amit Patel', status: 'Shipped', amount: '₹45,000', date: '1 hour ago' },
    { id: '#ORD-7826', customer: 'Priya Singh', status: 'Pending', amount: '₹999', date: '3 hours ago' },
];

export default function AdminDashboard() {
    return (
        <AdminLayout title="Dashboard Overview">
            <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-gray-900 border border-gray-800 rounded-3xl p-6 relative overflow-hidden group hover:border-gray-700 transition-all hover:shadow-2xl hover:shadow-blue-500/5 shadow-sm"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg shadow-black/20 group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="text-white" size={24} />
                                </div>
                                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                                    }`}>
                                    {stat.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                    {stat.change}
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-semibold mb-1 uppercase tracking-wider">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
                            </div>

                            {/* Decorative background element */}
                            <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${stat.color} opacity-[0.03] blur-2xl group-hover:opacity-10 transition-opacity`} />
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Main Chart Placeholder */}
                    <div className="xl:col-span-2 bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Sales Performance</h3>
                                <p className="text-sm text-gray-500">Revenue stats for the last 30 days</p>
                            </div>
                            <div className="flex gap-2 bg-gray-800 p-1 rounded-xl">
                                <button className="px-4 py-1.5 text-xs font-bold bg-gray-700 text-white rounded-lg shadow-xl">Month</button>
                                <button className="px-4 py-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors">Year</button>
                            </div>
                        </div>

                        <div className="h-80 w-full bg-gray-950/30 rounded-2xl border border-dashed border-gray-800 flex items-center justify-center relative overflow-hidden group">
                            <div className="text-center z-10">
                                <TrendingUp className="mx-auto mb-4 text-gray-700 group-hover:text-blue-500 transition-colors" size={48} />
                                <p className="text-gray-600 font-semibold tracking-wide uppercase text-[10px]">Revenue Chart visualization would load here</p>
                            </div>

                            {/* Animated wave pattern simulation */}
                            <div className="absolute inset-0 opacity-10 pointer-events-none">
                                <svg width="100%" height="100%" viewBox="0 0 1000 200" className="absolute bottom-0">
                                    <path d="M0,150 Q250,50 500,150 T1000,150 L1000,200 L0,200 Z" fill="url(#grad)" />
                                    <defs>
                                        <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                                            <stop offset="100%" style={{ stopColor: '#000', stopOpacity: 1 }} />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity Table */}
                    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold text-white">Recent Orders</h3>
                            <Link href="/admin/orders" className="text-blue-400 text-xs font-bold flex items-center gap-1 hover:underline">
                                View All <ExternalLink size={12} />
                            </Link>
                        </div>

                        <div className="space-y-6">
                            {recentOrders.map((order, idx) => (
                                <div key={order.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-800 border border-gray-700 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-blue-600/10 group-hover:text-blue-400 transition-all border border-transparent shadow-sm group-hover:border-blue-500/20">
                                            {order.status === 'Delivered' ? <CheckCircle size={20} /> : <Clock size={20} />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white group-hover:text-blue-400 transition-colors leading-tight">{order.customer}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{order.id} • {order.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-white">{order.amount}</p>
                                        <p className={`text-[10px] font-bold uppercase tracking-tighter ${order.status === 'Delivered' ? 'text-emerald-500' :
                                                order.status === 'Processing' ? 'text-amber-500' :
                                                    order.status === 'Shipped' ? 'text-blue-500' : 'text-gray-500'
                                            }`}>
                                            {order.status}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-10 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98]">
                            Generate Report
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

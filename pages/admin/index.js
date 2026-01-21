import AdminLayout from '@/components/admin/AdminLayout';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
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
import dynamic from 'next/dynamic';

// Dynamic import for Recharts to prevent SSR issues
const AreaChart = dynamic(() => import('recharts').then(mod => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(mod => mod.Area), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });

export default function AdminDashboard() {
    const { user } = useAuth();
    const [statsData, setStatsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`/api/admin/stats?userId=${user?.uid}&email=${encodeURIComponent(user?.email || '')}`);
                const data = await res.json();
                setStatsData(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchStats();
        } else if (!loading && !user) {
            setLoading(false);
        }
    }, [user, loading]);

    if (loading) return (
        <AdminLayout title="Dashboard Overview">
            <div className="flex h-[60vh] items-center justify-center">
                <Clock className="animate-spin text-white w-10 h-10" />
            </div>
        </AdminLayout>
    );

    if (!statsData || statsData.error) {
        return (
            <AdminLayout title="Dashboard Overview">
                <div className="flex h-[60vh] items-center justify-center flex-col gap-4">
                    <div className="text-white font-bold text-xl">
                        {statsData?.error || "Failed to load dashboard data"}
                    </div>
                    <p className="text-gray-400">Please make sure you are logged in as an Admin.</p>
                    <Link href="/auth/signin" className="bg-white text-black px-6 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors">
                        Go to Login
                    </Link>
                </div>
            </AdminLayout>
        );
    }

    const { stats, chartData, recentOrders } = statsData;

    const statsCards = [
        {
            label: 'Total Revenue',
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            change: '+12.5%',
            isPositive: true,
            icon: DollarSign,
            color: 'from-gray-800 to-gray-900'
        },
        {
            label: 'Total Orders',
            value: stats.totalOrders.toString(),
            change: '+18.2%',
            isPositive: true,
            icon: ShoppingBag,
            color: 'from-gray-800 to-gray-900'
        },
        {
            label: 'Total Customers',
            value: stats.totalUsers.toString(),
            change: '+5.4%',
            isPositive: true,
            icon: Users,
            color: 'from-gray-800 to-gray-900'
        },
        {
            label: 'Active Products',
            value: stats.totalProducts.toString(),
            change: '-2.1%',
            isPositive: false,
            icon: Package,
            color: 'from-gray-800 to-gray-900'
        },
    ];

    return (
        <AdminLayout title="Dashboard Overview">
            <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statsCards.map((stat, idx) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-gray-900 border border-gray-800 rounded-3xl p-6 relative overflow-hidden group hover:border-gray-700 transition-all hover:shadow-2xl hover:shadow-white/5 shadow-sm"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg shadow-black/20 group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="text-white" size={24} />
                                </div>
                                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.isPositive ? 'bg-white/10 text-white' : 'bg-white/10 text-white'
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
                    {/* Main Chart */}
                    <div className="xl:col-span-2 bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Sales Performance</h3>
                                <p className="text-sm text-gray-500">Revenue stats for the last 7 days</p>
                            </div>
                            <div className="flex gap-2 bg-gray-800 p-1 rounded-xl">
                                <button className="px-4 py-1.5 text-xs font-bold bg-gray-700 text-white rounded-lg shadow-xl">Weekly</button>
                                <button className="px-4 py-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors">Monthly</button>
                            </div>
                        </div>

                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#9ca3af"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#9ca3af"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `₹${value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#111827', borderColor: '#1f2937', borderRadius: '12px', color: '#fff' }}
                                        itemStyle={{ color: '#ffffff' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="total"
                                        stroke="#ffffff"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorTotal)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Activity Table */}
                    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold text-white">Recent Orders</h3>
                            <Link href="/admin/orders" className="text-white text-xs font-bold flex items-center gap-1 hover:underline">
                                View All <ExternalLink size={12} />
                            </Link>
                        </div>

                        <div className="space-y-6">
                            {recentOrders.map((order, idx) => (
                                <div key={order.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-800 border border-gray-700 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-white/10 group-hover:text-white transition-all border border-transparent shadow-sm group-hover:border-white/20">
                                            {order.status === 'DELIVERED' ? <CheckCircle size={20} /> : <Clock size={20} />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white group-hover:text-gray-300 transition-colors leading-tight truncate max-w-[120px]">{order.customerName}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">#ORD-{order.id} • {new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-white">₹{order.totalAmount.toLocaleString()}</p>
                                        <p className={`text-[10px] font-bold uppercase tracking-tighter ${order.status === 'DELIVERED' ? 'text-white' :
                                            order.status === 'PROCESSING' ? 'text-white' :
                                                order.status === 'SHIPPED' ? 'text-white' :
                                                    order.status === 'CANCELLED' ? 'text-white' : 'text-white'
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

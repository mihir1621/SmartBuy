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
    ExternalLink,
    Loader2
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
    }, [user]);

    if (loading) return (
        <AdminLayout title="Dashboard Overview">
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="animate-spin text-accent w-10 h-10" />
            </div>
        </AdminLayout>
    );

    if (!statsData || statsData.error) {
        return (
            <AdminLayout title="Dashboard Overview">
                <div className="flex h-[60vh] items-center justify-center flex-col gap-4">
                    <div className="text-foreground font-black text-2xl tracking-tight">
                        {statsData?.error || "Access Denied"}
                    </div>
                    <p className="text-secondary-text font-medium italic">&quot;Please make sure you are logged in as an Admin.&quot;</p>
                    <Link href="/auth/signin" className="bg-accent text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-accent-hover transition-all shadow-saas">
                        Login as Admin
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
            color: 'from-accent/20 to-accent/5'
        },
        {
            label: 'Total Orders',
            value: stats.totalOrders.toString(),
            change: '+18.2%',
            isPositive: true,
            icon: ShoppingBag,
            color: 'from-success/20 to-success/5'
        },
        {
            label: 'Total Customers',
            value: stats.totalUsers.toString(),
            change: '+5.4%',
            isPositive: true,
            icon: Users,
            color: 'from-warning/20 to-warning/5'
        },
        {
            label: 'Active Products',
            value: stats.totalProducts.toString(),
            change: '-2.1%',
            isPositive: false,
            icon: Package,
            color: 'from-error/20 to-error/5'
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
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-surface border border-border rounded-3xl p-6 relative overflow-hidden group hover:border-accent/30 transition-all hover:shadow-saas shadow-sm"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                                    <stat.icon className="text-accent" size={28} />
                                </div>
                                <div className={`flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1.5 rounded-xl uppercase tracking-widest shadow-sm ${stat.isPositive ? 'bg-success/10 text-success border border-success/20' : 'bg-error/10 text-error border border-error/20'
                                    }`}>
                                    {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {stat.change}
                                </div>
                            </div>
                            <div className="relative z-10">
                                <p className="text-secondary-text text-[10px] font-black mb-1.5 uppercase tracking-[0.2em]">{stat.label}</p>
                                <h3 className="text-3xl font-black text-foreground tracking-tighter group-hover:text-accent transition-colors">{stat.value}</h3>
                            </div>

                            {/* Decorative background element */}
                            <div className={`absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${stat.color} opacity-0 blur-3xl group-hover:opacity-30 transition-opacity duration-700`} />
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Main Chart */}
                    <div className="xl:col-span-2 bg-surface border border-border rounded-3xl p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-xl font-black text-foreground mb-1 tracking-tight">Sales Performance</h3>
                                <p className="text-xs text-secondary-text font-medium uppercase tracking-widest">Revenue stats for the last 7 days</p>
                            </div>
                            <div className="flex gap-2 bg-background p-1 rounded-xl border border-border">
                                <button className="px-4 py-1.5 text-[10px] font-black bg-accent text-white rounded-lg shadow-saas uppercase tracking-widest transition-all">Weekly</button>
                                <button className="px-4 py-1.5 text-[10px] font-black text-secondary-text hover:text-foreground transition-colors uppercase tracking-widest">Monthly</button>
                            </div>
                        </div>

                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                    <XAxis
                                        dataKey="name"
                                        stroke="var(--secondary-text)"
                                        fontSize={10}
                                        fontWeight="900"
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                    />
                                    <YAxis
                                        stroke="var(--secondary-text)"
                                        fontSize={10}
                                        fontWeight="900"
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `₹${value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ 
                                            backgroundColor: 'var(--surface)', 
                                            borderColor: 'var(--border)', 
                                            borderRadius: '16px', 
                                            color: 'var(--foreground)',
                                            fontWeight: '900',
                                            fontSize: '12px',
                                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                        }}
                                        itemStyle={{ color: 'var(--accent)' }}
                                        cursor={{ stroke: 'var(--accent)', strokeWidth: 2, strokeDasharray: '5 5' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="total"
                                        stroke="#2563EB"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorTotal)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Activity Table */}
                    <div className="bg-surface border border-border rounded-3xl p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-foreground tracking-tight">Recent Orders</h3>
                            <Link href="/admin/orders" className="text-accent text-xs font-black flex items-center gap-1 hover:underline uppercase tracking-widest">
                                Manage <ExternalLink size={12} />
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {recentOrders.map((order, idx) => (
                                <div key={order.id} className="flex items-center justify-between group p-3 rounded-2xl hover:bg-background transition-all border border-transparent hover:border-border">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-background border border-border rounded-2xl flex items-center justify-center text-secondary-text group-hover:bg-accent/10 group-hover:text-accent transition-all shadow-sm">
                                            {order.status === 'DELIVERED' ? <Package size={20} className="text-success" /> : <Clock size={20} className="text-warning" />}
                                        </div>
                                        <div>
                                            <p className="font-black text-foreground group-hover:text-accent transition-colors leading-tight truncate max-w-[120px] tracking-tight">{order.customerName}</p>
                                            <p className="text-[10px] text-secondary-text mt-1 font-black uppercase tracking-[0.1em]">ORD-{order.id.slice(-6)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-foreground">₹{order.totalAmount.toLocaleString()}</p>
                                        <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${order.status === 'DELIVERED' ? 'text-success' : 'text-warning'}`}>
                                            {order.status}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-8 bg-accent text-white hover:bg-accent-hover font-black py-4 rounded-2xl transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-[10px] shadow-saas flex items-center justify-center gap-2">
                            <TrendingUp size={16} /> Generate Intelligence report
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

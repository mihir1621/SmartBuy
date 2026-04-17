import AdminLayout from '@/components/admin/AdminLayout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import {
    ShoppingBag,
    Search,
    Filter,
    Eye,
    CheckCircle,
    Clock,
    XCircle,
    MoreVertical,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const statusColors = {
    'PENDING': 'text-warning bg-warning/10 border-warning/20',
    'PROCESSING': 'text-accent bg-accent/10 border-accent/20',
    'SHIPPED': 'text-accent bg-accent/10 border-accent/20',
    'DELIVERED': 'text-success bg-success/10 border-success/20',
    'CANCELLED': 'text-error bg-error/10 border-error/20',
};

export default function AdminOrders() {
    const { user } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(`/api/admin/orders?userId=${user?.uid}&email=${encodeURIComponent(user?.email || '')}`);
                const data = await res.json();
                setOrders(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchOrders();
    }, [user]);

    const filteredOrders = orders.filter(o =>
        o.customerName.toLowerCase().includes(search.toLowerCase()) ||
        o.id.toString().includes(search)
    );

    return (
        <AdminLayout title="Order Management">
            <div className="space-y-6">
                <div className="flex flex-col sm:row justify-between items-center gap-4 bg-surface p-6 rounded-3xl border border-border shadow-sm">
                    <div className="relative w-full sm:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-text group-focus-within:text-accent transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Find orders..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-background border border-border rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all text-foreground font-medium"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 bg-background hover:bg-secondary text-foreground font-black py-3 px-6 rounded-2xl border border-border transition-all uppercase tracking-widest text-xs">
                            <Filter size={18} />
                            Filter
                        </button>
                    </div>
                </div>

                <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-background border-b border-border">
                                <th className="px-6 py-5 text-[10px] font-black uppercase text-secondary-text tracking-widest">Order ID</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase text-secondary-text tracking-widest">Customer</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase text-secondary-text tracking-widest">Items</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase text-secondary-text tracking-widest">Total</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase text-secondary-text tracking-widest">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase text-secondary-text tracking-widest">Date</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase text-secondary-text tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Clock className="animate-spin text-accent" size={32} />
                                            <p className="text-secondary-text font-bold">Loading Orders...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-20 text-center">
                                        <p className="text-secondary-text font-bold">No orders found.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-secondary/20 transition-colors group">
                                        <td className="px-6 py-5 font-black text-foreground text-sm tracking-tight capitalize"># {order.id.slice(-8)}</td>
                                        <td className="px-6 py-5">
                                            <p className="font-black text-foreground group-hover:text-accent transition-colors">{order.customerName}</p>
                                            <p className="text-[10px] text-secondary-text font-black uppercase tracking-widest">{order.customerPhone}</p>
                                        </td>
                                        <td className="px-6 py-5 text-foreground font-medium">{order.items?.length || 0} items</td>
                                        <td className="px-6 py-5 font-black text-foreground">₹{order.totalAmount.toLocaleString()}</td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColors[order.status] || 'text-secondary-text bg-secondary border-border'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-secondary-text text-sm font-medium">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-5 text-right">
                                            <button
                                                onClick={() => router.push(`/admin/orders/${order.id}`)}
                                                className="p-2.5 rounded-xl bg-background text-secondary-text hover:text-accent transition-all hover:bg-secondary border border-border hover:border-accent/40 shadow-sm"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}

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
    'PENDING': 'text-amber-500 bg-amber-500/10',
    'PROCESSING': 'text-blue-500 bg-blue-500/10',
    'SHIPPED': 'text-violet-500 bg-violet-500/10',
    'DELIVERED': 'text-emerald-500 bg-emerald-500/10',
    'CANCELLED': 'text-red-500 bg-red-500/10',
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
                <div className="flex flex-col sm:row justify-between items-center gap-4 bg-gray-900/50 p-6 rounded-3xl border border-gray-800">
                    <div className="relative w-full sm:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search by ID or customer name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-gray-950 border border-gray-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-gray-200"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 font-bold py-3 px-6 rounded-2xl border border-gray-700 transition-all">
                            <Filter size={18} />
                            Filter
                        </button>
                    </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-950/50 border-b border-gray-800">
                                <th className="px-6 py-5 text-xs font-bold uppercase text-gray-500">Order ID</th>
                                <th className="px-6 py-5 text-xs font-bold uppercase text-gray-500">Customer</th>
                                <th className="px-6 py-5 text-xs font-bold uppercase text-gray-500">Items</th>
                                <th className="px-6 py-5 text-xs font-bold uppercase text-gray-500">Total</th>
                                <th className="px-6 py-5 text-xs font-bold uppercase text-gray-500">Status</th>
                                <th className="px-6 py-5 text-xs font-bold uppercase text-gray-500">Date</th>
                                <th className="px-6 py-5 text-xs font-bold uppercase text-gray-500 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Clock className="animate-spin text-blue-500" size={32} />
                                            <p className="text-gray-500 font-bold">Loading Orders...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-20 text-center">
                                        <p className="text-gray-500 font-bold">No orders found.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-800/30 transition-colors group">
                                        <td className="px-6 py-5 font-bold text-blue-400">#ORD-{order.id}</td>
                                        <td className="px-6 py-5">
                                            <p className="font-bold text-white">{order.customerName}</p>
                                            <p className="text-xs text-gray-500">{order.customerPhone}</p>
                                        </td>
                                        <td className="px-6 py-5 text-white font-medium">{order.items?.length || 0} items</td>
                                        <td className="px-6 py-5 font-bold text-white">₹{order.totalAmount.toLocaleString()}</td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-transparent ${statusColors[order.status] || 'text-gray-400 bg-gray-400/10'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-gray-400 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-5 text-right">
                                            <button
                                                onClick={() => router.push(`/admin/orders/${order.id}`)}
                                                className="p-2.5 rounded-xl bg-gray-800 text-gray-400 hover:text-white transition-all hover:bg-blue-600/20 hover:text-blue-400 border border-transparent hover:border-blue-500/30"
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

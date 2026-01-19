import AdminLayout from '@/components/admin/AdminLayout';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import {
    ChevronLeft,
    Truck,
    CreditCard,
    User,
    Calendar,
    Package,
    CheckCircle,
    Clock,
    AlertCircle,
    Printer,
    Download,
    ShoppingBag
} from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const statusColors = {
    'PENDING': 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    'PROCESSING': 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    'SHIPPED': 'text-violet-500 bg-violet-500/10 border-violet-500/20',
    'DELIVERED': 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    'CANCELLED': 'text-red-500 bg-red-500/10 border-red-500/20',
};

export default function OrderDetails() {
    const { user } = useAuth();
    const router = useRouter();
    const { id } = router.query;
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const fetchOrder = useCallback(async () => {
        if (!id || !user) return; // Wait for user
        try {
            const res = await fetch(`/api/admin/orders/${id}?userId=${user.uid}&email=${encodeURIComponent(user.email)}`);
            const data = await res.json();
            if (res.ok) {
                setOrder(data);
            } else {
                alert(data.error);
                router.push('/admin/orders');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id, router, user]);

    useEffect(() => {
        if (user && id) fetchOrder();
    }, [fetchOrder, user, id]);

    const updateStatus = async (newStatus) => {
        setUpdating(true);
        try {
            const res = await fetch(`/api/admin/orders/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: newStatus,
                    userId: user?.uid,
                    email: user?.email
                })
            });
            if (res.ok) {
                fetchOrder();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <AdminLayout title="Loading Order...">
            <div className="flex h-[60vh] items-center justify-center">
                <Clock className="animate-spin text-blue-500 w-10 h-10" />
            </div>
        </AdminLayout>
    );

    if (!order) return null;

    return (
        <AdminLayout title={`Order Details #ORD-${order.id}`}>
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <button
                        onClick={() => router.push('/admin/orders')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Back to Orders
                    </button>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2.5 rounded-xl border border-gray-700 transition-all text-sm font-medium">
                            <Printer className="w-4 h-4" /> Print Invoice
                        </button>
                        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2.5 rounded-xl transition-all text-sm font-bold text-white shadow-lg shadow-blue-500/20">
                            <Download className="w-4 h-4" /> Export JSON
                        </button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Order Items */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Status Card */}
                        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-xl">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className={`p-4 rounded-2xl border ${statusColors[order.status]}`}>
                                        <Package className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm font-medium">Current Status</p>
                                        <h3 className="text-2xl font-black text-white">{order.status}</h3>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(s => (
                                        <button
                                            key={s}
                                            onClick={() => updateStatus(s)}
                                            disabled={updating || order.status === s}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${order.status === s
                                                ? 'bg-blue-500 text-white cursor-default scale-105'
                                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 active:scale-95'
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-xl">
                            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-950/20">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5 text-blue-500" />
                                    Order Items
                                </h3>
                                <span className="bg-gray-800 text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/20">
                                    {order.items.length} Products
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-950/30">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">Product</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500 text-center">Price</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500 text-center">Qty</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {order.items.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-800/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-16 h-16 relative rounded-xl overflow-hidden bg-gray-800 border border-gray-700 flex-shrink-0">
                                                            <Image
                                                                src={item.product?.image || 'https://via.placeholder.com/100'}
                                                                alt={item.product?.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-white text-sm line-clamp-1">{item.product?.name || 'Deleted Product'}</p>
                                                            <p className="text-xs text-gray-500">{item.product?.category}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center text-gray-300 font-medium">₹{item.price.toLocaleString()}</td>
                                                <td className="px-6 py-4 text-center font-bold text-white">{item.quantity}</td>
                                                <td className="px-6 py-4 text-right font-black text-white">₹{(item.price * item.quantity).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-gray-950/30">
                                        <tr>
                                            <td colSpan="3" className="px-6 py-6 text-right font-bold text-gray-400 uppercase text-xs tracking-wider">Order Total</td>
                                            <td className="px-6 py-6 text-right text-2xl font-black text-white">₹{order.totalAmount.toLocaleString()}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Info Cards */}
                    <div className="space-y-6">
                        {/* Customer Info */}
                        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                <User className="w-4 h-4" /> Customer Details
                            </h4>
                            <div className="flex items-center gap-4 p-3 bg-gray-950/40 rounded-2xl border border-gray-800">
                                <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center font-bold text-lg border border-blue-500/20 uppercase">
                                    {order.customerName.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-white">{order.customerName}</p>
                                    <p className="text-xs text-blue-400 font-medium cursor-pointer hover:underline">View Profile</p>
                                </div>
                            </div>
                            <div className="space-y-3 px-1">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">Email</span>
                                    <span className="text-white font-medium truncate ml-4">{order.customerEmail}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">Phone</span>
                                    <span className="text-white font-medium">{order.customerPhone}</span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                <Truck className="w-4 h-4" /> Shipping Address
                            </h4>
                            <div className="p-4 bg-gray-950/40 rounded-2xl border border-gray-800">
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    {order.shippingAddress || "123 Smart Street, Tech City,\nDigital Hub, 10001"}
                                </p>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                <CreditCard className="w-4 h-4" /> Payment Info
                            </h4>
                            <div className="flex justify-between items-center p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                                <span className="text-emerald-500 text-xs font-bold uppercase tracking-wider">Status</span>
                                <span className="flex items-center gap-1.5 text-emerald-500 font-bold text-sm">
                                    <CheckCircle size={14} /> {order.paymentStatus}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm px-1">
                                <span className="text-gray-400">Method</span>
                                <span className="text-white font-medium">Digital Card</span>
                            </div>
                        </div>

                        {/* Order Timeline */}
                        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> Order Date
                            </h4>
                            <div className="p-3 bg-gray-950/40 rounded-2xl border border-gray-800 flex items-center justify-between text-sm">
                                <span className="text-gray-400">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                                <span className="text-white font-bold">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

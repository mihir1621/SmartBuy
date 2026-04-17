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
    'PENDING': 'text-warning bg-warning/10 border-warning/20',
    'PROCESSING': 'text-accent bg-accent/10 border-accent/20',
    'SHIPPED': 'text-accent bg-accent/10 border-accent/20',
    'DELIVERED': 'text-success bg-success/10 border-success/20',
    'CANCELLED': 'text-error bg-error/10 border-error/20',
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
        <AdminLayout title="Syncing Details...">
            <div className="flex h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
                    <p className="text-secondary-text font-black uppercase tracking-widest text-[10px]">Retrieving Order Ledger</p>
                </div>
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
                        className="flex items-center gap-2 text-secondary-text hover:text-accent font-black transition-all group uppercase tracking-widest text-[10px]"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Return to Registry
                    </button>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 bg-background hover:bg-secondary px-4 py-2.5 rounded-xl border border-border transition-all text-[10px] font-black uppercase tracking-widest text-foreground">
                            <Printer className="w-4 h-4" /> Hardcopy
                        </button>
                        <button className="flex items-center gap-2 bg-accent hover:bg-accent-hover px-4 py-2.5 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest text-white shadow-saas">
                            <Download className="w-4 h-4" /> Export Assets
                        </button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Order Items */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Status Card */}
                        <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm overflow-hidden relative">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className={`p-4 rounded-2xl border ${statusColors[order.status]}`}>
                                        <Package className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-secondary-text font-black uppercase tracking-widest">Order Life-cycle</p>
                                        <h3 className="text-2xl font-black text-foreground tracking-tight">{order.status}</h3>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(s => (
                                        <button
                                            key={s}
                                            onClick={() => updateStatus(s)}
                                            disabled={updating || order.status === s}
                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${order.status === s
                                                ? 'bg-accent text-white cursor-default scale-105 shadow-saas'
                                                : 'bg-background text-secondary-text border border-border hover:bg-secondary hover:text-foreground active:scale-95'
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[80px] rounded-full" />
                        </div>

                        {/* Items Table */}
                        <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-border flex justify-between items-center bg-background/50">
                                <h3 className="text-lg font-black text-foreground flex items-center gap-2 tracking-tight">
                                    <ShoppingBag className="w-5 h-5 text-accent" />
                                    Line Items
                                </h3>
                                <span className="bg-secondary text-foreground text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-border">
                                    {order.items.length} SKUs
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-background/50">
                                        <tr>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary-text">Product</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary-text text-center">Price</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary-text text-center">Qty</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary-text text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {order.items.map((item) => (
                                            <tr key={item.id} className="hover:bg-secondary/10 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-16 h-16 relative rounded-2xl overflow-hidden bg-background border border-border flex-shrink-0 shadow-sm">
                                                            <Image
                                                                src={item.product?.image || 'https://via.placeholder.com/100'}
                                                                alt={item.product?.name}
                                                                fill
                                                                className="object-cover group-hover:scale-110 transition-transform"
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-foreground text-sm line-clamp-1 tracking-tight">{item.product?.name || 'Deleted Product'}</p>
                                                            <p className="text-[10px] text-secondary-text font-black uppercase tracking-widest">{item.product?.category}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center text-secondary-text font-medium">₹{item.price.toLocaleString()}</td>
                                                <td className="px-6 py-4 text-center font-black text-foreground">{item.quantity}</td>
                                                <td className="px-6 py-4 text-right font-black text-foreground">₹{(item.price * item.quantity).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-background/80">
                                        <tr>
                                            <td colSpan="3" className="px-6 py-8 text-right font-black text-secondary-text uppercase text-[10px] tracking-widest">Aggregate Total</td>
                                            <td className="px-6 py-8 text-right text-3xl font-black text-accent tracking-tighter">₹{order.totalAmount.toLocaleString()}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Info Cards */}
                    <div className="space-y-6">
                        {/* Customer Info */}
                        <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary-text flex items-center gap-2">
                                <User className="w-4 h-4 text-accent" /> Identity Matrix
                            </h4>
                            <div className="flex items-center gap-4 p-4 bg-background rounded-2xl border border-border shadow-inner">
                                <div className="w-12 h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center font-black text-lg border border-accent/20 uppercase">
                                    {order.customerName.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-black text-foreground group-hover:text-accent transition-colors">{order.customerName}</p>
                                    <p className="text-[10px] text-accent font-black uppercase tracking-widest cursor-pointer hover:underline mt-0.5">View Record</p>
                                </div>
                            </div>
                            <div className="space-y-3 px-1">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-secondary-text font-medium italic">Endpoint</span>
                                    <span className="text-foreground font-black truncate ml-4">{order.customerEmail}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-secondary-text font-medium italic">Terminal</span>
                                    <span className="text-foreground font-black tracking-widest">{order.customerPhone}</span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary-text flex items-center gap-2">
                                <Truck className="w-4 h-4 text-accent" /> Destination Node
                            </h4>
                            <div className="p-4 bg-background rounded-2xl border border-border shadow-inner">
                                <p className="text-foreground text-sm leading-relaxed font-medium italic">
                                    {order.shippingAddress || "123 Smart Street, Tech City,\nDigital Hub, 10001"}
                                </p>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary-text flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-accent" /> Payment Info
                            </h4>
                            <div className="flex justify-between items-center p-4 bg-background border border-border rounded-2xl shadow-inner">
                                <span className="text-secondary-text text-[10px] font-black uppercase tracking-widest">Status</span>
                                <span className="flex items-center gap-1.5 text-success font-black text-xs uppercase tracking-widest">
                                    <CheckCircle size={14} /> {order.paymentStatus}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs px-1">
                                <span className="text-secondary-text font-medium italic">Method</span>
                                <span className="text-foreground font-black">Digital Card</span>
                            </div>
                        </div>

                        {/* Order Timeline */}
                        <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary-text flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-accent" /> Temporal Log
                            </h4>
                            <div className="p-4 bg-background rounded-2xl border border-border shadow-inner flex items-center justify-between text-[11px] font-black uppercase tracking-[0.1em]">
                                <span className="text-secondary-text">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                                <span className="text-foreground bg-secondary px-2 py-1 rounded-lg">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

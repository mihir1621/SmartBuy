import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Search, Filter, ShoppingBag, ChevronRight, Clock, Package, CheckCircle, XCircle } from 'lucide-react';
import SellerLayout from '@/components/seller/SellerLayout';

export default function SellerOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data or fetch from API
        // In a real app, fetch('/api/seller/orders')
        setTimeout(() => {
            const mockOrders = [
                { id: '1023', customer: 'Deepak Kumar', items: 2, total: 2499, status: 'PENDING', date: '2 mins ago' },
                { id: '1022', customer: 'Amit Shah', items: 1, total: 12999, status: 'SHIPPED', date: '1 hour ago' },
                { id: '1021', customer: 'Priya Singh', items: 3, total: 4500, status: 'DELIVERED', date: 'Yesterday' },
            ];
            setOrders(mockOrders);
            setLoading(false);
        }, 1000);
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'text-warning bg-warning/10 border-warning/20';
            case 'SHIPPED': return 'text-accent bg-accent/10 border-accent/20';
            case 'DELIVERED': return 'text-success bg-success/10 border-success/20';
            case 'CANCELLED': return 'text-error bg-error/10 border-error/20';
            default: return 'text-secondary-text bg-secondary/50 border-border';
        }
    };

    return (
        <SellerLayout title="Orders Management">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-4 top-3.5 text-secondary-text w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search order ID..."
                        className="w-full bg-surface border border-border rounded-2xl pl-12 pr-4 py-3 text-foreground focus:border-accent outline-none font-medium shadow-sm transition-all"
                    />
                </div>
                <button className="px-6 py-3 bg-surface border border-border rounded-2xl text-secondary-text hover:text-foreground font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-sm transition-all">
                    <Filter size={18} />
                    Status
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin w-10 h-10 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-secondary-text font-black text-xs uppercase tracking-widest">Loading orders...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-24 bg-surface rounded-3xl border-2 border-border border-dashed shadow-sm">
                    <ShoppingBag className="mx-auto h-16 w-16 text-secondary/30 mb-4" />
                    <h3 className="text-xl font-black text-foreground mb-2 tracking-tight">No Orders Yet</h3>
                    <p className="text-secondary-text font-medium italic">&quot;Waiting for your first sale to make it here.&quot;</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-surface border border-border rounded-2xl p-5 hover:border-accent/40 hover:shadow-saas transition-all cursor-pointer group">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center text-accent font-black border border-border text-xs uppercase tracking-widest transition-transform group-hover:scale-110">
                                        ID
                                    </div>
                                    <div>
                                        <h3 className="text-foreground font-black text-lg tracking-tight group-hover:text-accent transition-colors">Order #{order.id}</h3>
                                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-secondary-text">
                                            <span>{order.customer}</span>
                                            <span className="w-1 h-1 bg-border rounded-full"></span>
                                            <span>{order.items} Items</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-foreground font-black text-xl tracking-tight">₹{order.total.toLocaleString()}</p>
                                        <p className="text-secondary-text text-[10px] font-black uppercase tracking-widest">{order.date}</p>
                                    </div>
                                    <div className={`px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-[0.15em] shadow-sm ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </div>
                                    <ChevronRight className="text-secondary-text group-hover:text-accent group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </SellerLayout>
    );
}

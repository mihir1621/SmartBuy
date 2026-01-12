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
            case 'PENDING': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'SHIPPED': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'DELIVERED': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'CANCELLED': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
        }
    };

    return (
        <SellerLayout title="Orders Management">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-4 top-3.5 text-gray-500 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Customer..."
                        className="w-full bg-gray-900 border border-gray-800 rounded-2xl pl-12 pr-4 py-3 text-white focus:border-blue-500 outline-none"
                    />
                </div>
                <button className="px-4 py-3 bg-gray-900 border border-gray-800 rounded-2xl text-gray-400 hover:text-white flex items-center gap-2">
                    <Filter size={18} />
                    Filter Status
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading orders...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-20 bg-gray-900 rounded-3xl border border-gray-800">
                    <ShoppingBag className="mx-auto h-12 w-12 text-gray-600 mb-4" />
                    <h3 className="text-lg font-bold text-white">No Orders Yet</h3>
                    <p className="text-gray-500">Your products haven&apos;t generated any sales yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors cursor-pointer group">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center text-gray-400 font-bold border border-gray-700">
                                        #{order.id.slice(-2)}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-lg">Order #{order.id}</h3>
                                        <div className="flex items-center gap-3 text-sm text-gray-400">
                                            <span>{order.customer}</span>
                                            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                            <span>{order.items} Items</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-white font-bold text-lg">₹{order.total.toLocaleString()}</p>
                                        <p className="text-gray-500 text-xs">{order.date}</p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-lg border text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </div>
                                    <ChevronRight className="text-gray-600 group-hover:text-white transition-colors" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </SellerLayout>
    );
}

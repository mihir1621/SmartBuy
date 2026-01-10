import SellerLayout from '@/components/seller/SellerLayout';
import { useState, useEffect } from 'react';
import { ShoppingBag, Clock, CheckCircle, Truck, XCircle, ChevronDown, Loader2 } from 'lucide-react';

export default function SellerOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            // Priority 1: Local Storage (for "store it locally" requirement)
            const localOrders = localStorage.getItem('seller_orders');
            if (localOrders) {
                setOrders(JSON.parse(localOrders));
            }

            // Always sync with backend
            const res = await fetch('/api/seller/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
                localStorage.setItem('seller_orders', JSON.stringify(data));
            }
        } catch (error) {
            console.error("Error fetching orders", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        // Optimistic update & LS Sync
        const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
        setOrders(updatedOrders);
        localStorage.setItem('seller_orders', JSON.stringify(updatedOrders));

        try {
            const res = await fetch(`/api/seller/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (!res.ok) {
                // If backend fails, we might want to alert or revert, 
                // but for now we keep local state as primary for the "local" feel
                // alert("Failed to update status on server");
            }
        } catch (error) {
            console.error("Error updating status on server");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'DELIVERED': return 'text-green-500 bg-green-500/10 border-green-500/20';
            case 'SHIPPED': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            case 'PROCESSING': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            case 'CANCELLED': return 'text-red-500 bg-red-500/10 border-red-500/20';
            default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
        }
    };

    return (
        <SellerLayout title="Orders">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-black text-white">Order Management</h1>
                    <div className="text-sm text-gray-400">
                        {orders.length} Total Orders
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-orange-500" size={40} />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20 bg-gray-900 rounded-3xl border border-gray-800">
                        <ShoppingBag className="mx-auto h-12 w-12 text-gray-600 mb-4" />
                        <h3 className="text-lg font-bold text-white">No Orders Yet</h3>
                        <p className="text-gray-500">Your products haven&apos;t generated any sales yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-colors">
                                <div className="p-6 border-b border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-lg font-bold text-white">Order #{order.id}</span>
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase border ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 font-mono">
                                            {new Date(order.createdAt).toLocaleDateString()} • {new Date(order.createdAt).toLocaleTimeString()}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-xs text-gray-400">Customer</p>
                                            <p className="text-sm font-bold text-white">{order.customerName || order.user?.name || "Guest"}</p>
                                        </div>

                                        <div className="relative group">
                                            <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
                                                Update Status
                                                <ChevronDown size={14} />
                                            </button>

                                            <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden hidden group-hover:block z-10 p-1">
                                                {['PROCESSING', 'SHIPPED', 'DELIVERED'].map((status) => (
                                                    <button
                                                        key={status}
                                                        onClick={() => updateStatus(order.id, status)}
                                                        className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded-lg text-sm text-gray-300 hover:text-white"
                                                    >
                                                        Mark as {status}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-gray-900/50">
                                    <div className="space-y-4">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-1 bg-gradient-to-b from-orange-500 to-red-500 rounded-full" />
                                                    <div>
                                                        <p className="text-sm font-bold text-white">{item.product.name}</p>
                                                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <div className="text-sm font-mono text-gray-300">
                                                    ₹{item.price.toLocaleString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </SellerLayout>
    );
}

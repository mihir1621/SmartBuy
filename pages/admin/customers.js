import AdminLayout from '@/components/admin/AdminLayout';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
    Users,
    Search,
    Mail,
    Phone,
    ShoppingBag,
    Calendar,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    User as UserIcon
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminCustomers() {
    const { user } = useAuth();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await fetch(`/api/admin/customers?userId=${user?.uid}&email=${encodeURIComponent(user?.email || '')}`);
                const data = await res.json();
                setCustomers(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchCustomers();
    }, [user]);

    const filteredCustomers = customers.filter(c =>
        (c.name?.toLowerCase().includes(search.toLowerCase()) || '') ||
        c.phone.includes(search) ||
        (c.email?.toLowerCase().includes(search.toLowerCase()) || '')
    );

    return (
        <AdminLayout title="Customer Management">
            <div className="space-y-6">
                <div className="flex flex-col sm:row justify-between items-center gap-4 bg-gray-900/50 p-6 rounded-3xl border border-gray-800">
                    <div className="relative w-full sm:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, email or phone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-gray-950 border border-gray-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-gray-200"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        Array(6).fill(0).map((_, i) => (
                            <div key={i} className="bg-gray-900 border border-gray-800 rounded-3xl p-6 animate-pulse">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-gray-800 rounded-2xl" />
                                    <div className="space-y-2">
                                        <div className="h-4 w-32 bg-gray-800 rounded" />
                                        <div className="h-3 w-20 bg-gray-800 rounded" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-3 w-full bg-gray-800 rounded" />
                                    <div className="h-3 w-4/5 bg-gray-800 rounded" />
                                </div>
                            </div>
                        ))
                    ) : filteredCustomers.length === 0 ? (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-gray-500 font-bold">No customers found.</p>
                        </div>
                    ) : (
                        filteredCustomers.map((customer) => (
                            <motion.div
                                key={customer.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-gray-900 border border-gray-800 rounded-3xl p-6 hover:border-blue-500/30 transition-all group relative overflow-hidden"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl flex items-center justify-center text-gray-500 group-hover:text-blue-400 group-hover:border-blue-500/20 transition-all shadow-inner">
                                            <UserIcon size={32} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-white text-lg leading-tight">{customer.name || 'Anonymous User'}</h3>
                                                {customer.role === 'ADMIN' && (
                                                    <ShieldCheck size={16} className="text-blue-400" />
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">{customer.role}</p>
                                        </div>
                                    </div>
                                    <button className="p-2 text-gray-600 hover:text-white transition-colors">
                                        <MoreVertical size={20} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-sm text-gray-400">
                                        <Mail size={16} className="text-gray-600" />
                                        <span className="truncate">{customer.email || 'No email provided'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-400">
                                        <Phone size={16} className="text-gray-600" />
                                        <span>{customer.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-400">
                                        <Calendar size={16} className="text-gray-600" />
                                        <span>Joined: {new Date(customer.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-800 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <ShoppingBag size={16} className="text-emerald-500" />
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                                            {customer.orders?.length || 0} Total Orders
                                        </span>
                                    </div>
                                    <button className="text-[10px] font-bold text-blue-400 uppercase tracking-widest hover:underline">
                                        View Details
                                    </button>
                                </div>

                                {/* Decorative glow */}
                                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full" />
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

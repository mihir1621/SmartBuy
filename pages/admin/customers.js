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
                <div className="flex flex-col sm:row justify-between items-center gap-4 bg-surface p-6 rounded-3xl border border-border shadow-sm">
                    <div className="relative w-full sm:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-text group-focus-within:text-accent transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Find customers..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-background border border-border rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all text-foreground font-medium"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        Array(6).fill(0).map((_, i) => (
                            <div key={i} className="bg-surface border border-border rounded-3xl p-6 animate-pulse">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-background rounded-2xl" />
                                    <div className="space-y-2">
                                        <div className="h-4 w-32 bg-background rounded" />
                                        <div className="h-3 w-20 bg-background rounded" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-3 w-full bg-background rounded" />
                                    <div className="h-3 w-4/5 bg-background rounded" />
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
                                className="bg-surface border border-border rounded-3xl p-6 hover:border-accent/30 transition-all group relative overflow-hidden shadow-sm"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-background border border-border rounded-2xl flex items-center justify-center text-secondary-text group-hover:text-accent group-hover:border-accent/20 transition-all shadow-sm">
                                            <UserIcon size={32} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-black text-foreground text-lg leading-tight tracking-tight truncate group-hover:text-accent transition-colors">{customer.name || 'Anonymous User'}</h3>
                                                {customer.role === 'ADMIN' && (
                                                    <ShieldCheck size={16} className="text-accent" />
                                                )}
                                            </div>
                                            <p className="text-[10px] text-secondary-text font-black uppercase tracking-widest mt-1">{customer.role}</p>
                                        </div>
                                    </div>
                                    <button className="p-2 text-secondary-text hover:text-foreground transition-colors">
                                        <MoreVertical size={20} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-sm text-secondary-text font-medium">
                                        <Mail size={16} className="text-accent/40" />
                                        <span className="truncate">{customer.email || 'No email provided'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-secondary-text font-medium">
                                        <Phone size={16} className="text-accent/40" />
                                        <span>{customer.phone || 'No phone'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-secondary-text font-medium">
                                        <Calendar size={16} className="text-accent/40" />
                                        <span>Joined: {new Date(customer.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <ShoppingBag size={16} className="text-accent" />
                                        <span className="text-[10px] font-black text-secondary-text uppercase tracking-widest">
                                            {customer.orders?.length || 0} Total Orders
                                        </span>
                                    </div>
                                    <button className="text-[10px] font-black text-accent uppercase tracking-widest hover:text-accent-hover transition-colors">
                                        View Details
                                    </button>
                                </div>

                                {/* Decorative glow */}
                                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/5 blur-3xl rounded-full" />
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

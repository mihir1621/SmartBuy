import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import {
    Database,
    RefreshCcw,
    CheckCircle2,
    AlertCircle,
    Zap,
    TriangleAlert,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminSettings() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const generateDemoData = async () => {
        if (!confirm('This will create 15 mock orders in your database for testing. Proceed?')) return;

        setLoading(true);
        setResult(null);
        try {
            const res = await fetch('/api/admin/generate-demo-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user?.uid,
                    email: user?.email
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setResult({ type: 'success', message: data.message });
            } else {
                setResult({ type: 'error', message: data.error });
            }
        } catch (err) {
            setResult({ type: 'error', message: 'Failed to connect to API' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout title="System Settings">
            <div className="max-w-4xl space-y-8">
                {/* Demo Data Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-surface border border-border rounded-3xl p-8 shadow-sm overflow-hidden relative group"
                >
                    <div className="flex items-start justify-between relative z-10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-accent/10 text-accent rounded-2xl border border-accent/20">
                                    <Database size={24} />
                                </div>
                                <h3 className="text-xl font-black text-foreground tracking-tight">Development Suite</h3>
                            </div>

                            <p className="text-secondary-text font-medium leading-relaxed max-w-lg">
                                Population tools for testing environments. Use the &quot;Mock Data Engine&quot; to instantly generate
                                realistic orders, products and customers for UI validation.
                            </p>

                            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <button
                                    onClick={generateDemoData}
                                    disabled={loading}
                                    className="flex items-center gap-2 bg-accent hover:bg-accent-hover disabled:bg-secondary text-white font-black py-4 px-8 rounded-2xl shadow-saas transition-all active:scale-95 min-w-[200px] justify-center text-xs uppercase tracking-widest"
                                >
                                    {loading ? <Loader2 size={20} className="animate-spin" /> : <Zap size={20} />}
                                    {loading ? 'Populating...' : 'Generate Demo Data'}
                                </button>

                                <div className="flex items-center gap-2 text-warning bg-warning/10 px-4 py-2 rounded-xl border border-warning/20 text-xs font-black uppercase tracking-widest">
                                    <TriangleAlert size={14} />
                                    Dev Only
                                </div>
                            </div>

                            {result && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`mt-6 p-4 rounded-2xl border flex items-center gap-3 font-black text-sm tracking-tight ${result.type === 'success'
                                        ? 'bg-success/5 border-success/20 text-success'
                                        : 'bg-error/5 border-error/20 text-error'
                                        }`}
                                >
                                    {result.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                    {result.message}
                                </motion.div>
                            )}
                        </div>

                        <div className="hidden lg:block relative">
                            <Database size={160} className="text-accent absolute -right-10 -top-10 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                        </div>
                    </div>

                    {/* Decorative Glow */}
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent/5 blur-[100px] rounded-full" />
                </motion.div>

                {/* Placeholder for other settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-40">
                    <div className="bg-surface border border-border rounded-3xl p-8 border-dashed">
                        <h4 className="text-foreground font-black mb-2 tracking-tight uppercase text-xs">Store Styling</h4>
                        <div className="h-1.5 w-16 bg-secondary rounded-full mb-4" />
                        <div className="space-y-3">
                            <div className="h-10 w-full bg-background/50 rounded-xl" />
                            <div className="h-10 w-full bg-background/50 rounded-xl" />
                        </div>
                    </div>
                    <div className="bg-surface border border-border rounded-3xl p-8 border-dashed">
                        <h4 className="text-foreground font-black mb-2 tracking-tight uppercase text-xs">Checkout Policy</h4>
                        <div className="h-1.5 w-16 bg-secondary rounded-full mb-4" />
                        <div className="space-y-3">
                            <div className="h-10 w-full bg-background/50 rounded-xl" />
                            <div className="h-10 w-full bg-background/50 rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

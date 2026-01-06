import AdminLayout from '@/components/admin/AdminLayout';
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
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const generateDemoData = async () => {
        if (!confirm('This will create 15 mock orders in your database for testing. Proceed?')) return;

        setLoading(true);
        setResult(null);
        try {
            const res = await fetch('/api/admin/generate-demo-data', { method: 'POST' });
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
                    className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-sm overflow-hidden relative group"
                >
                    <div className="flex items-start justify-between relative z-10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-600/10 text-blue-500 rounded-2xl border border-blue-500/20">
                                    <Database size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white">Development Tools</h3>
                            </div>

                            <p className="text-gray-400 font-medium leading-relaxed max-w-lg">
                                Need to test your dashboard with real data? Use the "Demo Data Generator" to instantly populate your
                                database with mock orders and customers.
                            </p>

                            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <button
                                    onClick={generateDemoData}
                                    disabled={loading}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 min-w-[200px] justify-center"
                                >
                                    {loading ? <Loader2 size={20} className="animate-spin" /> : <Zap size={20} />}
                                    {loading ? 'Generating...' : 'Generate Demo Data'}
                                </button>

                                <div className="flex items-center gap-2 text-amber-500 bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20 text-xs font-bold uppercase tracking-wider">
                                    <TriangleAlert size={14} />
                                    Safe for development only
                                </div>
                            </div>

                            {result && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`mt-6 p-4 rounded-2xl border flex items-center gap-3 font-bold text-sm ${result.type === 'success'
                                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                            : 'bg-red-500/10 border-red-500/20 text-red-400'
                                        }`}
                                >
                                    {result.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                    {result.message}
                                </motion.div>
                            )}
                        </div>

                        <div className="hidden lg:block relative">
                            <Database size={160} className="text-gray-800 absolute -right-10 -top-10 opacity-20 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                        </div>
                    </div>

                    {/* Decorative Glow */}
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full" />
                </motion.div>

                {/* Placeholder for other settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-50 grayscale">
                    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
                        <h4 className="text-white font-bold mb-2">Store Branding</h4>
                        <div className="h-2 w-24 bg-gray-800 rounded-full mb-4" />
                        <div className="space-y-3">
                            <div className="h-10 w-full bg-gray-800/50 rounded-xl" />
                            <div className="h-10 w-full bg-gray-800/50 rounded-xl" />
                        </div>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
                        <h4 className="text-white font-bold mb-2">Payment Gateway</h4>
                        <div className="h-2 w-24 bg-gray-800 rounded-full mb-4" />
                        <div className="space-y-3">
                            <div className="h-10 w-full bg-gray-800/50 rounded-xl" />
                            <div className="h-10 w-full bg-gray-800/50 rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

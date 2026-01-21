
import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import StoreNavbar from '@/components/StoreNavbar';
import Footer from '@/components/Footer';
import {
    MessageSquare,
    Package,
    RefreshCcw,
    CreditCard,
    AlertTriangle,
    User,
    HelpCircle,
    ChevronRight,
    CheckCircle,
    Clock,
    FileText,
    Paperclip,
    ArrowLeft
} from 'lucide-react';

const CATEGORIES = [
    { id: 'orders', label: 'Orders & Delivery', icon: Package, description: 'Track, cancel, or modify an order' },
    { id: 'returns', label: 'Returns & Replacements', icon: RefreshCcw, description: 'Return a product or request exchange' },
    { id: 'refunds', label: 'Refunds & Payments', icon: CreditCard, description: 'Refund status, payment failures' },
    { id: 'product', label: 'Product Issues', icon: AlertTriangle, description: 'Damaged, defective, or wrong item' },
    { id: 'account', label: 'Account & Login', icon: User, description: 'Profile, password, login issues' },
    { id: 'other', label: 'Other Support', icon: HelpCircle, description: 'General inquiries and feedback' },
];

export default function SupportPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('create'); // 'create' | 'history'
    const [step, setStep] = useState(1); // 1: Category, 2: Details, 3: Success
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        orderId: '',
    });
    const [createdTicket, setCreatedTicket] = useState(null);

    const fetchTickets = useCallback(async () => {
        try {
            const res = await fetch(`/api/support/tickets?userId=${user?.id || user?.uid || 0}`); // Fallback for demo
            if (res.ok) {
                const data = await res.json();
                // Sort by date desc
                setTickets(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            }
        } catch (error) {
            console.error('Failed to fetch tickets', error);
        }
    }, [user]);

    // Fetch tickets on mount if user exists
    useEffect(() => {
        if (user) {
            fetchTickets();
        }
    }, [user, fetchTickets]);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/support/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.id || user?.uid || 0, // Fallback
                    category: selectedCategory.label,
                    subject: formData.subject,
                    description: formData.description,
                    orderId: formData.orderId
                }),
            });

            if (res.ok) {
                const ticket = await res.json();
                setCreatedTicket(ticket);
                setStep(3);
                fetchTickets(); // Refresh list
            } else {
                alert('Failed to create ticket. Please try again.');
            }
        } catch (error) {
            console.error('Error creating ticket:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setStep(1);
        setSelectedCategory(null);
        setFormData({ subject: '', description: '', orderId: '' });
        setCreatedTicket(null);
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'open': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'in progress': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            case 'resolved': return 'bg-green-500/10 text-green-400 border-green-500/20';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    return (
        <div className="min-h-screen bg-black text-gray-100 flex flex-col">
            <Head>
                <title>Help Desk | SmartBuy</title>
            </Head>

            <StoreNavbar />

            <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
                <div className="flex flex-col md:flex-row gap-8 items-start">

                    {/* Sidebar / Navigation */}
                    <div className="w-full md:w-64 flex-shrink-0 space-y-2">
                        <h1 className="text-2xl font-bold mb-6 text-white">Help Center</h1>

                        <button
                            onClick={() => setActiveTab('create')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'create' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'bg-gray-900 text-gray-400 hover:bg-gray-800'}`}
                        >
                            <MessageSquare size={18} />
                            <span className="font-medium">Raise a Ticket</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('history')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'history' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'bg-gray-900 text-gray-400 hover:bg-gray-800'}`}
                        >
                            <FileText size={18} />
                            <span className="font-medium">My Tickets</span>
                            {tickets.length > 0 && (
                                <span className="ml-auto bg-gray-800 text-xs py-0.5 px-2 rounded-full text-gray-300">
                                    {tickets.length}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 w-full bg-gray-900/50 border border-gray-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm">

                        {/* CREATE TICKET FLOW */}
                        {activeTab === 'create' && (
                            <AnimatePresence mode="wait">

                                {/* STEP 1: CATEGORY SELECTION */}
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-6"
                                    >
                                        <div className="mb-6">
                                            <h2 className="text-xl font-bold text-white mb-2">What can we help you with?</h2>
                                            <p className="text-gray-400 text-sm">Select a category to get started.</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {CATEGORIES.map((cat) => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => handleCategorySelect(cat)}
                                                    className="flex items-start gap-4 p-4 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-blue-500/50 hover:bg-gray-800 transition-all text-left group"
                                                >
                                                    <div className="p-2.5 bg-gray-700/50 rounded-lg group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                                                        <cat.icon size={20} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-200 group-hover:text-white">{cat.label}</h3>
                                                        <p className="text-xs text-gray-500 mt-1">{cat.description}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 2: DETAILS FORM */}
                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <button
                                            onClick={() => setStep(1)}
                                            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4"
                                        >
                                            <ArrowLeft size={16} /> Back to Categories
                                        </button>

                                        <div className="flex items-center gap-3 mb-6 p-4 bg-blue-900/20 border border-blue-900/50 rounded-xl">
                                            <selectedCategory.icon className="text-blue-400" size={24} />
                                            <div>
                                                <span className="text-xs text-blue-300 uppercase font-bold tracking-wider">Selected Category</span>
                                                <h2 className="text-lg font-bold text-white">{selectedCategory.label}</h2>
                                            </div>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-5">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Issue Subject</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.subject}
                                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                    placeholder="Brief summary of the issue"
                                                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                />
                                            </div>

                                            {(selectedCategory.id === 'orders' || selectedCategory.id === 'returns' || selectedCategory.id === 'refunds') && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Order ID (Optional)</label>
                                                    <input
                                                        type="text"
                                                        value={formData.orderId}
                                                        onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                                                        placeholder="e.g., ORD-123456"
                                                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                    />
                                                </div>
                                            )}

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
                                                <textarea
                                                    required
                                                    rows={5}
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    placeholder="Please describe your issue in detail..."
                                                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                                                />
                                            </div>

                                            <div className="pt-2">
                                                <button
                                                    type="submit"
                                                    disabled={isLoading}
                                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                            Submitting...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Submit Ticket <ChevronRight size={18} />
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </motion.div>
                                )}

                                {/* STEP 3: SUCCESS */}
                                {step === 3 && createdTicket && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center text-center py-8"
                                    >
                                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                                            <CheckCircle className="text-green-500 w-10 h-10" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-white mb-2">Ticket Created Successfully!</h2>
                                        <p className="text-gray-400 max-w-md mb-8">
                                            Your ticket has been raised. Our support team will review it and get back to you shortly.
                                        </p>

                                        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 w-full max-w-md mb-8 text-left">
                                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-700">
                                                <span className="text-gray-400 text-sm">Ticket ID</span>
                                                <span className="font-mono font-bold text-blue-400">{createdTicket.id}</span>
                                            </div>
                                            <div className="space-y-3">
                                                <div>
                                                    <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Subject</span>
                                                    <p className="text-gray-200 font-medium">{createdTicket.subject}</p>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Category</span>
                                                    <p className="text-gray-200">{createdTicket.category}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => setActiveTab('history')}
                                                className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium border border-gray-700"
                                            >
                                                View My Tickets
                                            </button>
                                            <button
                                                onClick={resetForm}
                                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium shadow-lg shadow-blue-900/20"
                                            >
                                                Raise Another
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                            </AnimatePresence>
                        )}

                        {/* TICKET HISTORY */}
                        {activeTab === 'history' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-6"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-white">My Support Tickets</h2>
                                    <button onClick={fetchTickets} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
                                        <RefreshCcw size={18} />
                                    </button>
                                </div>

                                {tickets.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-800/30 rounded-2xl border border-gray-800 border-dashed">
                                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FileText className="text-gray-500 w-8 h-8" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-300 mb-2">No tickets found</h3>
                                        <p className="text-gray-500 text-sm mb-6">You haven&apos;t raised any support tickets yet.</p>
                                        <button
                                            onClick={() => setActiveTab('create')}
                                            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-sm font-medium"
                                        >
                                            Raise a Ticket
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {tickets.map((ticket) => (
                                            <div key={ticket.id} className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-5 hover:border-gray-600 transition-all">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(ticket.status)}`}>
                                                            {ticket.status}
                                                        </span>
                                                        <span className="text-xs text-gray-500 font-mono">{ticket.id}</span>
                                                    </div>
                                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {new Date(ticket.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                <h3 className="font-bold text-white mb-1">{ticket.subject}</h3>
                                                <p className="text-sm text-gray-400 line-clamp-2 mb-3">{ticket.description}</p>

                                                <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-700/50">
                                                    <span className="flex items-center gap-1.5">
                                                        <Package size={12} />
                                                        {ticket.category}
                                                    </span>
                                                    {ticket.orderId && (
                                                        <span className="flex items-center gap-1.5">
                                                            <Paperclip size={12} />
                                                            Order: {ticket.orderId}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

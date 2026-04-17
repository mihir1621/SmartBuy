
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
            case 'open': return 'bg-accent/10 text-accent border-accent/20';
            case 'in progress': return 'bg-warning/10 text-warning border-warning/20';
            case 'resolved': return 'bg-success/10 text-success border-success/20';
            default: return 'bg-secondary text-secondary-text border-border';
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-accent/10">
            <Head>
                <title>Help Desk | SmartBuy</title>
            </Head>

            <StoreNavbar />

            <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
                <div className="flex flex-col md:flex-row gap-8 items-start">

                    {/* Sidebar / Navigation */}
                    <div className="w-full md:w-64 flex-shrink-0 space-y-2">
                        <h1 className="text-2xl font-black mb-6 text-foreground tracking-tight">Help Center</h1>

                        <button
                            onClick={() => setActiveTab('create')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-black text-sm uppercase tracking-widest ${activeTab === 'create' ? 'bg-accent text-white shadow-saas' : 'bg-surface text-secondary-text hover:bg-secondary border border-border/50'}`}
                        >
                            <MessageSquare size={18} />
                            <span>Raise a Ticket</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('history')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-black text-sm uppercase tracking-widest ${activeTab === 'history' ? 'bg-accent text-white shadow-saas' : 'bg-surface text-secondary-text hover:bg-secondary border border-border/50'}`}
                        >
                            <FileText size={18} />
                            <span>My Tickets</span>
                            {tickets.length > 0 && (
                                <span className={`ml-auto text-[10px] py-0.5 px-2 rounded-full font-black ${activeTab === 'history' ? 'bg-white/20 text-white' : 'bg-secondary text-secondary-text'}`}>
                                    {tickets.length}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 w-full bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-saas relative">

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
                                            <h2 className="text-xl font-black text-foreground mb-2">What can we help you with?</h2>
                                            <p className="text-secondary-text text-sm font-medium">Select a category to get started.</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {CATEGORIES.map((cat) => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => handleCategorySelect(cat)}
                                                    className="flex items-start gap-4 p-4 rounded-xl bg-background border border-border hover:border-accent hover:bg-accent/5 transition-all text-left group"
                                                >
                                                    <div className="p-2.5 bg-secondary text-secondary-text rounded-lg group-hover:bg-accent group-hover:text-white transition-all">
                                                        <cat.icon size={20} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-foreground group-hover:text-accent transition-colors">{cat.label}</h3>
                                                        <p className="text-xs text-secondary-text mt-1 font-medium">{cat.description}</p>
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
                                            className="flex items-center gap-2 text-sm text-secondary-text font-black uppercase tracking-widest hover:text-foreground transition-colors mb-4"
                                        >
                                            <ArrowLeft size={16} /> Back
                                        </button>

                                        <div className="flex items-center gap-3 mb-6 p-4 bg-accent/5 border border-accent/10 rounded-xl">
                                            <selectedCategory.icon className="text-accent" size={24} />
                                            <div>
                                                <span className="text-[10px] text-accent font-black uppercase tracking-wider block">Selected Category</span>
                                                <h2 className="text-lg font-black text-foreground">{selectedCategory.label}</h2>
                                            </div>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-5">
                                            <div>
                                                <label className="block text-[10px] font-black text-secondary-text uppercase tracking-widest mb-1.5">Issue Subject</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.subject}
                                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                    placeholder="Brief summary of the issue"
                                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all placeholder:text-secondary-text/50 font-medium"
                                                />
                                            </div>

                                            {(selectedCategory.id === 'orders' || selectedCategory.id === 'returns' || selectedCategory.id === 'refunds') && (
                                                <div>
                                                    <label className="block text-[10px] font-black text-secondary-text uppercase tracking-widest mb-1.5">Order ID (Optional)</label>
                                                    <input
                                                        type="text"
                                                        value={formData.orderId}
                                                        onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                                                        placeholder="e.g., ORD-123456"
                                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all placeholder:text-secondary-text/50 font-medium"
                                                    />
                                                </div>
                                            )}

                                            <div>
                                                <label className="block text-[10px] font-black text-secondary-text uppercase tracking-widest mb-1.5">Description</label>
                                                <textarea
                                                    required
                                                    rows={5}
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    placeholder="Please describe your issue in detail..."
                                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all resize-none placeholder:text-secondary-text/50 font-medium"
                                                />
                                            </div>

                                            <div className="pt-2">
                                                <button
                                                    type="submit"
                                                    disabled={isLoading}
                                                    className="w-full bg-accent hover:bg-accent-hover text-white font-black py-4 rounded-xl transition-all shadow-saas flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-xs"
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
                                        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-6">
                                            <CheckCircle className="text-success w-10 h-10" />
                                        </div>
                                        <h2 className="text-2xl font-black text-foreground mb-2 tracking-tight">Ticket Created!</h2>
                                        <p className="text-secondary-text max-w-md mb-8 font-medium">
                                            Your ticket has been raised. Our support team will review it and get back to you shortly.
                                        </p>

                                        <div className="bg-background border border-border rounded-xl p-6 w-full max-w-md mb-8 text-left">
                                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-border">
                                                <span className="text-secondary-text font-black uppercase text-[10px] tracking-widest">Ticket ID</span>
                                                <span className="font-mono font-black text-foreground">#{createdTicket.id}</span>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <span className="text-[10px] text-secondary-text uppercase tracking-widest block mb-1 font-black">Subject</span>
                                                    <p className="text-foreground font-bold">{createdTicket.subject}</p>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] text-secondary-text uppercase tracking-widest block mb-1 font-black">Category</span>
                                                    <p className="text-foreground font-medium">{createdTicket.category}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => setActiveTab('history')}
                                                className="px-6 py-3 bg-secondary hover:bg-secondary/70 text-foreground rounded-xl transition-all font-black uppercase tracking-widest text-[10px] border border-border"
                                            >
                                                View Tickets
                                            </button>
                                            <button
                                                onClick={resetForm}
                                                className="px-6 py-3 bg-accent hover:bg-accent-hover text-white rounded-xl transition-all font-black uppercase tracking-widest text-[10px] shadow-saas"
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
                                    <h2 className="text-xl font-black text-foreground tracking-tight">My Support Tickets</h2>
                                    <button onClick={fetchTickets} className="p-2 hover:bg-secondary rounded-lg text-secondary-text hover:text-foreground transition-all">
                                        <RefreshCcw size={18} />
                                    </button>
                                </div>

                                {tickets.length === 0 ? (
                                    <div className="text-center py-16 bg-background rounded-2xl border-2 border-secondary border-dashed">
                                        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FileText className="text-secondary-text w-8 h-8" />
                                        </div>
                                        <h3 className="text-lg font-black text-foreground mb-2">No tickets found</h3>
                                        <p className="text-secondary-text text-sm mb-6 font-medium">You haven&apos;t raised any support tickets yet.</p>
                                        <button
                                            onClick={() => setActiveTab('create')}
                                            className="px-6 py-3 bg-accent hover:bg-accent-hover text-white rounded-xl transition-all text-xs font-black uppercase tracking-widest shadow-saas"
                                        >
                                            Raise a Ticket
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {tickets.map((ticket) => (
                                            <div key={ticket.id} className="bg-background border border-border rounded-xl p-5 hover:border-accent/30 hover:shadow-sm transition-all group">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(ticket.status)}`}>
                                                            {ticket.status}
                                                        </span>
                                                        <span className="text-[10px] text-secondary-text font-mono font-bold">#{ticket.id}</span>
                                                    </div>
                                                    <span className="text-[10px] text-secondary-text flex items-center gap-1 font-bold uppercase tracking-wider">
                                                        <Clock size={12} />
                                                        {new Date(ticket.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                <h3 className="font-black text-foreground mb-1 group-hover:text-accent transition-colors">{ticket.subject}</h3>
                                                <p className="text-sm text-secondary-text line-clamp-2 mb-4 font-medium opacity-80">{ticket.description}</p>

                                                <div className="flex items-center gap-4 text-[10px] text-secondary-text pt-4 border-t border-secondary font-black uppercase tracking-widest">
                                                    <span className="flex items-center gap-1.5 bg-secondary/50 px-2 py-1 rounded-md">
                                                        <Package size={12} className="text-accent" />
                                                        {ticket.category}
                                                    </span>
                                                    {ticket.orderId && (
                                                        <span className="flex items-center gap-1.5 bg-secondary/50 px-2 py-1 rounded-md">
                                                            <Paperclip size={12} className="text-accent" />
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

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import StoreNavbar from '@/components/StoreNavbar';
import Footer from '@/components/Footer';
import { MapPin, Plus, Trash2, Home, Briefcase, User, Phone, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Addresses() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [addresses, setAddresses] = useState([
        {
            id: 1,
            type: 'Home',
            name: 'John Doe',
            street: '123 Main St, Apt 4B',
            city: 'Mumbai',
            state: 'Maharashtra',
            zip: '400001',
            phone: '+91 98765 43210',
            isDefault: true
        }
    ]);
    const [isAdding, setIsAdding] = useState(false);
    const [newAddress, setNewAddress] = useState({
        type: 'Home',
        name: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        phone: ''
    });

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const handleAddAddress = (e) => {
        e.preventDefault();
        const address = {
            id: Date.now(),
            ...newAddress,
            isDefault: addresses.length === 0
        };
        setAddresses([...addresses, address]);
        setIsAdding(false);
        setNewAddress({
            type: 'Home',
            name: '',
            street: '',
            city: '',
            state: '',
            zip: '',
            phone: ''
        });
    };

    const handleRemoveAddress = (id) => {
        setAddresses(addresses.filter(addr => addr.id !== id));
    };

    const handleSetDefault = (id) => {
        setAddresses(addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === id
        })));
    };

    if (authLoading || !user) {
        return (
            <div className="min-h-screen bg-background flex flex-col font-sans">
                <StoreNavbar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col text-foreground font-sans">
            <Head>
                <title>My Addresses | SmartBuy</title>
            </Head>
            <StoreNavbar />

            <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-10 sm:mb-14">
                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="p-4 bg-surface rounded-[1.5rem] border border-border shadow-sm">
                            <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground uppercase">My Addresses</h1>
                            <p className="text-secondary-text mt-1 font-medium text-xs sm:text-sm uppercase tracking-widest">Manage your saved delivery locations</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className={`flex items-center gap-2 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-saas active:scale-95 ${isAdding ? 'bg-secondary text-foreground' : 'bg-accent text-white hover:bg-accent-hover'}`}
                    >
                        {isAdding ? <XCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {isAdding ? 'Cancel' : 'Add New Address'}
                    </button>
                </div>

                <AnimatePresence>
                    {isAdding && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-10"
                        >
                            <form onSubmit={handleAddAddress} className="bg-surface border border-border rounded-[2.5rem] p-8 sm:p-12 shadow-saas">
                                <h3 className="text-xl font-black mb-10 text-foreground uppercase tracking-tight">Add New Address</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-secondary-text uppercase tracking-[0.2em]">Full Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={newAddress.name}
                                            onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none transition-all"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-secondary-text uppercase tracking-[0.2em]">Phone Number</label>
                                        <input
                                            required
                                            type="tel"
                                            value={newAddress.phone}
                                            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none transition-all"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                    <div className="space-y-2 sm:col-span-2">
                                        <label className="text-[10px] font-black text-secondary-text uppercase tracking-[0.2em]">Address Details</label>
                                        <input
                                            required
                                            type="text"
                                            value={newAddress.street}
                                            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none transition-all"
                                            placeholder="Apt, Suite, Street name, Building info"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-secondary-text uppercase tracking-[0.2em]">City</label>
                                        <input
                                            required
                                            type="text"
                                            value={newAddress.city}
                                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none transition-all"
                                            placeholder="City"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-secondary-text uppercase tracking-[0.2em]">Address Type</label>
                                        <div className="flex gap-4">
                                            {['Home', 'Work'].map(type => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setNewAddress({ ...newAddress, type })}
                                                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${newAddress.type === type ? 'bg-accent text-white border-accent shadow-md' : 'bg-background border-border text-secondary-text hover:border-accent/30'}`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-12 flex justify-end gap-4">
                                    <button
                                        type="submit"
                                        className="bg-accent text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-accent-hover transition-all shadow-saas active:scale-95"
                                    >
                                        Save Address
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    {addresses.map((addr) => (
                        <motion.div
                            layout
                            key={addr.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`relative p-8 rounded-[2rem] border transition-all group ${addr.isDefault ? 'bg-surface border-accent/20 shadow-saas' : 'bg-surface border-border hover:border-accent/20'}`}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div className={`p-3 rounded-xl ${addr.isDefault ? 'bg-accent/10 text-accent' : 'bg-secondary text-secondary-text'}`}>
                                        {addr.type === 'Home' ? <Home className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <span className="font-black text-[10px] uppercase tracking-widest text-secondary-text block mb-0.5">{addr.type}</span>
                                        {addr.isDefault && (
                                            <span className="text-[9px] font-black uppercase tracking-widest bg-success text-white px-2 py-0.5 rounded-full">Default</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {!addr.isDefault && (
                                        <button
                                            onClick={() => handleSetDefault(addr.id)}
                                            className="p-2.5 text-secondary-text hover:text-accent hover:bg-accent/5 rounded-xl transition-colors border border-transparent hover:border-accent/10"
                                            title="Set as Default"
                                        >
                                            <Check className="w-4 h-4 font-bold" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleRemoveAddress(addr.id)}
                                        className="p-2.5 text-secondary-text hover:text-error hover:bg-error/5 rounded-xl transition-colors border border-transparent hover:border-error/10"
                                        title="Remove Address"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-foreground font-black tracking-tight text-lg">
                                    {addr.name}
                                </div>
                                <div className="flex items-start gap-3 text-secondary-text text-sm leading-relaxed">
                                    <MapPin className="w-4 h-4 text-accent/50 mt-1 flex-shrink-0" />
                                    <p className="font-medium">{addr.street}<br />{addr.city}, {addr.state} - {addr.zip}</p>
                                </div>
                                <div className="flex items-center gap-3 text-secondary-text text-sm h-10 px-4 bg-background rounded-xl border border-border/50 w-fit">
                                    <Phone className="w-3.5 h-3.5 text-accent/50" />
                                    <span className="font-bold">{addr.phone}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}

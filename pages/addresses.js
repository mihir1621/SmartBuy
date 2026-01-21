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
            <div className="min-h-screen bg-black flex flex-col">
                <StoreNavbar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex flex-col text-white">
            <Head>
                <title>My Addresses | SmartBuy</title>
            </Head>
            <StoreNavbar />

            <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 sm:mb-10">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="p-3 sm:p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                            <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight underline decoration-blue-500/30 decoration-4 underline-offset-8">My Addresses</h1>
                            <p className="text-gray-500 mt-1 sm:mt-2 font-medium text-xs sm:text-base">Manage your saved delivery addresses</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all shadow-lg shadow-white/5 active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        {isAdding ? 'Cancel' : 'Add New Address'}
                    </button>
                </div>

                <AnimatePresence>
                    {isAdding && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden mb-8"
                        >
                            <form onSubmit={handleAddAddress} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
                                <h3 className="text-lg font-bold mb-6">Add New Address</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={newAddress.name}
                                            onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Phone Number</label>
                                        <input
                                            required
                                            type="tel"
                                            value={newAddress.phone}
                                            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                    <div className="space-y-2 sm:col-span-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Address Line</label>
                                        <input
                                            required
                                            type="text"
                                            value={newAddress.street}
                                            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="Flat, House no., Building, Company, Apartment"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">City</label>
                                        <input
                                            required
                                            type="text"
                                            value={newAddress.city}
                                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="Mumbai"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">State</label>
                                        <input
                                            required
                                            type="text"
                                            value={newAddress.state}
                                            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="Maharashtra"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">ZIP Code</label>
                                        <input
                                            required
                                            type="text"
                                            value={newAddress.zip}
                                            onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="400001"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Address Type</label>
                                        <div className="flex gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setNewAddress({ ...newAddress, type: 'Home' })}
                                                className={`flex-1 py-2.5 rounded-lg text-sm font-bold border transition-all ${newAddress.type === 'Home' ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'}`}
                                            >
                                                Home
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setNewAddress({ ...newAddress, type: 'Work' })}
                                                className={`flex-1 py-2.5 rounded-lg text-sm font-bold border transition-all ${newAddress.type === 'Work' ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'}`}
                                            >
                                                Work
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 flex justify-end">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                                    >
                                        Save Address
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((addr) => (
                        <motion.div
                            layout
                            key={addr.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`relative p-6 rounded-2xl border transition-all group ${addr.isDefault ? 'bg-blue-500/5 border-blue-500/30' : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'}`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <span className={`p-2 rounded-lg ${addr.type === 'Home' ? 'bg-purple-500/10 text-purple-400' : 'bg-orange-500/10 text-orange-400'}`}>
                                        {addr.type === 'Home' ? <Home className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                                    </span>
                                    <span className="font-bold text-sm bg-gray-800 px-2 py-1 rounded text-gray-300">{addr.type}</span>
                                    {addr.isDefault && (
                                        <span className="text-[10px] font-black uppercase tracking-widest bg-blue-500 text-white px-2 py-1 rounded">Default</span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    {!addr.isDefault && (
                                        <button
                                            onClick={() => handleSetDefault(addr.id)}
                                            className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                                            title="Set as Default"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleRemoveAddress(addr.id)}
                                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        title="Remove Address"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-white font-bold">
                                    <User className="w-4 h-4 text-gray-500" />
                                    {addr.name}
                                </div>
                                <div className="flex items-start gap-2 text-gray-400 text-sm">
                                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                    <p>{addr.street}, {addr.city}, {addr.state} - {addr.zip}</p>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <Phone className="w-4 h-4 text-gray-500" />
                                    {addr.phone}
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

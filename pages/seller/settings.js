import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Save, Lock, User, Store, Mail, Phone, CreditCard } from 'lucide-react';
import SellerLayout from '@/components/seller/SellerLayout';
import { useAuth } from '@/context/AuthContext';

export default function SellerSettings() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);

    // Initial data - will be updated when user loads
    const [profileData, setProfileData] = useState({
        storeName: 'My Store',
        email: '',
        phone: '8888888888',
        gst: '27AAAAA0000A1Z5',
        address: '123, Business Park, Mumbai, Maharashtra'
    });

    useEffect(() => {
        if (user) {
            setProfileData(prev => ({
                ...prev,
                storeName: user.name || user.displayName || 'My Store',
                email: user.email || '',
                phone: user.phoneNumber || prev.phone
            }));
        }
    }, [user]);

    const handleSave = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            alert('Settings saved successfully!');
        }, 1000);
    };

    return (
        <SellerLayout title="Store Settings">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-foreground mb-1 tracking-tight">Account & Settings</h2>
                        <p className="text-secondary-text font-medium">Manage your store profile and preferences</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Settings Sidebar */}
                    <div className="lg:col-span-1 space-y-3">
                        {[
                            { id: 'profile', label: 'Identity', icon: Store },
                            { id: 'payment', label: 'Treasury', icon: CreditCard },
                            { id: 'security', label: 'Protection', icon: Lock },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-[0.2em] relative overflow-hidden group ${activeTab === tab.id
                                    ? 'bg-accent text-white shadow-saas'
                                    : 'text-secondary-text hover:text-foreground hover:bg-surface border border-transparent hover:border-border'
                                    }`}
                            >
                                <tab.icon size={18} className={`${activeTab === tab.id ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
                                {tab.id === 'profile' ? 'Core Identity' : tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/20" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-surface border border-border rounded-3xl p-6 md:p-8 shadow-sm">
                            {activeTab === 'profile' && (
                                <form onSubmit={handleSave} className="space-y-6">
                                    <h3 className="text-lg font-black text-foreground mb-6 tracking-tight">Store Details</h3>

                                    <div className="flex items-center gap-8 mb-10 p-6 bg-background rounded-3xl border border-border border-dashed shadow-inner">
                                        <div className="w-24 h-24 rounded-2xl bg-surface border-2 border-dashed border-border flex items-center justify-center text-secondary-text/30 cursor-pointer hover:border-accent hover:text-accent transition-all group overflow-hidden relative">
                                            <User size={40} className="group-hover:scale-110 transition-transform relative z-10" />
                                            <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 transition-colors" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-foreground mb-1 tracking-tight">Venture Mark</h4>
                                            <button type="button" className="text-[10px] font-black text-accent hover:text-accent-hover uppercase tracking-widest border-b border-accent/30 hover:border-accent transition-all pb-0.5">Upload Icon</button>
                                            <p className="text-[10px] text-secondary-text mt-2 font-medium italic">High fidelity assets preferred (PNG/JPG).</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-black text-secondary-text uppercase tracking-widest mb-2">Store Name</label>
                                            <div className="relative">
                                                <Store className="absolute left-4 top-3.5 w-5 h-5 text-secondary-text/50" />
                                                <input
                                                    type="text"
                                                    defaultValue={profileData.storeName}
                                                    className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-3 text-foreground focus:border-accent outline-none font-medium shadow-sm"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-secondary-text uppercase tracking-widest mb-2">GSTIN</label>
                                            <input
                                                type="text"
                                                defaultValue={profileData.gst}
                                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-accent outline-none uppercase font-black tracking-wider shadow-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-secondary-text uppercase tracking-widest mb-2">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-secondary-text/50" />
                                                <input
                                                    type="email"
                                                    defaultValue={profileData.email}
                                                    className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-3 text-foreground focus:border-accent outline-none font-medium shadow-sm"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-secondary-text uppercase tracking-widest mb-2">Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-3.5 w-5 h-5 text-secondary-text/50" />
                                                <input
                                                    type="tel"
                                                    defaultValue={profileData.phone}
                                                    className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-3 text-foreground focus:border-accent outline-none font-medium shadow-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-[10px] font-black text-secondary-text uppercase tracking-widest mb-2">Business Address</label>
                                            <textarea
                                                rows={3}
                                                defaultValue={profileData.address}
                                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-accent outline-none font-medium shadow-sm resize-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-secondary flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="bg-accent hover:bg-accent-hover text-white font-black px-8 py-3 rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 shadow-saas uppercase tracking-widest text-[10px]"
                                        >
                                            {isLoading ? 'Saving...' : (
                                                <>
                                                    <Save size={18} />
                                                    Update Profile
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                            {activeTab === 'payment' && (
                                <form onSubmit={handleSave} className="space-y-6">
                                    <h3 className="text-lg font-black text-foreground mb-6 tracking-tight">Bank Account Details</h3>
                                    <div className="bg-accent/5 border border-accent/10 rounded-2xl p-4 mb-6 flex gap-3">
                                        <div className="p-2 bg-accent/10 rounded-lg h-fit">
                                            <CreditCard size={20} className="text-accent" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-foreground text-sm tracking-tight">Payout Account</h4>
                                            <p className="text-[10px] text-secondary-text mt-1 font-medium">Funds from your sales will be deposited to this account every Wednesday.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-secondary-text uppercase tracking-widest mb-2">Account Holder Name</label>
                                            <input
                                                type="text"
                                                defaultValue={user?.name || "SmartBuy Seller"}
                                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-accent outline-none font-medium shadow-sm"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-black text-secondary-text uppercase tracking-widest mb-2">Bank Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="HDFC Bank"
                                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-accent outline-none font-medium shadow-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-secondary-text uppercase tracking-widest mb-2">IFSC Code</label>
                                                <input
                                                    type="text"
                                                    placeholder="HDFC0001234"
                                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-accent outline-none uppercase font-black tracking-widest shadow-sm"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-secondary-text uppercase tracking-widest mb-2">Account Number</label>
                                            <input
                                                type="password"
                                                defaultValue="123456789012"
                                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-accent outline-none font-black tracking-widest shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-secondary flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="bg-accent hover:bg-accent-hover text-white font-black px-8 py-3 rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 shadow-saas uppercase tracking-widest text-[10px]"
                                        >
                                            {isLoading ? 'Verifying...' : 'Save Bank Details'}
                                        </button>
                                    </div>
                                </form>
                            )}
                             {activeTab === 'security' && (
                                <form onSubmit={handleSave} className="space-y-6">
                                    <h3 className="text-lg font-black text-foreground mb-6 tracking-tight">Login Security</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-secondary-text uppercase tracking-widest mb-2">Current Password</label>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-accent outline-none font-black tracking-widest shadow-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-secondary-text uppercase tracking-widest mb-2">New Password</label>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-accent outline-none font-black tracking-widest shadow-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-secondary-text uppercase tracking-widest mb-2">Confirm New Password</label>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-accent outline-none font-black tracking-widest shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-secondary flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="bg-accent hover:bg-accent-hover text-white font-black px-8 py-3 rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 shadow-saas uppercase tracking-widest text-[10px]"
                                        >
                                            {isLoading ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
}

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
                        <h2 className="text-2xl font-bold text-white mb-2">Account & Settings</h2>
                        <p className="text-gray-400">Manage your store profile and preferences</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Settings Sidebar */}
                    <div className="lg:col-span-1 space-y-2">
                        {[
                            { id: 'profile', label: 'Store Profile', icon: Store },
                            { id: 'payment', label: 'Payments & Bank', icon: CreditCard },
                            { id: 'security', label: 'Login & Security', icon: Lock },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === tab.id
                                    ? 'bg-white text-black shadow-lg shadow-white/10'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
                            {activeTab === 'profile' && (
                                <form onSubmit={handleSave} className="space-y-6">
                                    <h3 className="text-lg font-bold text-white mb-6">Store Details</h3>

                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="w-20 h-20 rounded-full bg-gray-800 border-2 border-dashed border-gray-600 flex items-center justify-center text-gray-500 cursor-pointer hover:border-white hover:text-white transition-all">
                                            <User size={32} />
                                        </div>
                                        <div>
                                            <button type="button" className="text-sm font-bold text-white hover:text-gray-300">Change Logo</button>
                                            <p className="text-xs text-gray-500 mt-1">Recommended: 400x400px</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Store Name</label>
                                            <div className="relative">
                                                <Store className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                                                <input
                                                    type="text"
                                                    defaultValue={profileData.storeName}
                                                    className="w-full bg-black border border-gray-700 rounded-xl pl-12 pr-4 py-3 text-white focus:border-white outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">GSTIN</label>
                                            <input
                                                type="text"
                                                defaultValue={profileData.gst}
                                                className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-white outline-none uppercase font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                                                <input
                                                    type="email"
                                                    defaultValue={profileData.email}
                                                    className="w-full bg-black border border-gray-700 rounded-xl pl-12 pr-4 py-3 text-white focus:border-white outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                                                <input
                                                    type="tel"
                                                    defaultValue={profileData.phone}
                                                    className="w-full bg-black border border-gray-700 rounded-xl pl-12 pr-4 py-3 text-white focus:border-white outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Business Address</label>
                                            <textarea
                                                rows={3}
                                                defaultValue={profileData.address}
                                                className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-white outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-800 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="bg-white hover:bg-gray-200 text-black font-bold px-8 py-3 rounded-xl flex items-center gap-2 transition-all disabled:opacity-50"
                                        >
                                            {isLoading ? 'Saving...' : (
                                                <>
                                                    <Save size={18} />
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                            {activeTab === 'payment' && (
                                <form onSubmit={handleSave} className="space-y-6">
                                    <h3 className="text-lg font-bold text-white mb-6">Bank Account Details</h3>
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 flex gap-3">
                                        <div className="p-2 bg-white/10 rounded-lg h-fit">
                                            <CreditCard size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm">Payout Account</h4>
                                            <p className="text-xs text-gray-400 mt-1">Funds from your sales will be deposited to this account every Wednesday.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Account Holder Name</label>
                                            <input
                                                type="text"
                                                defaultValue={user?.name || "SmartBuy Seller"}
                                                className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-white outline-none"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">Bank Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="HDFC Bank"
                                                    className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-white outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">IFSC Code</label>
                                                <input
                                                    type="text"
                                                    placeholder="HDFC0001234"
                                                    className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-white outline-none uppercase"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Account Number</label>
                                            <input
                                                type="password"
                                                defaultValue="123456789012"
                                                className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-white outline-none font-mono"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-800 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="bg-white hover:bg-gray-200 text-black font-bold px-8 py-3 rounded-xl flex items-center gap-2 transition-all disabled:opacity-50"
                                        >
                                            {isLoading ? 'Verifying...' : 'Save Bank Details'}
                                        </button>
                                    </div>
                                </form>
                            )}
                            {activeTab === 'security' && (
                                <form onSubmit={handleSave} className="space-y-6">
                                    <h3 className="text-lg font-bold text-white mb-6">Login Security</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-white outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-white outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-white outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-800 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="bg-white hover:bg-gray-200 text-black font-bold px-8 py-3 rounded-xl flex items-center gap-2 transition-all disabled:opacity-50"
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

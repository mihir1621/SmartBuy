import SellerLayout from '@/components/seller/SellerLayout';
import { useState, useEffect } from 'react';
import { User, Mail, Smartphone, Save, Key, Shield } from 'lucide-react';

export default function SellerSettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState({ name: '', email: '', phone: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/seller/profile');
            if (res.ok) {
                const data = await res.json();
                setUser(data);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/seller/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });
            if (res.ok) {
                alert("Profile Updated Successfully!");
            } else {
                alert("Failed to update profile");
            }
        } catch (error) {
            alert("Error updating profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <SellerLayout title="Account Settings">
            <div className="max-w-3xl">
                <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden p-8">
                    <div className="flex items-center gap-6 mb-8 border-b border-gray-800 pb-8">
                        <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-2xl shadow-orange-500/20">
                            {user.name?.[0] || 'S'}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white">{user.name || 'Seller Account'}</h2>
                            <p className="text-gray-500 font-medium">Seller ID: {user.phone}</p>
                            <span className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full uppercase tracking-wider">
                                <Shield size={12} />
                                Verified Seller
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="text"
                                        value={user.name}
                                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                                        className="w-full bg-black border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="email"
                                        value={user.email}
                                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                                        className="w-full bg-black border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">Phone Number</label>
                            <div className="relative opacity-50 cursor-not-allowed">
                                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="text"
                                    value={user.phone}
                                    readOnly
                                    className="w-full bg-gray-800 border-none rounded-xl pl-12 pr-4 py-3 text-gray-400 font-medium"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500">Contact Support to Change</span>
                            </div>
                        </div>

                        <div className="pt-6 flex justify-between">
                            <button
                                type="button"
                                onClick={async () => {
                                    if (confirm("Generate sample products and orders to test the dashboard?\n\nThis will add demo data to your account.")) {
                                        setSaving(true);
                                        const res = await fetch('/api/seller/generate-demo', { method: 'POST' });
                                        setSaving(false);
                                        if (res.ok) {
                                            alert("Demo data created successfully! \n\nCheck your 'My Products' and 'Orders' tabs to see the new items.");
                                        } else {
                                            alert("Failed to generate data.");
                                        }
                                    }
                                }}
                                className="text-orange-500 font-bold hover:text-orange-400 text-sm flex items-center gap-2"
                            >
                                <span className="text-xl">✨</span> Generate Demo Data
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 font-bold py-3 px-8 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : (
                                    <>
                                        <Save size={18} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </SellerLayout>
    );
}

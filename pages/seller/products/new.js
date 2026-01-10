import SellerLayout from '@/components/seller/SellerLayout';
import { useState } from 'react';
import { Image as ImageIcon, Upload, Save, X } from 'lucide-react';
import { useRouter } from 'next/router';

export default function AddProduct() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Smartphones',
        stock: '1',
        brand: '',
        image: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // 1. Optimistic Local Storage Update (for "store locally" feel)
        try {
            const localProducts = JSON.parse(localStorage.getItem('seller_products') || '[]');
            const newLocalProduct = {
                ...formData,
                id: Date.now(), // Temp unique ID for local
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                inStock: parseInt(formData.stock) > 0,
                createdAt: new Date().toISOString()
            };
            localStorage.setItem('seller_products', JSON.stringify([newLocalProduct, ...localProducts]));
        } catch (error) {
            console.error("Local storage error", error);
        }

        // 2. Real API Call to save to database (to ensure visibility on site)
        try {
            const res = await fetch('/api/seller/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert("Product published successfully!");
                router.push('/seller/products');
            } else {
                const err = await res.json();
                alert("Failed to publish: " + (err.error || "Unknown error"));
                setLoading(false);
            }
        } catch (err) {
            console.error("API Error", err);
            // If offline or network error, we already saved to LS so we let them proceed
            alert("Network error occurred. Product saved locally only.");
            router.push('/seller/products');
        }
    };

    return (
        <SellerLayout title="Add Product">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-black text-white">Add New Product</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            Basic Details
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                                    placeholder="e.g. iPhone 15 Pro"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Brand</label>
                                <input
                                    type="text"
                                    name="brand"
                                    required
                                    value={formData.brand}
                                    onChange={handleChange}
                                    className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                                    placeholder="e.g. Apple"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                            <textarea
                                name="description"
                                required
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                                placeholder="Describe your product key features..."
                            />
                        </div>
                    </div>

                    {/* Pricing & Category */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Price (₹)</label>
                                <input
                                    type="number"
                                    name="price"
                                    required
                                    min="0"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                                    placeholder="29999"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Stock</label>
                                <input
                                    type="number"
                                    name="stock"
                                    required
                                    min="0"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                                    placeholder="50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all appearance-none"
                                >
                                    <option>Smartphones</option>
                                    <option>Laptops</option>
                                    <option>Audio</option>
                                    <option>Cameras</option>
                                    <option>Menswear</option>
                                    <option>Womenswear</option>
                                    <option>Accessories</option>
                                    <option>Home</option>
                                    <option>Decor</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Image Upload Placeholder */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                        <label className="block text-sm font-medium text-gray-400 mb-4">Product Image URL</label>
                        <div className="flex gap-4">
                            <input
                                type="url"
                                name="image"
                                required
                                value={formData.image}
                                onChange={handleChange}
                                className="flex-1 bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-3 font-bold text-gray-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50"
                        >
                            {loading ? <span className="animate-pulse">Saving...</span> : (
                                <>
                                    <Save size={20} />
                                    Publish Product
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </SellerLayout>
    );
}

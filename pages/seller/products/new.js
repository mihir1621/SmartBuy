import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Save, X, Upload, ChevronLeft, DollarSign, Tag, Box, AlertCircle, CheckCircle } from 'lucide-react';
import SellerLayout from '@/components/seller/SellerLayout';

export default function NewProduct() {
    const { user } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        stock: '',
        category: 'Electronics',
        brand: '',
        image: ''
    });

    const [previewImage, setPreviewImage] = useState(null);

    // Auto-calculate discount
    const discount = formData.originalPrice && formData.price
        ? Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100)
        : 0;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.value) {
            setFormData(prev => ({ ...prev, image: e.target.value }));
            setPreviewImage(e.target.value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Basic Validation
        if (!formData.name || !formData.price || !formData.stock) {
            alert("Please fill in all required fields.");
            setIsLoading(false);
            return;
        }

        // 1. Optimistic Update (Local Storage)
        try {
            const localProducts = JSON.parse(localStorage.getItem('seller_products') || '[]');
            const newLocalProduct = {
                ...formData,
                id: Date.now(),
                price: parseFloat(formData.price),
                originalPrice: parseFloat(formData.originalPrice) || (parseFloat(formData.price) * 1.2),
                discount: discount > 0 ? discount : 0,
                stock: parseInt(formData.stock),
                inStock: parseInt(formData.stock) > 0,
                createdAt: new Date().toISOString()
            };
            localStorage.setItem('seller_products', JSON.stringify([newLocalProduct, ...localProducts]));
        } catch (error) {
            console.error("Local storage error", error);
        }

        // 2. Real Backend Update
        try {
            const res = await fetch('/api/seller/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    discount: discount > 0 ? discount : 0,
                    originalPrice: formData.originalPrice || (formData.price * 1.2), // Fallback
                    userId: user?.uid,
                    email: user?.email
                })
            });

            if (res.ok) {
                // Success
                router.push('/seller/products');
            } else {
                const err = await res.json();
                alert("Failed to publish to server: " + (err.error || "Unknown error"));
                // Still redirect since we saved locally
                router.push('/seller/products');
            }
        } catch (err) {
            console.error("API Error", err);
            alert("Network error. Product saved locally.");
            router.push('/seller/products');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SellerLayout title="Add New Product">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ChevronLeft size={20} />
                        Back to Products
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={() => router.back()}
                            className="px-6 py-2.5 rounded-xl border border-gray-700 text-gray-300 font-medium hover:bg-gray-800 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="bg-white hover:bg-gray-200 text-black font-bold px-8 py-2.5 rounded-xl shadow-lg shadow-white/10 flex items-center gap-2 transition-all disabled:opacity-50"
                        >
                            {isLoading ? 'Publishing...' : (
                                <>
                                    <Save size={18} />
                                    Publish Product
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <Tag size={20} className="text-white" />
                                Basic Information
                            </h3>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Product Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-white focus:ring-1 focus:ring-white outline-none transition-all"
                                        placeholder="e.g. Wireless Noise Cancelling Headphones"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Brand</label>
                                        <input
                                            type="text"
                                            name="brand"
                                            value={formData.brand}
                                            onChange={handleInputChange}
                                            className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-white outline-none transition-all"
                                            placeholder="e.g. Sony"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-white outline-none transition-all"
                                        >
                                            <option value="Electronics">Electronics</option>
                                            <option value="Fashion">Fashion</option>
                                            <option value="Home">Home & Living</option>
                                            <option value="Beauty">Beauty</option>
                                            <option value="Sports">Sports</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-white outline-none transition-all"
                                        placeholder="Detailed description of the product..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pricing & Inventory */}
                        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <DollarSign size={20} className="text-white" />
                                Pricing & Inventory
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Selling Price (₹)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-white focus:ring-1 focus:ring-white outline-none transition-all font-mono"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">MRP / Original Price (₹)</label>
                                    <input
                                        type="number"
                                        name="originalPrice"
                                        value={formData.originalPrice}
                                        onChange={handleInputChange}
                                        className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-white outline-none transition-all font-mono"
                                        placeholder="0.00"
                                    />
                                </div>

                                {discount > 0 && (
                                    <div className="md:col-span-2">
                                        <div className="bg-white/10 border border-white/20 rounded-xl p-4 flex items-center gap-3 text-white">
                                            <Tag size={18} />
                                            <span className="font-medium">Calculated Discount: <span className="font-bold text-white">{discount}% OFF</span></span>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Stock Quantity</label>
                                    <div className="relative">
                                        <Box className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                                        <input
                                            type="number"
                                            name="stock"
                                            value={formData.stock}
                                            onChange={handleInputChange}
                                            className="w-full bg-black border border-gray-700 rounded-xl px-12 py-3 text-white focus:border-white outline-none transition-all font-mono"
                                            placeholder="100"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Media */}
                    <div className="space-y-6">
                        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <Upload size={20} className="text-white" />
                                Product Image
                            </h3>

                            <div className="space-y-4">
                                <div className="relative aspect-square bg-black border-2 border-dashed border-gray-700 rounded-2xl flex flex-col items-center justify-center p-4 overflow-hidden group">
                                    {previewImage ? (
                                        <Image src={previewImage} alt="Preview" fill className="object-cover" />
                                    ) : (
                                        <div className="text-center text-gray-500">
                                            <Upload className="mx-auto w-10 h-10 mb-2 opacity-50" />
                                            <span className="text-xs font-medium">No image URL yet</span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Image URL</label>
                                    <input
                                        type="text"
                                        value={formData.image}
                                        onChange={handleImageChange}
                                        className="w-full bg-black border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:border-white outline-none"
                                        placeholder="https://..."
                                    />
                                    <p className="text-[10px] text-gray-500 mt-2">
                                        Supported hosting: Unsplash, Pexels, Samsung, Apple CDN, etc.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-white mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-1">Seller Tip</h4>
                                    <p className="text-xs text-gray-400 leading-relaxed">
                                        Adding a discount (Original Price &gt; Selling Price) significantly increases conversion rates.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
}

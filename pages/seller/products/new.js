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
                        className="flex items-center gap-2 text-secondary-text hover:text-foreground transition-colors font-black text-xs uppercase tracking-widest"
                    >
                        <ChevronLeft size={20} />
                        Back
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={() => router.back()}
                            className="px-6 py-2.5 rounded-xl border border-border text-secondary-text font-black text-[10px] uppercase tracking-widest hover:bg-secondary transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="bg-accent hover:bg-accent-hover text-white font-black px-8 py-2.5 rounded-xl shadow-saas flex items-center gap-2 transition-all disabled:opacity-50 uppercase tracking-widest text-[10px]"
                        >
                            {isLoading ? 'Publishing...' : (
                                <>
                                    <Save size={18} />
                                    Publish
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <div className="bg-surface border border-border rounded-3xl p-6 md:p-8 shadow-sm">
                            <h3 className="text-lg font-black text-foreground mb-6 flex items-center gap-2 tracking-tight">
                                <Tag size={20} className="text-accent" />
                                Basic Information
                            </h3>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-[10px] font-black text-secondary-text uppercase tracking-widest mb-2">Product Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-secondary-text/50 font-medium"
                                        placeholder="e.g. Wireless Noise Cancelling Headphones"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-secondary-text uppercase tracking-widest mb-2">Brand</label>
                                        <input
                                            type="text"
                                            name="brand"
                                            value={formData.brand}
                                            onChange={handleInputChange}
                                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-accent outline-none transition-all placeholder:text-secondary-text/50 font-medium"
                                            placeholder="e.g. Sony"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-secondary-text uppercase tracking-widest mb-2">Category</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-accent outline-none transition-all font-medium"
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
                                    <label className="block text-[10px] font-black text-secondary-text uppercase tracking-widest mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-accent outline-none transition-all placeholder:text-secondary-text/50 font-medium resize-none shadow-sm"
                                        placeholder="Detailed description of the product..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pricing & Inventory */}
                        <div className="bg-surface border border-border rounded-3xl p-6 md:p-8 shadow-sm">
                            <h3 className="text-lg font-black text-foreground mb-6 flex items-center gap-2 tracking-tight">
                                <DollarSign size={20} className="text-accent" />
                                Pricing & Inventory
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-secondary-text uppercase tracking-widest mb-2">Selling Price (₹)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all font-black text-lg shadow-sm"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-secondary-text uppercase tracking-widest mb-2">MRP (₹)</label>
                                    <input
                                        type="number"
                                        name="originalPrice"
                                        value={formData.originalPrice}
                                        onChange={handleInputChange}
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-accent outline-none transition-all font-black text-lg shadow-sm"
                                        placeholder="0.00"
                                    />
                                </div>

                                {discount > 0 && (
                                    <div className="md:col-span-2">
                                        <div className="bg-success/5 border border-success/10 rounded-xl p-4 flex items-center gap-3 text-success">
                                            <Tag size={18} />
                                            <span className="text-xs font-black uppercase tracking-widest">Discount applied: <span className="text-lg">{discount}% OFF</span></span>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-[10px] font-black text-secondary-text uppercase tracking-widest mb-2">Stock Quantity</label>
                                    <div className="relative">
                                        <Box className="absolute left-4 top-3.5 w-5 h-5 text-secondary-text" />
                                        <input
                                            type="number"
                                            name="stock"
                                            value={formData.stock}
                                            onChange={handleInputChange}
                                            className="w-full bg-background border border-border rounded-xl px-12 py-3 text-foreground focus:border-accent outline-none transition-all font-black text-lg shadow-sm"
                                            placeholder="100"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Media */}
                    <div className="space-y-6">
                        <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm">
                            <h3 className="text-lg font-black text-foreground mb-6 flex items-center gap-2 tracking-tight">
                                <Upload size={20} className="text-accent" />
                                Product Image
                            </h3>

                            <div className="space-y-4">
                                <div className="relative aspect-square bg-background border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center p-4 overflow-hidden group">
                                    {previewImage ? (
                                        <Image src={previewImage} alt="Preview" fill className="object-cover" />
                                    ) : (
                                        <div className="text-center text-secondary-text">
                                            <Upload className="mx-auto w-10 h-10 mb-2 opacity-30" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">No URL provided</span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-secondary-text uppercase tracking-widest mb-2">Image URL</label>
                                    <input
                                        type="text"
                                        value={formData.image}
                                        onChange={handleImageChange}
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-accent outline-none font-medium shadow-sm transition-all"
                                        placeholder="https://..."
                                    />
                                    <p className="text-[10px] text-secondary-text mt-3 font-medium text-center">
                                        Supports unsplash, cdn, direct links.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-accent/5 border border-accent/10 rounded-3xl p-6 shadow-sm">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-accent mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-black text-foreground mb-1 tracking-tight">Seller Tip</h4>
                                    <p className="text-xs text-secondary-text font-medium leading-relaxed">
                                        Adding a discount significantly increases conversion rates. Set MRP higher than Price.
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

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
    Save,
    X,
    Upload,
    Image as ImageIcon,
    Plus,
    Trash2,
    AlertCircle,
    Loader2
} from 'lucide-react';
import Image from 'next/image';

export default function ProductForm({ initialData = null, isEditing = false }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        category: '',
        price: '',
        originalPrice: '',
        discount: 0,
        rating: 4.5,
        reviews: 0,
        image: '',
        images: [],
        description: '',
        stock: 50,
        inStock: true,
        isNew: true,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                images: Array.isArray(initialData.images) ? initialData.images : (typeof initialData.images === 'string' ? JSON.parse(initialData.images) : []),
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (name === 'price' || name === 'originalPrice' || name === 'discount' || name === 'rating' || name === 'reviews' || name === 'stock' ? parseFloat(value) : value)
        }));
    };

    const handleImageAdd = () => {
        const url = prompt('Enter image URL:');
        if (url) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, url]
            }));
        }
    };

    const removeImage = (idx) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== idx)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const url = isEditing ? `/api/products/${formData.id}` : '/api/products';
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/admin/products');
            } else {
                const data = await res.json();
                setError(data.error || 'Something went wrong');
            }
        } catch (err) {
            setError('Failed to save product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400">
                    <AlertCircle size={20} />
                    <p className="text-sm font-bold">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Col: Main Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-sm space-y-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                            Basic Information
                        </h3>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Product Name</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-950 border border-gray-800 rounded-2xl py-4 px-5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                                placeholder="e.g. MacBook Pro M3"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Brand</label>
                                <input
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-950 border border-gray-800 rounded-2xl py-4 px-5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                                    placeholder="e.g. Apple"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Category</label>
                                <input
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-950 border border-gray-800 rounded-2xl py-4 px-5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                                    placeholder="e.g. Electronics"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows={6}
                                className="w-full bg-gray-950 border border-gray-800 rounded-2xl py-4 px-5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium resize-none"
                                placeholder="Write a clear product description..."
                            />
                        </div>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-sm space-y-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                            Pricing & Inventory
                        </h3>

                        <div className="grid grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 text-emerald-500/80">Selling Price (₹)</label>
                                <input
                                    name="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-950 border border-gray-800 rounded-2xl py-4 px-5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold text-lg"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Original Price (₹)</label>
                                <input
                                    name="originalPrice"
                                    type="number"
                                    value={formData.originalPrice}
                                    onChange={handleChange}
                                    className="w-full bg-gray-950 border border-gray-800 rounded-2xl py-4 px-5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Discount (%)</label>
                                <input
                                    name="discount"
                                    type="number"
                                    value={formData.discount}
                                    onChange={handleChange}
                                    className="w-full bg-gray-950 border border-gray-800 rounded-2xl py-4 px-5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 text-blue-500">Inventory Stock</label>
                                <input
                                    name="stock"
                                    type="number"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-950 border border-gray-800 rounded-2xl py-4 px-5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold text-lg"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-8 pt-4">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        name="inStock"
                                        checked={formData.inStock}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-12 h-6 bg-gray-800 rounded-full peer peer-checked:bg-emerald-600 transition-all" />
                                    <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:left-7" />
                                </div>
                                <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">In Stock</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        name="isNew"
                                        checked={formData.isNew}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-12 h-6 bg-gray-800 rounded-full peer peer-checked:bg-blue-600 transition-all" />
                                    <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:left-7" />
                                </div>
                                <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">New Arrival</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Right Col: Images & Status */}
                <div className="space-y-6">
                    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-sm space-y-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-amber-500 rounded-full" />
                                Product Media
                            </h3>
                        </div>

                        <div className="space-y-4">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Featured Image URL</label>
                            {formData.image && (
                                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-950 border border-gray-800 shadow-inner group">
                                    <Image src={formData.image} alt="Preview" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                                        className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-all shadow-xl"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )}

                            {!formData.image && (
                                <div
                                    onClick={() => {
                                        const url = prompt('Enter main image URL:');
                                        if (url) setFormData(prev => ({ ...prev, image: url }));
                                    }}
                                    className="aspect-square w-full rounded-2xl border-2 border-dashed border-gray-800 flex flex-col items-center justify-center text-gray-600 hover:text-blue-500 hover:border-blue-500/50 hover:bg-blue-500/5 cursor-pointer transition-all"
                                >
                                    <ImageIcon size={48} className="mb-4 opacity-20" />
                                    <p className="text-sm font-bold">Click to add main image</p>
                                </div>
                            )}

                            <div className="space-y-4 pt-4 border-t border-gray-800">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Gallery Images ({formData.images.length}/10)</label>
                                    <button
                                        type="button"
                                        onClick={handleImageAdd}
                                        className="text-blue-400 hover:text-blue-300 text-xs font-bold flex items-center gap-1"
                                    >
                                        <Plus size={14} /> Add
                                    </button>
                                </div>

                                <div className="grid grid-cols-4 gap-3">
                                    {formData.images.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-800 group bg-gray-950">
                                            <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover group-hover:scale-125 transition-transform" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute inset-0 bg-red-500/80 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    ))}
                                    {formData.images.length < 10 && (
                                        <button
                                            type="button"
                                            onClick={handleImageAdd}
                                            className="aspect-square rounded-lg border border-dashed border-gray-800 flex items-center justify-center text-gray-700 hover:text-blue-500 hover:border-blue-500/30 transition-all"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-sm space-y-6 sticky top-28">
                        <div className="space-y-4">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Publish Settings</p>
                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-50 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                {isEditing ? 'Update Product' : 'Create Product'}
                            </button>

                            <button
                                type="button"
                                onClick={() => router.push('/admin/products')}
                                className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 border border-gray-700 transition-all"
                            >
                                <X size={20} />
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

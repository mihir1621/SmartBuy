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
                <div className="bg-error/10 border border-error/20 p-4 rounded-2xl flex items-center gap-3 text-error">
                    <AlertCircle size={20} />
                    <p className="text-sm font-black">{error}</p>
                </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Col: Main Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-surface border border-border rounded-3xl p-8 shadow-sm space-y-6">
                        <h3 className="text-lg font-black text-foreground mb-4 flex items-center gap-2 tracking-tight">
                            <span className="w-1.5 h-6 bg-accent rounded-full" />
                            Basic Information
                        </h3>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-secondary-text uppercase tracking-widest ml-1">Product Name</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full bg-background border border-border rounded-2xl py-4 px-5 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium"
                                placeholder="e.g. MacBook Pro M3"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-secondary-text uppercase tracking-widest ml-1">Brand</label>
                                <input
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-background border border-border rounded-2xl py-4 px-5 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium"
                                    placeholder="e.g. Apple"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-secondary-text uppercase tracking-widest ml-1">Category</label>
                                <input
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-background border border-border rounded-2xl py-4 px-5 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium"
                                    placeholder="e.g. Electronics"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-secondary-text uppercase tracking-widest ml-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows={6}
                                className="w-full bg-background border border-border rounded-2xl py-4 px-5 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium resize-none shadow-sm"
                                placeholder="Write a clear product description..."
                            />
                        </div>
                    </div>

                    <div className="bg-surface border border-border rounded-3xl p-8 shadow-sm space-y-6">
                        <h3 className="text-lg font-black text-foreground mb-4 flex items-center gap-2 tracking-tight">
                            <span className="w-1.5 h-6 bg-accent rounded-full" />
                            Pricing & Inventory
                        </h3>

                        <div className="grid grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-secondary-text uppercase tracking-widest ml-1">Selling Price (₹)</label>
                                <input
                                    name="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-background border border-border rounded-2xl py-4 px-5 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-black text-2xl tracking-tight"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-secondary-text uppercase tracking-widest ml-1">Original Price (₹)</label>
                                <input
                                    name="originalPrice"
                                    type="number"
                                    value={formData.originalPrice}
                                    onChange={handleChange}
                                    className="w-full bg-background border border-border rounded-2xl py-4 px-5 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-secondary-text uppercase tracking-widest ml-1">Discount (%)</label>
                                <input
                                    name="discount"
                                    type="number"
                                    value={formData.discount}
                                    onChange={handleChange}
                                    className="w-full bg-background border border-border rounded-2xl py-4 px-5 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-secondary-text uppercase tracking-widest ml-1">Inventory Level</label>
                                <input
                                    name="stock"
                                    type="number"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-background border border-border rounded-2xl py-4 px-5 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-black text-xl tracking-tight"
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
                                    <div className="w-12 h-6 bg-secondary border border-border rounded-full peer peer-checked:bg-accent transition-all" />
                                    <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:left-7 shadow-sm" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-secondary-text group-hover:text-foreground transition-colors">In Stock</span>
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
                                    <div className="w-12 h-6 bg-secondary border border-border rounded-full peer peer-checked:bg-accent transition-all" />
                                    <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:left-7 shadow-sm" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-secondary-text group-hover:text-foreground transition-colors">New Arrival</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Right Col: Images & Status */}
                <div className="space-y-6">
                    <div className="bg-surface border border-border rounded-3xl p-8 shadow-sm space-y-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-black text-foreground flex items-center gap-2 tracking-tight">
                                <span className="w-1.5 h-6 bg-accent rounded-full" />
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
                                        className="absolute top-3 right-3 p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-all shadow-xl"
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
                                    className="aspect-square w-full rounded-2xl border-2 border-dashed border-gray-800 flex flex-col items-center justify-center text-gray-600 hover:text-white hover:border-white/50 hover:bg-white/5 cursor-pointer transition-all"
                                >
                                    <ImageIcon size={48} className="mb-4 opacity-20" />
                                    <p className="text-sm font-bold">Click to add main image</p>
                                </div>
                            )}

                            <div className="space-y-4 pt-6 border-t border-border">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black text-secondary-text uppercase tracking-widest ml-1">Catalogue Gallery ({formData.images.length}/10)</label>
                                    <button
                                        type="button"
                                        onClick={handleImageAdd}
                                        className="text-accent hover:text-accent-hover text-[10px] font-black uppercase tracking-widest flex items-center gap-1 transition-colors"
                                    >
                                        <Plus size={14} /> Add View
                                    </button>
                                </div>

                                <div className="grid grid-cols-4 gap-3">
                                    {formData.images.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-border group bg-background shadow-sm">
                                            <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover group-hover:scale-125 transition-transform" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute inset-0 bg-error/90 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {formData.images.length < 10 && (
                                        <button
                                            type="button"
                                            onClick={handleImageAdd}
                                            className="aspect-square rounded-xl border border-dashed border-border flex items-center justify-center text-secondary-text hover:text-accent hover:border-accent/40 hover:bg-accent/5 transition-all shadow-sm"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface border border-border rounded-3xl p-8 shadow-sm space-y-4 sticky top-28">
                        <p className="text-[10px] font-black text-secondary-text uppercase tracking-[0.2em] ml-1">Catalogue Controls</p>
                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-accent hover:bg-accent-hover disabled:bg-secondary disabled:text-secondary-text text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-saas transition-all active:scale-95 uppercase tracking-widest text-xs"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            {isEditing ? 'Sync Changes' : 'Launch Product'}
                        </button>

                        <button
                            type="button"
                            onClick={() => router.push('/admin/products')}
                            className="w-full bg-background hover:bg-secondary text-secondary-text hover:text-foreground font-black py-4 rounded-2xl flex items-center justify-center gap-2 border border-border transition-all uppercase tracking-widest text-xs"
                        >
                            <X size={20} />
                            Discard
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}

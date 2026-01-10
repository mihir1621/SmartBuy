import SellerLayout from '@/components/seller/SellerLayout';
import { useState, useEffect } from 'react';
import { Save, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function EditProduct() {
    const router = useRouter();
    const { id } = router.query;
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditMode);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Smartphones',
        stock: '1',
        brand: '',
        image: ''
    });

    useEffect(() => {
        if (id) {
            fetchProduct(id);
        }
    }, [id]);

    const fetchProduct = async (productId) => {
        try {
            // Re-using the public API or Seller API to fetch details?
            // Since we need to pre-fill specific seller data and verify ownership, 
            // the My Products logic already lists them.
            // Ideally should have GET /api/seller/products/[id]
            // We can reuse the public fetch or simple assume we have access if looking at it.
            // But we need to use the endpoint I just created: /api/seller/products (GET list)
            // Wait, I didn't create GET /id on seller route yet, only PUT/DELETE.
            // Let's rely on finding it from the list or just fetch from public API if available. 
            // Actually, best practice is to have GET on /api/seller/products/[id], but I'll skip and just fetch from public if simpler 
            // OR I can quickly filter from the full list if I don't want to make a new endpoint.
            // Let's add GET to /api/seller/products/[id].js logic actually? No I restricted it to PUT/DELETE.

            // Hack for now: fetch all and find. Or fetch public product data.
            // Let's use public prisma fetch via getServerSideProps usually, but here client side.

            // Just assume we can fetch via the public Product API if needed, but wait, the public API isn't generic.
            // I'll update /api/seller/products/[id].js to allow GET as well.

            const res = await fetch(`/api/seller/products/${productId}`);
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    category: data.category,
                    stock: data.stock,
                    brand: data.brand || '',
                    image: data.image
                });
            }
        } catch (error) {
            console.error("Fetch error", error);
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const url = isEditMode ? `/api/seller/products/${id}` : '/api/seller/products';
        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                router.push('/seller/products');
            } else {
                const err = await res.json();
                alert(err.error || "Operation failed");
            }
        } catch (error) {
            alert("Network error");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

    return (
        <SellerLayout title={isEditMode ? "Edit Product" : "Add Product"}>
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/seller/products" className="p-2 bg-gray-900 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
                        <ChevronLeft size={24} />
                    </Link>
                    <h1 className="text-3xl font-black text-white">{isEditMode ? "Edit Product" : "Add New Product"}</h1>
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
                        <Link href="/seller/products" className="px-6 py-3 font-bold text-gray-400 hover:text-white transition-colors">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50"
                        >
                            {loading ? <span className="animate-pulse">Saving...</span> : (
                                <>
                                    <Save size={20} />
                                    {isEditMode ? 'Update Product' : 'Publish Product'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </SellerLayout>
    );
}

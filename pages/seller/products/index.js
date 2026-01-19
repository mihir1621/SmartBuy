import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Tag, Box, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import SellerLayout from '@/components/seller/SellerLayout';

export default function SellerProducts() {
    const { user } = useAuth();
    const router = useRouter(); // Import useRouter
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                // 1. Try Local Storage first (Best for immediate feedback)
                const localData = localStorage.getItem('seller_products');
                let localProducts = [];
                if (localData) {
                    localProducts = JSON.parse(localData);
                }

                // 2. Fetch from API (Source of Truth)
                const res = await fetch(`/api/seller/products?userId=${user?.uid}&email=${encodeURIComponent(user?.email || '')}`);
                if (res.ok) {
                    const apiProducts = await res.json();
                    if (apiProducts.length > 0) {
                        setProducts(apiProducts);
                    } else {
                        setProducts(localProducts);
                    }
                } else {
                    setProducts(localProducts);
                }
            } catch (error) {
                console.error("Error fetching products", error);
                const localData = localStorage.getItem('seller_products');
                if (localData) setProducts(JSON.parse(localData));
            } finally {
                setIsLoading(false);
            }
        };

        if (user) fetchProducts();
    }, [user]);

    useEffect(() => {
        if (router.query.search) {
            setSearchQuery(router.query.search);
        }
    }, [router.query.search]);


    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        // Optimistic delete
        const updated = products.filter(p => p.id !== id);
        setProducts(updated);
        localStorage.setItem('seller_products', JSON.stringify(updated));

        // API Delete (Mock implementation if endpoint existed)
        // await fetch(`/api/seller/products/${id}`, { method: 'DELETE' });
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SellerLayout title="My Products">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-4 top-3.5 text-gray-500 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-800 rounded-2xl pl-12 pr-4 py-3 text-white focus:border-blue-500 outline-none"
                    />
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button className="px-4 py-3 bg-gray-900 border border-gray-800 rounded-2xl text-gray-400 hover:text-white flex items-center gap-2">
                        <Filter size={18} />
                        Filter
                    </button>
                    <Link href="/seller/products/new" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-blue-500/20">
                        <Plus size={20} />
                        Add Product
                    </Link>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-20">
                    <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading your inventory...</p>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-gray-900/50 rounded-3xl border border-gray-800 border-dashed">
                    <Box className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Products Found</h3>
                    <p className="text-gray-500 mb-6">Start building your catalog by adding your first product.</p>
                    <Link href="/seller/products/new" className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl inline-flex items-center gap-2">
                        <Plus size={20} />
                        Add New Product
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="bg-gray-900 border border-gray-800 rounded-3xl p-5 hover:border-gray-700 transition-all group">
                            <div className="flex gap-4">
                                <div className="w-24 h-24 bg-black rounded-xl overflow-hidden relative border border-gray-800 flex-shrink-0">
                                    {product.image ? (
                                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-700">No Img</div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full mb-2 inline-block">
                                                {product.category}
                                            </span>
                                            <h3 className="text-white font-bold truncate pr-4">{product.name}</h3>
                                        </div>
                                        <button className="text-gray-500 hover:text-white">
                                            <MoreVertical size={18} />
                                        </button>
                                    </div>

                                    <div className="mt-3 flex items-end justify-between">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Price</p>
                                            <p className="text-lg font-bold text-white">₹{product.price}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 mb-1">Stock</p>
                                            <p className={`text-sm font-bold ${product.stock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {product.stock > 0 ? `${product.stock} Units` : 'Out of Stock'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Row */}
                            <div className="mt-5 pt-4 border-t border-gray-800 grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                                    <Tag size={14} className="text-purple-400" />
                                    <span>
                                        {product.discount > 0 ? `${product.discount}% Off` : 'No Offer'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400 text-xs font-medium justify-end">
                                    <Star size={14} className="text-yellow-400" />
                                    <span>{product.rating || 0} ({product.reviews || 0})</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2">
                                    <Edit size={14} /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl flex items-center justify-center"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </SellerLayout>
    );
}

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
                    <Search className="absolute left-4 top-3.5 text-secondary-text w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-surface border border-border rounded-2xl pl-12 pr-4 py-3 text-foreground focus:border-accent outline-none shadow-sm transition-all placeholder:text-secondary-text font-medium"
                    />
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button className="px-4 py-3 bg-surface border border-border rounded-2xl text-secondary-text hover:text-foreground font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-sm transition-all">
                        <Filter size={18} />
                        Filter
                    </button>
                    <Link href="/seller/products/new" className="px-6 py-3 bg-accent hover:bg-accent-hover text-white font-black rounded-2xl flex items-center gap-2 shadow-saas uppercase tracking-widest text-xs transition-all">
                        <Plus size={20} />
                        Add Product
                    </Link>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-24">
                    <div className="animate-spin w-10 h-10 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-secondary-text font-medium">Loading your inventory...</p>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-surface rounded-3xl border-2 border-border border-dashed shadow-sm">
                    <Box className="w-16 h-16 text-secondary/30 mx-auto mb-4" />
                    <h3 className="text-xl font-black text-foreground mb-2 tracking-tight">No Products Found</h3>
                    <p className="text-secondary-text mb-6 font-medium">Start building your catalog by adding your first product.</p>
                    <Link href="/seller/products/new" className="px-8 py-3 bg-accent hover:bg-accent-hover text-white font-black rounded-xl inline-flex items-center gap-2 shadow-saas uppercase tracking-widest text-xs">
                        <Plus size={20} />
                        Add New Product
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="bg-surface border border-border rounded-3xl p-5 hover:border-accent/30 hover:shadow-saas transition-all group">
                            <div className="flex gap-4">
                                <div className="w-24 h-24 bg-background rounded-xl overflow-hidden relative border border-border flex-shrink-0">
                                    {product.image ? (
                                        <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-secondary-text font-black text-[10px] uppercase">No Img</div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded-full mb-2 inline-block">
                                                {product.category}
                                            </span>
                                            <h3 className="text-foreground font-black truncate pr-4 text-sm group-hover:text-accent transition-colors">{product.name}</h3>
                                        </div>
                                        <button className="text-secondary-text hover:text-foreground">
                                            <MoreVertical size={18} />
                                        </button>
                                    </div>

                                    <div className="mt-3 flex items-end justify-between">
                                        <div>
                                            <p className="text-[10px] text-secondary-text mb-1 font-black uppercase tracking-widest">Price</p>
                                            <p className="text-lg font-black text-foreground">₹{product.price}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-secondary-text mb-1 font-black uppercase tracking-widest">Stock</p>
                                            <p className={`text-sm font-black ${product.stock > 0 ? 'text-foreground' : 'text-secondary-text opacity-50'}`}>
                                                {product.stock > 0 ? `${product.stock} Units` : 'Sold Out'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Row */}
                            <div className="mt-5 pt-4 border-t border-secondary grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 text-secondary-text text-[10px] font-black uppercase tracking-widest">
                                    <Tag size={14} className="text-accent" />
                                    <span>
                                        {product.discount > 0 ? `${product.discount}% Off` : 'Full Price'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-secondary-text text-[10px] font-black uppercase tracking-widest justify-end">
                                    <Star size={14} className="text-warning fill-warning" />
                                    <span>{product.rating || 0} ({product.reviews || 0})</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0">
                                <button className="flex-1 py-2 bg-secondary hover:bg-secondary/70 rounded-xl text-[10px] font-black text-foreground flex items-center justify-center gap-2 uppercase tracking-widest transition-all">
                                    <Edit size={14} /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl flex items-center justify-center transition-all"
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

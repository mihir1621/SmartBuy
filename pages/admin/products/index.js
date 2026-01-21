import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import {
    Edit3,
    Trash2,
    Plus,
    Search,
    Filter,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Eye,
    Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export async function getServerSideProps() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50, // For demo, listing first 50
        });
        return {
            props: {
                initialProducts: JSON.parse(JSON.stringify(products)),
            },
        };
    } catch (error) {
        console.error("Fetch products error:", error);
        return { props: { initialProducts: [] } };
    }
}

export default function AdminProducts({ initialProducts }) {
    const [products, setProducts] = useState(initialProducts);
    const [search, setSearch] = useState('');

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    setProducts(products.filter(p => p.id !== id));
                } else {
                    alert('Error deleting product');
                }
            } catch (err) {
                console.error(err);
                alert('Failed to delete');
            }
        }
    };

    return (
        <AdminLayout title="Product Management">
            <div className="space-y-6">
                {/* Actions Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-900/50 p-6 rounded-3xl border border-gray-800">
                    <div className="relative w-full sm:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search products by name, brand..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-gray-950 border border-gray-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-gray-200"
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 font-bold py-3.5 px-6 rounded-2xl border border-gray-700 transition-all">
                            <Filter size={18} />
                            Filter
                        </button>
                        <Link href="/admin/products/new" className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white hover:bg-gray-200 text-black font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-white/10 transition-all active:scale-95">
                            <Plus size={20} />
                            Add Product
                        </Link>
                    </div>
                </div>

                {/* Product Table */}
                <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-950/50 border-b border-gray-800">
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">Product</th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">Category</th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">Price</th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">Stock</th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">Rating</th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                <AnimatePresence>
                                    {filteredProducts.map((product) => (
                                        <motion.tr
                                            key={product.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-gray-800/30 transition-colors group"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-14 w-14 rounded-2xl overflow-hidden bg-gray-800 relative border border-gray-700 shadow-sm flex-shrink-0 group-hover:scale-110 transition-transform">
                                                        <Image
                                                            src={product.image}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white leading-tight group-hover:text-gray-300 transition-colors">{product.name}</p>
                                                        <p className="text-xs text-gray-500 mt-1 font-medium">{product.brand}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-[10px] font-bold uppercase border border-gray-700 tracking-wider">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="font-bold text-white">₹{product.price.toLocaleString()}</div>
                                                {product.discount > 0 && (
                                                    <div className="text-[10px] text-white font-bold">-{product.discount}% OFF</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-5">
                                                {product.inStock ? (
                                                    <div className="flex items-center gap-2 text-white">
                                                        <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                                                        <span className="text-xs font-bold uppercase">In Stock</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-gray-500">
                                                        <div className="w-2 h-2 rounded-full bg-gray-500 shadow-[0_0_8px_rgba(107,114,128,0.5)]" />
                                                        <span className="text-xs font-bold uppercase">Out of Stock</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-1 font-bold text-white">
                                                    <Star size={14} fill="currentColor" />
                                                    <span>{product.rating}</span>
                                                </div>
                                                <div className="text-[10px] text-gray-500 font-medium">{product.reviews} reviews</div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/product/${product.id}`} target="_blank" className="p-2.5 rounded-xl bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-all">
                                                        <Eye size={16} />
                                                    </Link>
                                                    <Link href={`/admin/products/edit/${product.id}`} className="p-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 hover:text-white transition-all">
                                                        <Edit3 size={16} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-6 border-t border-gray-800 flex items-center justify-between">
                        <p className="text-sm text-gray-500 font-medium">
                            Showing <span className="text-gray-300 font-bold">{filteredProducts.length}</span> of <span className="text-gray-300 font-bold">{products.length}</span> products
                        </p>
                        <div className="flex gap-2">
                            <button className="p-2 rounded-xl border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 transition-all disabled:opacity-30" disabled>
                                <ChevronLeft size={20} />
                            </button>
                            <button className="p-2 rounded-xl border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

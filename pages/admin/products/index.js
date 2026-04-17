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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface p-6 rounded-3xl border border-border shadow-sm">
                    <div className="relative w-full sm:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-text group-focus-within:text-accent transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, brand..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-background border border-border rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all text-foreground font-medium"
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-background hover:bg-secondary font-black text-[10px] uppercase tracking-widest py-3.5 px-6 rounded-2xl border border-border transition-all text-secondary-text hover:text-foreground">
                            <Filter size={18} />
                            Filter
                        </button>
                        <Link href="/admin/products/new" className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white font-black text-[10px] uppercase tracking-widest py-3.5 px-6 rounded-2xl shadow-saas transition-all active:scale-95 leading-none">
                            <Plus size={20} />
                            Add Product
                        </Link>
                    </div>
                </div>

                {/* Product Table */}
                <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-background/50 border-b border-border">
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary-text">Product</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary-text">Category</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary-text">Price</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary-text">Status</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary-text">Rating</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary-text text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                <AnimatePresence>
                                    {filteredProducts.map((product) => (
                                        <motion.tr
                                            key={product.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-background/50 transition-colors group"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-14 w-14 rounded-2xl overflow-hidden bg-background relative border border-border shadow-sm flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                                        <Image
                                                            src={product.image}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-foreground leading-tight group-hover:text-accent transition-colors tracking-tight">{product.name}</p>
                                                        <p className="text-[10px] text-secondary-text mt-1 font-black uppercase tracking-widest">{product.brand}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="px-3 py-1 bg-secondary text-secondary-text rounded-full text-[10px] font-black uppercase tracking-widest border border-border">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="font-black text-foreground">₹{product.price.toLocaleString()}</div>
                                                {product.discount > 0 && (
                                                    <div className="text-[10px] text-accent font-black">-{product.discount}% OFF</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-5">
                                                {product.inStock ? (
                                                    <div className="flex items-center gap-2 text-success">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">In Stock</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-error">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-error shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Out of Stock</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-1 font-black text-foreground text-sm">
                                                    <Star size={14} className="text-warning fill-warning" />
                                                    <span>{product.rating}</span>
                                                </div>
                                                <div className="text-[9px] text-secondary-text font-black uppercase tracking-widest mt-0.5">{product.reviews} reviews</div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/product/${product.id}`} target="_blank" className="p-2.5 rounded-xl bg-background text-secondary-text hover:text-accent hover:bg-accent/10 transition-all border border-border shadow-sm">
                                                        <Eye size={16} />
                                                    </Link>
                                                    <Link href={`/admin/products/edit/${product.id}`} className="p-2.5 rounded-xl bg-accent text-white hover:bg-accent-hover transition-all shadow-saas">
                                                        <Edit3 size={16} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="p-2.5 rounded-xl bg-error/10 text-error hover:bg-error hover:text-white transition-all border border-error/20"
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
                    <div className="px-6 py-6 border-t border-border flex items-center justify-between bg-background/30">
                        <p className="text-[10px] text-secondary-text font-black uppercase tracking-[0.2em]">
                            Displaying <span className="text-foreground">{filteredProducts.length}</span> of <span className="text-foreground">{products.length}</span> units
                        </p>
                        <div className="flex gap-2">
                            <button className="p-2.5 rounded-xl border border-border text-secondary-text hover:text-accent hover:bg-background transition-all disabled:opacity-30 shadow-sm" disabled>
                                <ChevronLeft size={20} />
                            </button>
                            <button className="p-2.5 rounded-xl border border-border text-secondary-text hover:text-accent hover:bg-background transition-all shadow-sm">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

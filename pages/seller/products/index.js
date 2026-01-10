import SellerLayout from '@/components/seller/SellerLayout';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Edit2, Trash2, Search, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function MyProducts() {
    const { data: session } = useSession();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            // Priority 1: Local Storage check
            const localProducts = localStorage.getItem('seller_products');
            if (localProducts) {
                setProducts(JSON.parse(localProducts));
            }

            // Always fetch fresh from API to sync
            const res = await fetch('/api/seller/products');
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
                // Sync to local storage
                localStorage.setItem('seller_products', JSON.stringify(data));
            }
        } catch (error) {
            console.error("Failed to load products", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        // Optimistic Update & LS Sync
        const updatedProducts = products.filter(p => p.id !== id);
        setProducts(updatedProducts);
        localStorage.setItem('seller_products', JSON.stringify(updatedProducts));

        try {
            const res = await fetch(`/api/seller/products/${id}`, { method: 'DELETE' });
            if (!res.ok) {
                // If API fails, maybe revert? Or just alert.
                // alert("Failed to delete from server");
            }
        } catch (error) {
            console.error("Error deleting product");
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <SellerLayout title="My Products">
            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search your products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                        />
                    </div>
                    <Link href="/seller/products/new" className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-orange-500/20">
                        <Plus size={20} />
                        Add Product
                    </Link>
                </div>

                {/* Products Table/List */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-orange-500" size={40} />
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20 bg-gray-900 rounded-3xl border border-gray-800">
                        <p className="text-gray-400 font-medium text-lg">No products found.</p>
                        <p className="text-gray-600">Start by adding your first product to list it on SmartBuy.</p>
                    </div>
                ) : (
                    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-800/50 text-gray-400 text-xs uppercase tracking-wider font-bold">
                                    <tr>
                                        <th className="p-4 pl-6">Product</th>
                                        <th className="p-4">Category</th>
                                        <th className="p-4">Price</th>
                                        <th className="p-4">Stock</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right pr-6">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {filteredProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-800/30 transition-colors group">
                                            <td className="p-4 pl-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gray-800 rounded-lg relative overflow-hidden flex-shrink-0 border border-gray-700">
                                                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white line-clamp-1">{product.name}</p>
                                                        <p className="text-xs text-gray-500">{product.brand}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-400 text-sm">{product.category}</td>
                                            <td className="p-4 text-white font-bold">₹{product.price.toLocaleString()}</td>
                                            <td className="p-4 text-gray-300">{product.stock}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${product.stock > 0 ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                                    }`}>
                                                    {product.stock > 0 ? 'Active' : 'Out of Stock'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right pr-6">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link href={`/seller/products/edit/${product.id}`} className="p-2 bg-gray-800 hover:bg-blue-600 hover:text-white rounded-lg text-gray-400 transition-colors">
                                                        <Edit2 size={16} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="p-2 bg-gray-800 hover:bg-red-600 hover:text-white rounded-lg text-gray-400 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </SellerLayout>
    );
}

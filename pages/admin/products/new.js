import AdminLayout from '@/components/admin/AdminLayout';
import ProductForm from '@/components/admin/ProductForm';
import { PackagePlus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NewProduct() {
    return (
        <AdminLayout title="Add New Product">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 flex items-center gap-4"
                >
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/10">
                        <PackagePlus size={28} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">Create New Product</h1>
                        <p className="text-gray-500 font-medium">Add a new item to your store catalog</p>
                    </div>
                </motion.div>

                <ProductForm />
            </div>
        </AdminLayout>
    );
}

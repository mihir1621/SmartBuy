import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import ProductForm from '@/components/admin/ProductForm';
import { prisma } from '@/lib/prisma';
import { Edit, Package } from 'lucide-react';
import { motion } from 'framer-motion';

export async function getServerSideProps({ params }) {
    const { id } = params;
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
        });

        if (!product) {
            return { notFound: true };
        }

        return {
            props: {
                initialProduct: JSON.parse(JSON.stringify(product)),
            },
        };
    } catch (error) {
        console.error("Database error:", error);
        return { notFound: true };
    }
}

export default function EditProduct({ initialProduct }) {
    return (
        <AdminLayout title={`Editing: ${initialProduct.name}`}>
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 flex items-center gap-4"
                >
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-500/10">
                        <Edit size={28} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">Edit Product</h1>
                        <p className="text-gray-500 font-medium">Update the details for ID: {initialProduct.id}</p>
                    </div>
                </motion.div>

                <ProductForm initialData={initialProduct} isEditing={true} />
            </div>
        </AdminLayout>
    );
}

import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import StoreNavbar from '@/components/StoreNavbar';
import Footer from '@/components/Footer';
import {
    ChevronLeft,
    Box,
    Truck,
    CheckCircle,
    Clock,
    MapPin,
    CreditCard,
    ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const statusSteps = [
    { status: 'PENDING', label: 'Order Placed', icon: Clock },
    { status: 'PROCESSING', label: 'Processing', icon: Box },
    { status: 'SHIPPED', label: 'Shipped', icon: Truck },
    { status: 'DELIVERED', label: 'Delivered', icon: CheckCircle },
];

export default function UserOrderDetails() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { id } = router.query;
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOrder = useCallback(async () => {
        try {
            const res = await fetch(`/api/orders/${id}`);
            const data = await res.json();
            if (res.ok) {
                setOrder(data);
            } else {
                console.error(data.error);
                router.push('/orders');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id, router]);

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/login');
        if (id) fetchOrder();
    }, [id, status, fetchOrder, router]);

    const handleDownloadInvoice = async () => {
        if (!order) return;

        const { default: jsPDF } = await import('jspdf');
        const { default: autoTable } = await import('jspdf-autotable');

        const doc = new jsPDF();

        // Header
        doc.setFontSize(22);
        doc.setTextColor(40);
        doc.text('SmartBuy', 14, 22);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text('123 Tech Park, Electronic City', 14, 30);
        doc.text('Bangalore, KA, 560100', 14, 35);
        doc.text('GSTIN: 29AAAAA0000A1Z5', 14, 40);

        doc.setFontSize(18);
        doc.setTextColor(40);
        doc.text('INVOICE', 150, 22);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Invoice No: INV-${order.id}${Date.now().toString().slice(-4)}`, 150, 30);
        doc.text(`Order ID: #ORD-${order.id}`, 150, 35);
        doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 150, 40);

        // Buyer Info
        doc.setFontSize(12);
        doc.setTextColor(40);
        doc.text('Bill To:', 14, 55);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(order.customerName, 14, 62);
        const addressLines = doc.splitTextToSize(order.shippingAddress || 'N/A', 80);
        doc.text(addressLines, 14, 67);

        // Payment Info
        doc.setFontSize(12);
        doc.setTextColor(40);
        doc.text('Payment Information:', 120, 55);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Method: ${order.paymentMethod === 'RAZORPAY' ? 'Online Payment' : order.paymentMethod}`, 120, 62);
        doc.text(`Status: ${order.paymentStatus}`, 120, 67);
        if (order.razorpayPaymentId) {
            doc.text(`Transaction ID: ${order.razorpayPaymentId}`, 120, 72);
        }

        // Items Table
        const tableData = order.items.map(item => [
            item.product?.name || 'Product',
            item.quantity,
            `INR ${item.price.toLocaleString()}`,
            `INR ${(item.price * item.quantity).toLocaleString()}`
        ]);

        autoTable(doc, {
            startY: 85,
            head: [['Product', 'Qty', 'Unit Price', 'Total']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [59, 130, 246] },
        });

        // Totals
        const finalY = doc.lastAutoTable.finalY + 10;
        const subtotal = order.totalAmount / 1.05;
        const tax = order.totalAmount - subtotal;

        doc.text(`Subtotal:`, 140, finalY);
        doc.text(`INR ${subtotal.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`, 195, finalY, { align: 'right' });

        doc.text(`GST (5%):`, 140, finalY + 7);
        doc.text(`INR ${tax.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`, 195, finalY + 7, { align: 'right' });

        doc.setFontSize(12);
        doc.setTextColor(40);
        doc.text(`Total Payable:`, 140, finalY + 16);
        doc.text(`INR ${order.totalAmount.toLocaleString()}`, 195, finalY + 16, { align: 'right' });

        // Policy
        doc.setFontSize(9);
        doc.setTextColor(150);
        const policyText = "Return, Refund, and Cancellation Policy: You can return items within 7 days of delivery. Refunds are processed within 3-5 business days. Cancellations are only allowed before the order is shipped.";
        const policyLines = doc.splitTextToSize(policyText, 180);
        doc.text(policyLines, 14, finalY + 40);

        doc.text('Thank you for shopping with SmartBuy!', 105, finalY + 70, { align: 'center' });

        doc.save(`Invoice_SmartBuy_ORD_${order.id}.pdf`);
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex flex-col">
            <StoreNavbar />
            <div className="flex-grow flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
            <Footer />
        </div>
    );

    if (!order) return null;

    const isCancelled = order.status === 'CANCELLED';
    const currentStatusIdx = statusSteps.findIndex(s => s.status === order.status);
    const progressWidth = isCancelled ? 0 : (currentStatusIdx === -1 ? 0 : (currentStatusIdx / (statusSteps.length - 1)) * 100);

    return (
        <div className="min-h-screen bg-black flex flex-col text-white">
            <Head>
                <title>Order Detail #ORD-{order.id} | SmartBuy</title>
            </Head>
            <StoreNavbar />

            <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full mb-20">
                {/* Breadcrumbs */}
                <button
                    onClick={() => router.push('/orders')}
                    className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold text-sm tracking-widest uppercase">My Orders</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Order Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-xl">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-10">
                                <div>
                                    <h1 className="text-3xl font-black mb-1 leading-tight tracking-tight">Order #ORD-{order.id}</h1>
                                    <p className="text-gray-500 font-medium">Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                                </div>
                                <div className="sm:text-right">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Amount</p>
                                    <p className="text-3xl font-black text-blue-500">₹{order.totalAmount.toLocaleString()}</p>
                                </div>
                            </div>

                            {/* Tracking Progress */}
                            {isCancelled ? (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                                        <ArrowRight size={24} className="rotate-45" />
                                    </div>
                                    <div>
                                        <h3 className="text-red-500 font-black uppercase tracking-widest text-sm">Order Cancelled</h3>
                                        <p className="text-gray-500 text-xs mt-1">This order was cancelled and is no longer being processed.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative pt-4 pb-8">
                                    <div className="absolute top-1/2 left-0 w-full h-1.5 bg-gray-800 -translate-y-1/2 rounded-full" />
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressWidth}%` }}
                                        transition={{ duration: 1.5, ease: "circOut" }}
                                        className="absolute top-1/2 left-0 h-1.5 bg-gradient-to-r from-blue-600 to-blue-400 -translate-y-1/2 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                    />
                                    <div className="relative flex justify-between items-center">
                                        {statusSteps.map((step, idx) => {
                                            const StepIcon = step.icon;
                                            const isCompleted = idx <= currentStatusIdx;
                                            const isActive = idx === currentStatusIdx;

                                            return (
                                                <div key={step.status} className="flex flex-col items-center">
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 border-4 ${isActive ? 'bg-blue-600 border-blue-400 scale-125 shadow-xl shadow-blue-500/40' :
                                                        isCompleted ? 'bg-blue-500 border-gray-900 shadow-lg' : 'bg-gray-800 border-gray-900'
                                                        } transition-all duration-700`}>
                                                        <StepIcon size={20} className={isCompleted ? 'text-white' : 'text-gray-500'} />
                                                    </div>
                                                    <p className={`mt-6 text-[10px] font-black uppercase tracking-widest text-center max-w-[80px] ${isCompleted ? 'text-blue-400' : 'text-gray-600'
                                                        }`}>{step.label}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Items */}
                        <section className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
                            <div className="p-8 border-b border-gray-800 bg-gray-950/20">
                                <h2 className="text-xl font-bold flex items-center gap-3">
                                    <Box size={24} className="text-blue-500" />
                                    Package Contents
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-800">
                                {order.items.map((item) => (
                                    <div key={item.id} className="p-8 flex flex-col sm:row gap-6 hover:bg-gray-800/10 transition-colors group">
                                        <div className="w-24 h-24 relative rounded-2xl overflow-hidden bg-gray-950 flex-shrink-0 border border-gray-800 shadow-lg group-hover:border-blue-500/30 transition-colors">
                                            <Image src={item.product?.image} alt={item.product?.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                        </div>
                                        <div className="flex-grow min-w-0 py-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-lg text-white truncate pr-4 group-hover:text-blue-400 transition-colors">{item.product?.name}</h3>
                                                <p className="font-black text-lg text-white">₹{(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-4 font-medium uppercase tracking-wider">{item.product?.category}</p>
                                            <div className="flex items-center gap-8 text-sm">
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <span className="font-bold text-[10px] uppercase tracking-widest text-gray-600">Quantity</span>
                                                    <span className="text-white font-mono">{item.quantity}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <span className="font-bold text-[10px] uppercase tracking-widest text-gray-600">Unit Price</span>
                                                    <span className="text-white font-mono">₹{item.price.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right: Shipping & Payment */}
                    <div className="space-y-8">
                        {/* Summary */}
                        <section className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-xl space-y-6">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Order Summary</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between text-gray-400 text-sm">
                                    <span>Subtotal</span>
                                    <span className="text-white font-bold">₹{order.totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-400 text-sm">
                                    <span>Shipping</span>
                                    <span className="text-emerald-500 font-bold uppercase text-[10px] tracking-widest">Free Delivery</span>
                                </div>
                                <div className="pt-4 border-t border-gray-800/50 flex justify-between items-center">
                                    <span className="text-base font-bold">Total Paid</span>
                                    <span className="text-2xl font-black text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">₹{order.totalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </section>

                        {/* Shipping */}
                        <section className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-xl space-y-6">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                                <MapPin size={14} className="text-blue-500" /> Delivery Address
                            </h2>
                            <div className="p-5 bg-gray-950/40 rounded-2xl border border-gray-800 text-sm leading-relaxed text-gray-300 font-medium">
                                {order.shippingAddress || 'Address details unavailable'}
                            </div>
                        </section>

                        {/* Payment */}
                        <section className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-xl space-y-6">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                                <CreditCard size={14} className="text-blue-500" /> Payment Information
                            </h2>
                            <div className="flex items-center gap-4 p-4 bg-gray-950/40 rounded-2xl border border-gray-800">
                                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                                    <CreditCard className="text-blue-500" size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-white">
                                        {order.paymentMethod === 'RAZORPAY' ? 'Online Payment' :
                                            order.paymentMethod === 'EMI' ? 'EMI / Buy Now Pay Later' :
                                                order.paymentMethod === 'COD' ? 'Cash on Delivery' :
                                                    order.paymentMethod}
                                    </p>
                                    <p className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${order.paymentStatus === 'PAID' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                        {order.paymentStatus}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <button
                            onClick={handleDownloadInvoice}
                            className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] shadow-lg hover:shadow-xl active:scale-95 duration-200"
                        >
                            Download Invoice <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

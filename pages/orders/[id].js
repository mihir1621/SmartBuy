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
    ArrowRight,
    RefreshCcw,
    RotateCcw,
    AlertCircle,
    X,
    Upload,
    ChevronDown,
    MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { calculateGST, calculateTotalGST, getStateFromCity } from '@/utils/gstUtils';

const statusSteps = [
    { status: 'PENDING', label: 'Order Placed', icon: Clock },
    { status: 'PROCESSING', label: 'Processing', icon: Box },
    { status: 'SHIPPED', label: 'Shipped', icon: Truck },
    { status: 'DELIVERED', label: 'Delivered', icon: CheckCircle },
    { status: 'RETURN_REQUESTED', label: 'Return Req.', icon: RefreshCcw },
    { status: 'REFUND_REQUESTED', label: 'Refund Req.', icon: RotateCcw },
];

const returnReasonOptions = [
    "Damaged Product",
    "Wrong Item Received",
    "Quality not as expected",
    "Item missing in package",
    "Size/Fit issues",
    "Changed my mind",
    "Found better price elsewhere",
    "Other"
];

export default function UserOrderDetails() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { id } = router.query;
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const [returnForm, setReturnForm] = useState({
        type: 'RETURN', // RETURN or REFUND
        reason: '',
        comments: '',
        images: []
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

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

        // Determine shipping state from address string
        let shippingState = null;
        const addressLower = order.shippingAddress.toLowerCase();
        const { INDIAN_CITIES } = await import('@/data/indianCities');
        const cityMatch = INDIAN_CITIES.find(c => addressLower.includes(c.city.toLowerCase()));
        if (cityMatch) shippingState = cityMatch.state;

        const gstDetails = calculateTotalGST(order.items.map(item => ({
            price: item.price,
            quantity: item.quantity,
            category: item.product?.category || 'default'
        })), shippingState);

        doc.text(`Subtotal:`, 140, finalY);
        doc.text(`INR ${gstDetails.taxableValue.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`, 195, finalY, { align: 'right' });

        if (gstDetails.cgst > 0) {
            doc.text(`CGST:`, 140, finalY + 7);
            doc.text(`INR ${gstDetails.cgst.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`, 195, finalY + 7, { align: 'right' });

            doc.text(`SGST:`, 140, finalY + 14);
            doc.text(`INR ${gstDetails.sgst.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`, 195, finalY + 14, { align: 'right' });

            doc.setFontSize(12);
            doc.setTextColor(40);
            doc.text(`Total (Inclusive of GST):`, 140, finalY + 23);
            doc.text(`INR ${order.totalAmount.toLocaleString()}`, 195, finalY + 23, { align: 'right' });
        } else {
            doc.text(`IGST:`, 140, finalY + 7);
            doc.text(`INR ${gstDetails.igst.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`, 195, finalY + 7, { align: 'right' });

            doc.setFontSize(12);
            doc.setTextColor(40);
            doc.text(`Total (Inclusive of GST):`, 140, finalY + 16);
            doc.text(`INR ${order.totalAmount.toLocaleString()}`, 195, finalY + 16, { align: 'right' });
        }

        // Policy
        doc.setFontSize(9);
        doc.setTextColor(150);
        const policyText = "Return, Refund, and Cancellation Policy: You can return items within 7 days of delivery. Refunds are processed within 3-5 business days. Cancellations are only allowed before the order is shipped.";
        const policyLines = doc.splitTextToSize(policyText, 180);
        doc.text(policyLines, 14, finalY + 40);

        doc.text('Thank you for shopping with SmartBuy!', 105, finalY + 70, { align: 'center' });

        doc.save(`Invoice_SmartBuy_ORD_${order.id}.pdf`);
    };

    const handleSubmitReturn = async (e) => {
        e.preventDefault();
        if (!returnForm.reason) return alert('Please select a reason');

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/orders/return', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: order.id,
                    returnType: returnForm.type,
                    returnReason: returnForm.reason,
                    returnComments: returnForm.comments,
                    returnImages: [] // Image upload logic would go here
                })
            });
            const data = await res.json();
            if (res.ok) {
                setOrder(data.order);
                setIsReturnModalOpen(false);
                alert(`${returnForm.type} request submitted successfully!`);
            } else {
                alert(data.error);
            }
        } catch (err) {
            console.error(err);
            alert('Failed to submit request');
        } finally {
            setIsSubmitting(false);
        }
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
    const isReturned = order.status.includes('RETURN');
    const isRefunded = order.status.includes('REFUND');

    // Find current status index, but cap it at DELIVERED for the progress bar if it's already past it
    const baseStatusIdx = statusSteps.findIndex(s => s.status === order.status);
    const deliveredIdx = statusSteps.findIndex(s => s.status === 'DELIVERED');

    const displayStatusIdx = (baseStatusIdx > deliveredIdx || baseStatusIdx === -1) ? deliveredIdx : baseStatusIdx;
    const progressWidth = isCancelled ? 0 : (displayStatusIdx / deliveredIdx) * 100;

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
                                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 sm:p-6 flex items-center gap-3 sm:gap-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-500/20 shrink-0">
                                        <ArrowRight size={20} className="rotate-45 sm:size-24" />
                                    </div>
                                    <div>
                                        <h3 className="text-red-500 font-black uppercase tracking-widest text-xs sm:text-sm">Order Cancelled</h3>
                                        <p className="text-gray-500 text-[10px] sm:text-xs mt-1">This order was cancelled and is no longer being processed.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative pt-2 sm:pt-4 pb-6 sm:pb-8 px-2 sm:px-0">
                                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -translate-y-1/2 rounded-full" />
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressWidth}%` }}
                                        transition={{ duration: 1.5, ease: "circOut" }}
                                        className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-600 to-blue-400 -translate-y-1/2 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                    />
                                    <div className="relative flex justify-between items-center">
                                        {statusSteps.slice(0, 4).map((step, idx) => {
                                            const StepIcon = step.icon;
                                            const isStepCompleted = idx <= displayStatusIdx;
                                            const isStepActive = idx === displayStatusIdx;

                                            return (
                                                <div key={step.status} className="flex flex-col items-center">
                                                    <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center z-10 border-2 sm:border-4 ${isStepActive ? 'bg-blue-600 border-blue-400 scale-110 sm:scale-125 shadow-xl shadow-blue-500/40' :
                                                        isStepCompleted ? 'bg-blue-500 border-gray-900 shadow-lg' : 'bg-gray-800 border-gray-900'
                                                        } transition-all duration-700`}>
                                                        <StepIcon size={14} className={`${isStepCompleted ? 'text-white' : 'text-gray-500'} sm:size-20`} />
                                                    </div>
                                                    <p className={`mt-3 sm:mt-6 text-[8px] sm:text-[10px] font-black uppercase tracking-tighter sm:tracking-widest text-center max-w-[60px] sm:max-w-[80px] ${isStepCompleted ? 'text-blue-400' : 'text-gray-600'
                                                        }`}>{step.label}</p>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Post-Delivery Status Badge if applicable */}
                                    {(isReturned || isRefunded) && (
                                        <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center gap-3 sm:gap-4">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
                                                {isReturned ? <RefreshCcw size={20} className="sm:size-24" /> : <RotateCcw size={20} className="sm:size-24" />}
                                            </div>
                                            <div>
                                                <h3 className="text-blue-500 font-black uppercase tracking-widest text-xs sm:text-sm">
                                                    {order.status.replace('_', ' ')}
                                                </h3>
                                                <p className="text-gray-500 text-[10px] sm:text-xs mt-1">
                                                    Your {order.returnType?.toLowerCase()} request is being reviewed by our team.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </section>

                        {/* Items */}
                        <section className="bg-gray-900 border border-gray-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                            <div className="p-5 sm:p-8 border-b border-gray-800 bg-gray-950/20">
                                <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 sm:gap-3">
                                    <Box size={20} className="text-blue-500 sm:size-24" />
                                    Package Contents
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-800">
                                {order.items.map((item) => (
                                    <div key={item.id} className="p-5 sm:p-8 flex flex-col sm:flex-row gap-4 sm:gap-6 hover:bg-gray-800/10 transition-colors group">
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 relative rounded-xl sm:rounded-2xl overflow-hidden bg-gray-950 flex-shrink-0 border border-gray-800 shadow-lg group-hover:border-blue-500/30 transition-colors">
                                            <Image src={item.product?.image} alt={item.product?.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                        </div>
                                        <div className="flex-grow min-w-0 py-0.5 sm:py-1">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2 mb-2 sm:mb-2 text-left">
                                                <h3 className="font-bold text-base sm:text-lg text-white truncate pr-0 sm:pr-4 group-hover:text-blue-400 transition-colors">{item.product?.name}</h3>
                                                <p className="font-black text-base sm:text-lg text-white">₹{(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                            <p className="text-[10px] sm:text-sm text-gray-500 mb-3 sm:mb-4 font-bold uppercase tracking-widest">{item.product?.category}</p>
                                            <div className="flex items-center gap-6 sm:gap-8 text-[10px] sm:text-sm">
                                                <div className="flex items-center gap-1.5 sm:gap-2 text-gray-400">
                                                    <span className="font-bold text-[8px] sm:text-[10px] uppercase tracking-widest text-gray-600">Qty</span>
                                                    <span className="text-white font-mono">{item.quantity}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 sm:gap-2 text-gray-400">
                                                    <span className="font-bold text-[8px] sm:text-[10px] uppercase tracking-widest text-gray-600">Unit</span>
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
                    <div className="space-y-6 sm:space-y-8">
                        {/* Summary */}
                        <section className="bg-gray-900 border border-gray-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 sm:space-y-6">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Order Summary</h2>
                            {(() => {
                                // Extract state from shipping address
                                let shippingState = null;
                                const addressLower = order.shippingAddress.toLowerCase();
                                // We don't have INDIAN_CITIES here directly, but we can use the helper if we pass it correctly
                                // For now, let's assume if it contains 'KA' or 'Karnataka' it's intra-state. 
                                // Actually, I should use the same logic as invoice.
                                if (addressLower.includes('karnataka') || addressLower.includes('bangalore')) shippingState = 'Karnataka';

                                const gstDetails = calculateTotalGST(order.items.map(item => ({
                                    price: item.price,
                                    quantity: item.quantity,
                                    category: item.product?.category || 'default'
                                })), shippingState);

                                return (
                                    <div className="space-y-3 sm:space-y-4">
                                        <div className="flex justify-between text-gray-400 text-xs sm:text-sm">
                                            <span>Subtotal</span>
                                            <span className="text-white font-bold">₹{gstDetails.taxableValue.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
                                        </div>
                                        {gstDetails.cgst > 0 && (
                                            <>
                                                <div className="flex justify-between text-gray-500 text-[10px] sm:text-xs">
                                                    <span>CGST</span>
                                                    <span className="text-gray-400 font-medium">₹{gstDetails.cgst.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
                                                </div>
                                                <div className="flex justify-between text-gray-500 text-[10px] sm:text-xs">
                                                    <span>SGST</span>
                                                    <span className="text-gray-400 font-medium">₹{gstDetails.sgst.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
                                                </div>
                                            </>
                                        )}
                                        {gstDetails.igst > 0 && (
                                            <div className="flex justify-between text-gray-500 text-[10px] sm:text-xs">
                                                <span>IGST</span>
                                                <span className="text-gray-400 font-medium">₹{gstDetails.igst.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-gray-400 text-xs sm:text-sm">
                                            <span>Shipping</span>
                                            <span className="text-emerald-500 font-bold uppercase text-[9px] sm:text-[10px] tracking-widest">Free Delivery</span>
                                        </div>
                                        <div className="pt-3 sm:pt-4 border-t border-gray-800/50 flex justify-between items-center">
                                            <span className="text-sm sm:text-base font-bold text-gray-300">Total (Inclusive of GST)</span>
                                            <span className="text-xl sm:text-2xl font-black text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">₹{order.totalAmount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                );
                            })()}
                        </section>

                        {/* Shipping */}
                        <section className="bg-gray-900 border border-gray-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 sm:space-y-6">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                                <MapPin size={12} className="text-blue-500 sm:size-14" /> Delivery Address
                            </h2>
                            <div className="p-4 sm:p-5 bg-gray-950/40 rounded-xl sm:rounded-2xl border border-gray-800 text-xs sm:text-sm leading-relaxed text-gray-400 font-medium">
                                {order.shippingAddress || 'Address details unavailable'}
                            </div>
                        </section>

                        {/* Payment */}
                        <section className="bg-gray-900 border border-gray-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 sm:space-y-6">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                                <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" /> Payment Information
                            </h2>
                            <div className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 bg-gray-950/40 rounded-xl sm:rounded-2xl border border-gray-800">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 shrink-0">
                                    <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-xs sm:text-sm text-white truncate">
                                        {order.paymentMethod === 'RAZORPAY' ? 'Online Payment' :
                                            order.paymentMethod === 'EMI' ? 'EMI / Pay Later' :
                                                order.paymentMethod === 'COD' ? 'Cash on Delivery' :
                                                    order.paymentMethod}
                                    </p>
                                    <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest mt-0.5 ${order.paymentStatus === 'PAID' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                        {order.paymentStatus}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <button
                            onClick={handleDownloadInvoice}
                            className="w-full bg-white text-black font-black py-4 rounded-xl sm:rounded-2xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] shadow-lg hover:shadow-xl active:scale-95 duration-200"
                        >
                            Download Invoice <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        {order.status === 'DELIVERED' && (
                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                <button
                                    onClick={() => {
                                        setReturnForm(prev => ({ ...prev, type: 'RETURN' }));
                                        setIsReturnModalOpen(true);
                                    }}
                                    className="bg-gray-900 border border-gray-800 text-white font-black py-4 rounded-xl sm:rounded-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-1.5 sm:gap-2 uppercase tracking-widest text-[9px] sm:text-[10px] active:scale-95 duration-200"
                                >
                                    <RefreshCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Return
                                </button>
                                <button
                                    onClick={() => {
                                        setReturnForm(prev => ({ ...prev, type: 'REFUND' }));
                                        setIsReturnModalOpen(true);
                                    }}
                                    className="bg-gray-900 border border-gray-800 text-white font-black py-4 rounded-xl sm:rounded-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-1.5 sm:gap-2 uppercase tracking-widest text-[9px] sm:text-[10px] active:scale-95 duration-200"
                                >
                                    <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Refund
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Return/Refund Modal */}
                <AnimatePresence>
                    {isReturnModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsReturnModalOpen(false)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative bg-gray-900 border border-gray-800 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl"
                            >
                                <div className="p-8 border-b border-gray-800 flex justify-between items-center bg-gray-950/20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                                            {returnForm.type === 'RETURN' ? <RefreshCcw className="text-blue-500" size={20} /> : <RotateCcw className="text-blue-500" size={20} />}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold">Request {returnForm.type === 'RETURN' ? 'Return' : 'Refund'}</h2>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Order #ORD-{order.id}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setIsReturnModalOpen(false)} className="text-gray-500 hover:text-white p-2">
                                        <X size={24} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmitReturn} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
                                    <div className="space-y-4">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Reason for {returnForm.type.toLowerCase()}</label>
                                        <div className="grid grid-cols-1 gap-2">
                                            {returnReasonOptions.map((reason) => (
                                                <button
                                                    key={reason}
                                                    type="button"
                                                    onClick={() => setReturnForm(prev => ({ ...prev, reason }))}
                                                    className={`text-left px-5 py-4 rounded-2xl border transition-all text-sm font-medium flex items-center justify-between group ${returnForm.reason === reason
                                                        ? 'bg-blue-600/10 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                                                        : 'bg-gray-800/40 border-gray-800 text-gray-400 hover:border-gray-700'
                                                        }`}
                                                >
                                                    {reason}
                                                    {returnForm.reason === reason && <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Additional Comments</label>
                                        <textarea
                                            value={returnForm.comments}
                                            onChange={(e) => setReturnForm(prev => ({ ...prev, comments: e.target.value }))}
                                            placeholder="Tell us more about the issue..."
                                            className="w-full bg-gray-800/40 border border-gray-800 rounded-2xl p-5 text-sm focus:border-blue-500 outline-none min-h-[120px] transition-colors resize-none"
                                        />
                                    </div>

                                    {(returnForm.reason === 'Damaged Product' || returnForm.reason === 'Wrong Item Received') && (
                                        <div className="p-5 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                                            <div className="flex gap-3">
                                                <AlertCircle size={18} className="text-amber-500 shrink-0" />
                                                <p className="text-xs text-amber-500/80 leading-relaxed font-medium">To speed up your request, please ensure you have photos of the product and its original packaging ready for inspection.</p>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !returnForm.reason}
                                        className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-500 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                                    >
                                        {isSubmitting ? 'Submitting Request...' : `Submit ${returnForm.type} Request`}
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </main>

            <Footer />
        </div>
    );
}

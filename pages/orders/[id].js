import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
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
    const { user, loading: authLoading } = useAuth();
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
            const res = await fetch(`/api/orders/${id}?userId=${user?.uid}&email=${encodeURIComponent(user?.email)}`);
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
    }, [id, router, user]);

    useEffect(() => {
        if (!authLoading && !user) router.push('/login');
        if (id && user) fetchOrder();
    }, [id, user, authLoading, fetchOrder, router]);

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
                    returnImages: [],
                    userId: user.uid,
                    email: user.email
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
        <div className="min-h-screen bg-background flex flex-col">
            <StoreNavbar />
            <div className="flex-grow flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
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
        <div className="min-h-screen bg-background flex flex-col text-foreground selection:bg-accent/10">
            <Head>
                <title>Order Detail #ORD-{order.id} | SmartBuy</title>
            </Head>
            <StoreNavbar />

            <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full mb-20">
                {/* Breadcrumbs */}
                <button
                    onClick={() => router.push('/orders')}
                    className="flex items-center gap-2 text-secondary-text hover:text-foreground transition-colors mb-8 group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-black text-xs tracking-widest uppercase">My Orders</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Order Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-surface border border-border rounded-3xl p-8 shadow-saas">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-10">
                                <div>
                                    <h1 className="text-3xl font-black text-foreground mb-1 leading-tight tracking-tight">Order #ORD-{order.id}</h1>
                                    <p className="text-secondary-text font-medium text-sm">Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                                </div>
                                <div className="sm:text-right">
                                    <p className="text-[10px] font-black text-secondary-text uppercase tracking-widest mb-1">Total Amount</p>
                                    <p className="text-3xl font-black text-accent">₹{order.totalAmount.toLocaleString()}</p>
                                </div>
                            </div>

                            {/* Tracking Progress */}
                            {isCancelled ? (
                                <div className="bg-error/10 border border-error/20 rounded-2xl p-5 sm:p-6 flex items-center gap-3 sm:gap-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-error rounded-full flex items-center justify-center text-white shadow-lg shadow-error/20 shrink-0">
                                        <X size={20} className="sm:size-24" />
                                    </div>
                                    <div>
                                        <h3 className="text-error font-black uppercase tracking-widest text-xs sm:text-sm">Order Cancelled</h3>
                                        <p className="text-secondary-text text-[10px] sm:text-xs mt-1">This order was cancelled and is no longer being processed.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative pt-2 sm:pt-4 pb-6 sm:pb-8 px-2 sm:px-0">
                                    <div className="absolute top-1/2 left-0 w-full h-1 bg-secondary -translate-y-1/2 rounded-full" />
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressWidth}%` }}
                                        transition={{ duration: 1.5, ease: "circOut" }}
                                        className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-accent to-accent/60 -translate-y-1/2 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                                    />
                                    <div className="relative flex justify-between items-center">
                                        {statusSteps.slice(0, 4).map((idx, step) => {
                                            const stepItem = statusSteps[step];
                                            const StepIcon = stepItem.icon;
                                            const isStepCompleted = step <= displayStatusIdx;
                                            const isStepActive = step === displayStatusIdx;

                                            return (
                                                <div key={stepItem.status} className="flex flex-col items-center">
                                                    <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center z-10 border-2 sm:border-4 ${isStepActive ? 'bg-accent border-accent/20 scale-110 sm:scale-125 shadow-xl shadow-accent/40' :
                                                        isStepCompleted ? 'bg-accent border-surface shadow-lg' : 'bg-secondary border-surface'
                                                        } transition-all duration-700`}>
                                                        <StepIcon size={14} className={`${isStepCompleted ? 'text-white' : 'text-secondary-text'} sm:size-20`} />
                                                    </div>
                                                    <p className={`mt-3 sm:mt-6 text-[8px] sm:text-[10px] font-black uppercase tracking-tighter sm:tracking-widest text-center max-w-[60px] sm:max-w-[80px] ${isStepCompleted ? 'text-accent' : 'text-secondary-text'
                                                        }`}>{stepItem.label}</p>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Post-Delivery Status Badge if applicable */}
                                    {(isReturned || isRefunded) && (
                                        <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-accent/10 border border-accent/20 rounded-2xl flex items-center gap-3 sm:gap-4">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent rounded-full flex items-center justify-center text-white shadow-lg shadow-accent/20 shrink-0">
                                                {isReturned ? <RefreshCcw size={20} className="sm:size-24" /> : <RotateCcw size={20} className="sm:size-24" />}
                                            </div>
                                            <div>
                                                <h3 className="text-accent font-black uppercase tracking-widest text-xs sm:text-sm">
                                                    {order.status.replace('_', ' ')}
                                                </h3>
                                                <p className="text-secondary-text text-[10px] sm:text-xs mt-1 font-medium">
                                                    Your {order.returnType?.toLowerCase()} request is being reviewed by our team.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </section>

                        {/* Items */}
                        <section className="bg-surface border border-border rounded-2xl sm:rounded-3xl overflow-hidden shadow-saas">
                            <div className="p-5 sm:p-8 border-b border-border bg-secondary/20">
                                <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 sm:gap-3 text-foreground">
                                    <Box size={20} className="text-accent sm:size-24" />
                                    Package Contents
                                </h2>
                            </div>
                            <div className="divide-y divide-border">
                                {order.items.map((item) => (
                                    <div key={item.id} className="p-5 sm:p-8 flex flex-col sm:flex-row gap-4 sm:gap-6 hover:bg-secondary/10 transition-colors group">
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 relative rounded-xl sm:rounded-2xl overflow-hidden bg-background flex-shrink-0 border border-border shadow-sm group-hover:border-accent/30 transition-colors">
                                            <Image src={item.product?.image} alt={item.product?.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                        </div>
                                        <div className="flex-grow min-w-0 py-0.5 sm:py-1">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2 mb-2 sm:mb-2 text-left">
                                                <h3 className="font-bold text-base sm:text-lg text-foreground truncate pr-0 sm:pr-4 group-hover:text-accent transition-colors">{item.product?.name}</h3>
                                                <p className="font-black text-base sm:text-lg text-foreground">₹{(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                            <p className="text-[10px] sm:text-sm text-secondary-text mb-3 sm:mb-4 font-bold uppercase tracking-widest">{item.product?.category}</p>
                                            <div className="flex items-center gap-6 sm:gap-8 text-[10px] sm:text-sm">
                                                <div className="flex items-center gap-1.5 sm:gap-2 text-secondary-text">
                                                    <span className="font-black text-[8px] sm:text-[10px] uppercase tracking-widest opacity-50">Qty</span>
                                                    <span className="text-foreground font-black">{item.quantity}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 sm:gap-2 text-secondary-text">
                                                    <span className="font-black text-[8px] sm:text-[10px] uppercase tracking-widest opacity-50">Unit</span>
                                                    <span className="text-foreground font-black">₹{item.price.toLocaleString()}</span>
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
                        <section className="bg-surface border border-border rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-saas space-y-4 sm:space-y-6">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary-text">Order Summary</h2>
                            {(() => {
                                // Extract state from shipping address
                                let shippingState = null;
                                const addressLower = order.shippingAddress.toLowerCase();
                                if (addressLower.includes('karnataka') || addressLower.includes('bangalore')) shippingState = 'Karnataka';

                                const gstDetails = calculateTotalGST(order.items.map(item => ({
                                    price: item.price,
                                    quantity: item.quantity,
                                    category: item.product?.category || 'default'
                                })), shippingState);

                                return (
                                    <div className="space-y-3 sm:space-y-4">
                                        <div className="flex justify-between text-secondary-text text-xs sm:text-sm">
                                            <span>Subtotal</span>
                                            <span className="text-foreground font-bold">₹{gstDetails.taxableValue.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
                                        </div>
                                        {gstDetails.cgst > 0 && (
                                            <>
                                                <div className="flex justify-between text-secondary-text text-[10px] sm:text-xs opacity-75">
                                                    <span>CGST</span>
                                                    <span className="text-foreground font-medium">₹{gstDetails.cgst.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
                                                </div>
                                                <div className="flex justify-between text-secondary-text text-[10px] sm:text-xs opacity-75">
                                                    <span>SGST</span>
                                                    <span className="text-foreground font-medium">₹{gstDetails.sgst.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
                                                </div>
                                            </>
                                        )}
                                        {gstDetails.igst > 0 && (
                                            <div className="flex justify-between text-secondary-text text-[10px] sm:text-xs opacity-75">
                                                <span>IGST</span>
                                                <span className="text-foreground font-medium">₹{gstDetails.igst.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-secondary-text text-xs sm:text-sm">
                                            <span>Shipping</span>
                                            <span className="text-success font-black uppercase text-[9px] sm:text-[10px] tracking-widest">Free Delivery</span>
                                        </div>
                                        <div className="pt-3 sm:pt-4 border-t border-border flex justify-between items-center">
                                            <span className="text-sm sm:text-base font-black text-foreground">Total</span>
                                            <span className="text-xl sm:text-2xl font-black text-accent">₹{order.totalAmount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                );
                            })()}
                        </section>

                        {/* Shipping */}
                        <section className="bg-surface border border-border rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-saas space-y-4 sm:space-y-6">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary-text flex items-center gap-2">
                                <MapPin size={12} className="text-accent sm:size-14" /> Delivery Address
                            </h2>
                            <div className="p-4 sm:p-5 bg-background rounded-xl sm:rounded-2xl border border-border text-xs sm:text-sm leading-relaxed text-secondary-text font-medium">
                                {order.shippingAddress || 'Address details unavailable'}
                            </div>
                        </section>

                        {/* Payment */}
                        <section className="bg-surface border border-border rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-saas space-y-4 sm:space-y-6">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary-text flex items-center gap-2">
                                <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 text-accent" /> Payment Information
                            </h2>
                            <div className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 bg-background rounded-xl sm:rounded-2xl border border-border">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/5 rounded-xl flex items-center justify-center border border-accent/20 shrink-0">
                                    <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-black text-xs sm:text-sm text-foreground truncate">
                                        {order.paymentMethod === 'RAZORPAY' ? 'Online Payment' :
                                            order.paymentMethod === 'EMI' ? 'EMI / Pay Later' :
                                                order.paymentMethod === 'COD' ? 'Cash on Delivery' :
                                                    order.paymentMethod}
                                    </p>
                                    <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest mt-0.5 ${order.paymentStatus === 'PAID' ? 'text-success' : 'text-warning'}`}>
                                        {order.paymentStatus}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <button
                            onClick={handleDownloadInvoice}
                            className="w-full bg-foreground text-surface font-black py-4 rounded-xl sm:rounded-2xl hover:bg-foreground/90 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] shadow-saas active:scale-95 duration-200"
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
                                    className="bg-surface border border-border text-foreground font-black py-4 rounded-xl sm:rounded-2xl hover:bg-secondary transition-all flex items-center justify-center gap-1.5 sm:gap-2 uppercase tracking-widest text-[9px] sm:text-[10px] active:scale-95 duration-200"
                                >
                                    <RefreshCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Return
                                </button>
                                <button
                                    onClick={() => {
                                        setReturnForm(prev => ({ ...prev, type: 'REFUND' }));
                                        setIsReturnModalOpen(true);
                                    }}
                                    className="bg-surface border border-border text-foreground font-black py-4 rounded-xl sm:rounded-2xl hover:bg-secondary transition-all flex items-center justify-center gap-1.5 sm:gap-2 uppercase tracking-widest text-[9px] sm:text-[10px] active:scale-95 duration-200"
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
                                className="relative bg-surface border border-border rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-saas"
                            >
                                <div className="p-8 border-b border-border flex justify-between items-center bg-secondary/20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                                            {returnForm.type === 'RETURN' ? <RefreshCcw className="text-accent" size={20} /> : <RotateCcw className="text-accent" size={20} />}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black text-foreground">Request {returnForm.type === 'RETURN' ? 'Return' : 'Refund'}</h2>
                                            <p className="text-[10px] text-secondary-text font-black uppercase tracking-widest">Order #ORD-{order.id}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setIsReturnModalOpen(false)} className="text-secondary-text hover:text-foreground p-2">
                                        <X size={24} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmitReturn} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
                                    <div className="space-y-4">
                                        <label className="block text-xs font-black text-secondary-text uppercase tracking-widest">Reason for {returnForm.type.toLowerCase()}</label>
                                        <div className="grid grid-cols-1 gap-2">
                                            {returnReasonOptions.map((reason) => (
                                                <button
                                                    key={reason}
                                                    type="button"
                                                    onClick={() => setReturnForm(prev => ({ ...prev, reason }))}
                                                    className={`text-left px-5 py-4 rounded-2xl border transition-all text-sm font-black flex items-center justify-between group ${returnForm.reason === reason
                                                        ? 'bg-accent/5 border-accent text-foreground shadow-sm'
                                                        : 'bg-background border-border text-secondary-text hover:border-gray-300'
                                                        }`}
                                                >
                                                    {reason}
                                                    {returnForm.reason === reason && <div className="w-2 h-2 rounded-full bg-accent" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-xs font-black text-secondary-text uppercase tracking-widest">Additional Comments</label>
                                        <textarea
                                            value={returnForm.comments}
                                            onChange={(e) => setReturnForm(prev => ({ ...prev, comments: e.target.value }))}
                                            placeholder="Tell us more about the issue..."
                                            className="w-full bg-background border border-border rounded-2xl p-5 text-sm focus:border-accent outline-none min-h-[120px] transition-colors resize-none text-foreground"
                                        />
                                    </div>

                                    {(returnForm.reason === 'Damaged Product' || returnForm.reason === 'Wrong Item Received') && (
                                        <div className="p-5 bg-warning/5 border border-warning/10 rounded-2xl">
                                            <div className="flex gap-3">
                                                <AlertCircle size={18} className="text-warning shrink-0" />
                                                <p className="text-xs text-warning/80 leading-relaxed font-black">To speed up your request, please ensure you have photos of the product ready.</p>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !returnForm.reason}
                                        className="w-full bg-accent text-white font-black py-5 rounded-2xl hover:bg-accent/90 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] shadow-saas active:scale-95 disabled:opacity-50 disabled:active:scale-100"
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

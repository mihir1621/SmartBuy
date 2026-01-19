import { useState, useEffect, useCallback } from "react";
import { Star, ThumbsUp, MessageSquare, Plus, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function ProductReviews({ product: initialProduct }) {
    const { user } = useAuth();
    const [product, setProduct] = useState(initialProduct);
    const [activeTab, setActiveTab] = useState("reviews");
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/reviews?productId=${initialProduct.id}`);
            if (res.ok) {
                const data = await res.json();
                setReviews(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [initialProduct.id]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please login to write a review");
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: initialProduct.id,
                    rating: newReview.rating,
                    comment: newReview.comment,
                    userId: user.uid,
                    userEmail: user.email,
                    userName: user.name || user.displayName
                })
            });

            if (res.ok) {
                const data = await res.json();
                setReviews([data, ...reviews]);
                setShowForm(false);
                setNewReview({ rating: 5, comment: "" });

                // Optionally update local product rating count
                setProduct(prev => ({
                    ...prev,
                    reviews: prev.reviews + 1
                }));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000); // seconds

        if (diff < 60) return "Just now";
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <section className="mt-16 bg-gray-900 rounded-2xl shadow-sm border border-gray-800 overflow-hidden" id="reviews">
            {/* Tabs Header */}
            <div className="flex border-b border-gray-800">
                <button
                    onClick={() => setActiveTab("reviews")}
                    className={`flex-1 py-4 text-center font-bold text-sm uppercase tracking-wider border-b-2 transition-colors ${activeTab === "reviews" ? "border-white text-white" : "border-transparent text-gray-500 hover:text-gray-300"}`}
                >
                    Reviews ({reviews.length})
                </button>
                <button
                    onClick={() => setActiveTab("details")}
                    className={`flex-1 py-4 text-center font-bold text-sm uppercase tracking-wider border-b-2 transition-colors ${activeTab === "details" ? "border-white text-white" : "border-transparent text-gray-500 hover:text-gray-300"}`}
                >
                    Product Details
                </button>
            </div>

            <div className="p-6 md:p-8">
                <AnimatePresence mode="wait">
                    {activeTab === "reviews" ? (
                        <motion.div
                            key="reviews"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="max-w-4xl mx-auto"
                        >
                            {/* Summary Header */}
                            <div className="flex flex-col md:flex-row gap-8 items-center justify-between mb-10 pb-10 border-b border-gray-800">
                                <div className="flex items-center gap-6">
                                    <div className="text-center">
                                        <div className="text-5xl font-bold text-white mb-1">{product.rating}</div>
                                        <div className="flex text-yellow-400 gap-1 text-sm justify-center mb-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-current" : "text-gray-600"}`} />
                                            ))}
                                        </div>
                                        <div className="text-sm text-gray-500">{reviews.length} Verification</div>
                                    </div>
                                    <div className="h-16 w-px bg-gray-800 hidden md:block"></div>
                                    <div className="flex-1 min-w-[200px] space-y-1 hidden sm:block">
                                        {[5, 4, 3, 2, 1].map((star) => {
                                            const count = reviews.filter(r => r.rating === star).length;
                                            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                                            return (
                                                <div key={star} className="flex items-center gap-2 text-xs text-gray-400">
                                                    <span className="w-3">{star}</span>
                                                    <Star className="w-3 h-3 text-gray-600" />
                                                    <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percentage}%` }}></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowForm(!showForm)}
                                    className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
                                >
                                    <MessageSquare className="w-4 h-4" /> Write a Review
                                </button>
                            </div>

                            {/* Review Form */}
                            <AnimatePresence>
                                {showForm && (
                                    <motion.form
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        onSubmit={handleSubmit}
                                        className="bg-gray-800 p-6 rounded-xl mb-8 overflow-hidden"
                                    >
                                        <h3 className="font-bold text-lg mb-4 text-white">Share your thoughts</h3>
                                        <div className="space-y-4">
                                            {!user && (
                                                <p className="text-yellow-500 text-sm">Please sign in to submit a review.</p>
                                            )}
                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-gray-300">Rating</label>
                                                <div className="flex gap-2">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            disabled={!user}
                                                            onClick={() => setNewReview({ ...newReview, rating: star })}
                                                            className={`p-1 ${newReview.rating >= star ? 'text-yellow-400' : 'text-gray-600'}`}
                                                        >
                                                            <Star className="w-6 h-6 fill-current" />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-gray-300">Review</label>
                                                <textarea required disabled={!user || submitting} rows="3" className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500 disabled:opacity-50" placeholder="What did you like or dislike?" value={newReview.comment} onChange={e => setNewReview({ ...newReview, comment: e.target.value })}></textarea>
                                            </div>
                                            <div className="flex justify-end gap-3">
                                                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                                                <button type="submit" disabled={!user || submitting} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-700 flex items-center gap-2">
                                                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                                    Submit Review
                                                </button>
                                            </div>
                                        </div>
                                    </motion.form>
                                )}
                            </AnimatePresence>

                            {/* Review List */}
                            <div className="space-y-6">
                                {loading ? (
                                    <div className="flex justify-center py-10">
                                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                    </div>
                                ) : reviews.length === 0 ? (
                                    <div className="text-center py-10 text-gray-500">
                                        No reviews yet. Be the first to review!
                                    </div>
                                ) : (
                                    reviews.map((review) => (
                                        <div key={review.id} className="border-b border-gray-800 last:border-0 pb-6 last:pb-0">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-bold text-white">{review.user?.name || 'Anonymous'}</span>
                                                        <span className="text-xs text-green-400 bg-green-900/30 border border-green-900 px-2 py-0.5 rounded-full font-medium">Verified Buyer</span>
                                                    </div>
                                                    <div className="flex text-yellow-400 text-xs">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-current" : "text-gray-600"}`} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <span className="text-xs text-gray-500">{formatDate(review.createdAt)}</span>
                                            </div>
                                            <p className="text-gray-400 text-sm leading-relaxed mb-3">{review.comment}</p>
                                            <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-400 transition-colors group">
                                                <ThumbsUp className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                                Helpful
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="details"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="prose max-w-none text-gray-400"
                        >
                            <p>{product.description}</p>
                            <ul className="list-disc pl-5 space-y-2 mt-4 text-gray-400">
                                <li>Premium quality material ensures durability and comfort.</li>
                                <li>Designed with modern aesthetics in mind.</li>
                                <li>Suitable for various occasions and settings.</li>
                                <li>Easy to clean and maintain.</li>
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}

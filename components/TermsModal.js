import { useRef, useEffect } from "react";
import { X, Calendar, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TermsModal({ isOpen, onClose, policy }) {
    if (!isOpen || !policy) return null;

    // Map icons based on policy type
    const getIcon = () => {
        switch (policy.type) {
            case 'delivery': return <Truck className="w-6 h-6 text-blue-400" />;
            case 'warranty': return <ShieldCheck className="w-6 h-6 text-green-400" />;
            case 'return': return <RotateCcw className="w-6 h-6 text-orange-400" />;
            default: return null;
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-gray-900 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-gray-800"
                >
                    {/* Header */}
                    <div className="bg-gray-900 text-white p-4 flex items-center justify-between border-b border-gray-800">
                        <div className="flex items-center gap-2">
                            {getIcon()}
                            <h2 className="text-lg font-bold">{policy.title}</h2>
                        </div>
                        <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Terms & Conditions</h3>
                        <p className="text-gray-300 leading-relaxed text-sm">
                            {policy.content}
                        </p>
                    </div>

                    <div className="p-4 bg-gray-800/50 border-t border-gray-800">
                        <button
                            onClick={onClose}
                            className="w-full bg-white text-black font-bold py-2.5 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                            Got it
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

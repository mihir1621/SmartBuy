import { useRef, useEffect } from "react";
import { X, Calendar, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TermsModal({ isOpen, onClose, policy }) {
    if (!isOpen || !policy) return null;

    // Map icons based on policy type
    const getIcon = () => {
        switch (policy.type) {
            case 'delivery': return <Truck className="w-6 h-6 text-accent" />;
            case 'warranty': return <ShieldCheck className="w-6 h-6 text-success" />;
            case 'return': return <RotateCcw className="w-6 h-6 text-warning" />;
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
                    className="bg-background rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-border"
                >
                    {/* Header */}
                    <div className="bg-surface text-foreground p-4 flex items-center justify-between border-b border-border">
                        <div className="flex items-center gap-2">
                            {getIcon()}
                            <h2 className="text-lg font-bold">{policy.title}</h2>
                        </div>
                        <button onClick={onClose} className="p-1 hover:bg-secondary rounded-full transition-colors">
                            <X className="w-5 h-5 text-secondary-text" />
                        </button>
                    </div>

                    <div className="p-6">
                        <h3 className="text-sm font-bold text-secondary-text uppercase tracking-wider mb-2">Terms & Conditions</h3>
                        <p className="text-foreground leading-relaxed text-sm">
                            {policy.content}
                        </p>
                    </div>

                    <div className="p-4 bg-surface border-t border-border">
                        <button
                            onClick={onClose}
                            className="w-full bg-accent text-white font-bold py-2.5 rounded-lg hover:bg-accent-hover transition-all text-sm shadow-saas"
                        >
                            Got it
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

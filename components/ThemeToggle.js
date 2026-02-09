import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch by waiting for mount
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`group relative p-2 rounded-full transition-all duration-500 active:scale-90 overflow-hidden border border-border shadow-sm
                ${theme === 'dark' ? 'bg-gray-900 border-white/10' : 'bg-blue-50 border-blue-100'}
            `}
            aria-label="Toggle Theme"
        >
            <div className="relative w-5 h-5 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {theme === 'dark' ? (
                        <motion.div
                            key="moon"
                            initial={{ y: 20, rotate: -40, opacity: 0 }}
                            animate={{ y: 0, rotate: 0, opacity: 1 }}
                            exit={{ y: -20, rotate: 40, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            className="absolute"
                        >
                            <Moon className="w-4 h-4 text-blue-200 fill-blue-200/20" />
                            <motion.div
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: 2, times: [0, 0.5, 1] }}
                                className="absolute -top-1 -right-0.5 w-0.5 h-0.5 bg-white rounded-full"
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sun"
                            initial={{ y: 20, rotate: 40, opacity: 0 }}
                            animate={{ y: 0, rotate: 0, opacity: 1 }}
                            exit={{ y: -20, rotate: -40, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            className="absolute"
                        >
                            <Sun className="w-4 h-4 text-yellow-500 fill-yellow-500/20" />
                            {[...Array(2)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.5 }}
                                    className="absolute inset-0 border border-yellow-400/20 rounded-full"
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </button>
    );
}

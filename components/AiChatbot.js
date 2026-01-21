
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Bot, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatbotFlow } from '../hooks/useChatbotFlow';

// Internal component for the dynamic AI face
const AiAssistantIcon = () => {
    const [look, setLook] = useState({ x: 0, y: 0 });
    const [isBlinking, setIsBlinking] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const blinkLoop = () => {
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 150);
            setTimeout(blinkLoop, 2000 + Math.random() * 4000);
        };
        const timeoutId = setTimeout(blinkLoop, 2000);
        return () => clearTimeout(timeoutId);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const dx = e.clientX - centerX;
            const dy = e.clientY - centerY;

            // Calculate angle and clamp distance for "looking" effect
            const angle = Math.atan2(dy, dx);
            const dist = Math.min(Math.sqrt(dx * dx + dy * dy), 500);
            const intensity = dist / 400;

            setLook({
                x: Math.cos(angle) * intensity,
                y: Math.sin(angle) * intensity
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div ref={ref} className="w-16 h-16 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-xl">
                <defs>
                    <linearGradient id="botGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f8fafc" />
                        <stop offset="100%" stopColor="#94a3b8" />
                    </linearGradient>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                <motion.g
                    animate={{
                        x: look.x * 15,
                        y: look.y * 15,
                        rotateX: -look.y * 25,
                        rotateY: look.x * 25
                    }}
                    transition={{ type: "spring", stiffness: 120, damping: 15 }}
                >
                    {/* Antenna */}
                    <line x1="50" y1="15" x2="50" y2="0" stroke="#94a3b8" strokeWidth="3" />
                    <circle cx="50" cy="0" r="4" fill="#ef4444" />

                    {/* Head Body - Circular */}
                    <circle cx="50" cy="50" r="35" fill="url(#botGrad)" />

                    {/* Face Screen */}
                    <rect x="24" y="35" width="52" height="30" rx="14" fill="#1e293b" />

                    {/* Eyes - Bigger & Blinking */}
                    <motion.g
                        animate={{
                            x: look.x * 20,
                            y: look.y * 15,
                            scaleY: isBlinking ? 0.1 : 1
                        }}
                        style={{ originX: "50%", originY: "50%" }}
                    >
                        {/* Left Eye */}
                        <circle cx="38" cy="50" r="7.5" fill="#3b82f6" filter="url(#glow)" />
                        <circle cx="38" cy="50" r="3" fill="white" />

                        {/* Right Eye */}
                        <circle cx="62" cy="50" r="7.5" fill="#3b82f6" filter="url(#glow)" />
                        <circle cx="62" cy="50" r="3" fill="white" />
                    </motion.g>
                </motion.g>
            </svg>
        </div>
    );
};

export default function AiChatbot({
    onSearch,
    onCategorySelect,
    onPriceSelect,
    onGenderSelect,
    onBrandSelect,
    categories = [],
    brands = [],
    genders = [],
    globalMaxPrice = 100000,
    resetFilters
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm your AI Shopping Assistant. Looking for something specific? Try 'Running shoes under 5000' or 'Red party dress'.", isBot: true }
    ]);
    const [input, setInput] = useState("");
    const [typingKey, setTypingKey] = useState(0);
    const messagesEndRef = useRef(null);

    const { currentOptions, handleManualInput } = useChatbotFlow({
        onSearch,
        onCategorySelect,
        onPriceSelect,
        onGenderSelect,
        onBrandSelect,
        setMessages
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Loop the typing animation
    useEffect(() => {
        const interval = setInterval(() => {
            setTypingKey(prev => prev + 1);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const processQuery = (rawInput) => {
        // 1. Reset previous filters to start fresh
        if (resetFilters) resetFilters();

        const lowerInput = rawInput.toLowerCase();
        let residue = rawInput; // Preserve original case for search query

        const detectedFilters = [];

        // Helper to remove found keywords (case-insensitive) from residue
        const removeFromResidue = (text) => {
            if (!text) return;
            // Escape regex special chars
            const escaped = text.replace(/[.*+?^${ }()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escaped, 'gi');
            residue = residue.replace(regex, ' ');
        };

        // --- Price Extraction ---
        // Matches: "under 500", "below 1000", "< 2000", "max 500"
        const priceMatch = lowerInput.match(/(?:under|below|less than|<|max|budget)\s?₹?(\d+)(?:k)?/);
        if (priceMatch) {
            let price = parseInt(priceMatch[1]);
            if (lowerInput.includes(priceMatch[1] + 'k')) price *= 1000; // Handle "5k"

            onPriceSelect([0, price]);
            detectedFilters.push(`Price < ₹${price}`);

            // Remove the matched price string from residue using the exact match from regex
            removeFromResidue(priceMatch[0]);
        }

        // --- Category Extraction ---
        // Tries to find the longest matching category first to avoid partial matches
        const sortedCategories = [...categories].sort((a, b) => b.length - a.length);
        const foundCategory = sortedCategories.find(c =>
            c !== 'All' && lowerInput.includes(c.toLowerCase())
        );

        if (foundCategory) {
            onCategorySelect(foundCategory);
            detectedFilters.push(`Category: ${foundCategory}`);
            removeFromResidue(foundCategory);
        }

        // --- Gender Extraction ---
        const foundGender = genders.find(g =>
            g !== 'All' && lowerInput.includes(g.toLowerCase())
        );
        if (foundGender) {
            onGenderSelect(foundGender);
            detectedFilters.push(`Gender: ${foundGender}`);
            removeFromResidue(foundGender);
        }

        // --- Brand Extraction ---
        const foundBrand = brands.find(b =>
            lowerInput.includes(b.toLowerCase())
        );
        if (foundBrand) {
            onBrandSelect((prev) => [...prev, foundBrand]);
            detectedFilters.push(`Brand: ${foundBrand}`);
            removeFromResidue(foundBrand);
        }

        // --- Keywords/Search Query ---
        // Remove filler words (case-insensitive)
        const fillerWords = ["i want", "i need", "show me", "looking for", "find", "items", "products", "with", "in", "for", "a", "an", "the"];
        fillerWords.forEach(word => removeFromResidue(word));

        // Clean up whitespace
        const cleanSearch = residue.trim().replace(/\s+/g, ' ');

        if (cleanSearch.length > 1) {
            onSearch(cleanSearch);
            detectedFilters.push(`Keywords: "${cleanSearch}"`);
        } else {
            // If no specific keywords, clear search
            onSearch("");
        }

        return detectedFilters;
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // User Message
        const userText = input;
        setMessages(prev => [...prev, { text: userText, isBot: false }]);
        setInput("");

        // Hide options on manual input
        if (handleManualInput) handleManualInput();

        // Simulate AI "Thinking" brief delay
        setTimeout(() => {
            const filters = processQuery(userText);

            let botResponse = "";
            if (filters.length > 0) {
                botResponse = `OK! I've updated the filters: ${filters.join(', ')}.`;
            } else {
                botResponse = "I couldn't detect specific filters, so I've searched for exactly what you typed.";
                onSearch(userText); // Fallback to raw search
            }

            setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
        }, 600);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none font-sans">

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="pointer-events-auto w-72 sm:w-80 rounded-3xl shadow-2xl mb-4 overflow-hidden flex flex-col bg-slate-900/95 backdrop-blur-xl border border-white/10"
                        style={{ maxHeight: '450px', boxShadow: '0 20px 50px -12px rgba(0, 0, 0, 0.5)' }}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 p-4 flex items-center justify-between shadow-lg relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/10 opacity-20 pointer-events-none" />
                            <div className="flex items-center gap-3 text-white relative z-10">
                                <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <Sparkles size={18} className="text-yellow-300" />
                                </div>
                                <div>
                                    <span className="font-bold text-base tracking-wide block">SmartBuy AI</span>
                                    <span className="text-[10px] text-blue-100 uppercase tracking-wider font-medium opacity-80">Assistant</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-all relative z-10"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div
                            className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent h-64 overscroll-contain [&::-webkit-scrollbar]:hidden"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div
                                        className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-md backdrop-blur-sm ${msg.isBot
                                            ? 'bg-slate-800/80 text-slate-100 rounded-tl-none border border-white/5'
                                            : 'bg-gradient-to-br from-blue-600 to-violet-600 text-white rounded-tr-none'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}

                            {/* Section Options */}
                            {currentOptions && currentOptions.length > 0 && (
                                <div className="pb-2 flex flex-col gap-2 items-end animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    {currentOptions.map((option, idx) => (
                                        <button
                                            key={idx}
                                            onClick={option.onClick}
                                            className="group flex items-center gap-2 flex-row-reverse bg-slate-800/50 hover:bg-slate-700/80 text-blue-300 hover:text-blue-200 text-xs px-4 py-2.5 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all text-right max-w-[90%] backdrop-blur-md shadow-sm"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:bg-blue-400 transition-colors" />
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-3 bg-slate-950/30 border-t border-white/5 flex gap-2 backdrop-blur-md">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask anything..."
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all shadow-inner"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                                    <Bot size={16} className="text-slate-400" />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 active:scale-95"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>



            {/* Floating Toggle Button */}
            <div className="relative flex items-center">
                <AnimatePresence mode="wait">
                    {!isOpen && (
                        <motion.div
                            key={typingKey}
                            initial={{ opacity: 0, x: 10, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 5, scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            style={{ transformOrigin: "right center" }}
                            className="absolute right-full mr-4 bg-slate-900/90 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl whitespace-nowrap font-medium text-sm border border-white/10 flex items-center gap-2"
                        >
                            <span className="text-blue-400">
                                <Sparkles size={14} />
                            </span>
                            <div className="flex">
                                {"Looking for something?".split("").map((char, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ opacity: 0, y: 2 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.03, delay: i * 0.03 }}
                                    >
                                        {char === " " ? "\u00A0" : char}
                                    </motion.span>
                                ))}
                            </div>
                            <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-900/90 transform rotate-45 border-r border-t border-white/10"></div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="pointer-events-auto text-white transition-all flex items-center justify-center group"
                >
                    {isOpen ? (
                        <div className="bg-gradient-to-r from-blue-600 to-violet-600 p-4 rounded-full shadow-2xl border-2 border-white/10">
                            <X size={24} />
                        </div>
                    ) : (
                        <AiAssistantIcon />
                    )}
                </motion.button>
            </div>
        </div>
    );
}

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Menu, X, User, Camera } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function StoreNavbar({ onSearch }) {
    const { setIsCartOpen, cartCount } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Smart Simulation: effective guessing based on filename
            const name = file.name.toLowerCase();
            let detectedTerm = "Fashion"; // Default fallback

            if (name.includes('shoe') || name.includes('sneaker') || name.includes('boot')) detectedTerm = "Shoes";
            else if (name.includes('watch') || name.includes('time')) detectedTerm = "Watch";
            else if (name.includes('phone') || name.includes('mobile') || name.includes('iphone')) detectedTerm = "Mobiles";
            else if (name.includes('laptop') || name.includes('macbook') || name.includes('computer')) detectedTerm = "Laptop";
            else if (name.includes('bag') || name.includes('purse')) detectedTerm = "Bag";
            else if (name.includes('dre') || name.includes('saree') || name.includes('kurta')) detectedTerm = "Dress";
            else if (name.includes('headphone') || name.includes('speaker') || name.includes('audio')) detectedTerm = "Audio";

            setTimeout(() => {
                // Automatically trigger search without popup
                if (onSearch) {
                    setSearchQuery(detectedTerm);
                    onSearch(detectedTerm);
                }

                // Reset file input to allow re-uploading the same file
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }, 300);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (onSearch) {
            onSearch(query);
        }
    };

    return (
        <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
                            <span className="text-white font-bold text-xl">S</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight text-gray-900 hidden sm:block">SmartBuy</span>
                    </Link>

                    {/* Search Bar - Amazon Style */}
                    <div className="flex-1 max-w-2xl hidden md:flex items-center">
                        <div className="relative w-full">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearch}
                                placeholder="Search for products, brands and more..."
                                className="w-full pl-4 pr-24 py-2.5 bg-gray-100 border-transparent focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-lg transition-all outline-none text-sm"
                            />
                            <div className="absolute right-0 top-0 h-full flex items-center pr-2 gap-1">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                    title="Search by Image"
                                >
                                    <Camera className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                                    <Search className="w-5 h-5" />
                                </button>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Mobile Search Toggle */}
                        <button className="md:hidden p-2 text-gray-600 hover:text-gray-900">
                            <Search className="w-5 h-5" />
                        </button>

                        {/* Account */}
                        <Link href="/login" className="hidden sm:flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                            <User className="w-5 h-5" />
                            <span className="text-sm font-medium hidden lg:block">Account</span>
                        </Link>

                        {/* Cart */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-2 text-gray-900 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            <span className="text-sm font-medium hidden lg:block">Cart</span>
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 sm:top-0 sm:right-auto sm:left-6 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </motion.button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
                    >
                        <div className="px-4 py-3 space-y-1">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearch}
                                placeholder="Search..."
                                className="w-full px-4 py-2 mb-4 bg-gray-100 rounded-lg outline-none text-sm"
                            />
                            <Link href="/" className="block px-3 py-3 text-base font-medium text-gray-900 rounded-md hover:bg-gray-50">Home</Link>
                            <Link href="#" className="block px-3 py-3 text-base font-medium text-gray-600 rounded-md hover:bg-gray-50">Deals</Link>
                            <Link href="#" className="block px-3 py-3 text-base font-medium text-gray-600 rounded-md hover:bg-gray-50">Categories</Link>
                            <Link href="#" className="block px-3 py-3 text-base font-medium text-gray-600 rounded-md hover:bg-gray-50">Orders</Link>
                            <Link href="/login" className="block px-3 py-3 text-base font-medium text-blue-600 rounded-md hover:bg-gray-50">Sign In</Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Secondary Nav - Categories (Amazon Style) */}
            <div className="hidden md:block bg-gray-900 text-white text-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-6 h-10 overflow-x-auto no-scrollbar">
                        <button className="flex items-center gap-1 font-bold hover:text-gray-300 whitespace-nowrap">
                            <Menu className="w-4 h-4" /> All
                        </button>
                        <Link href="#" className="hover:text-gray-300 whitespace-nowrap">Today's Deals</Link>
                        <Link href="#" className="hover:text-gray-300 whitespace-nowrap">Customer Service</Link>
                        <Link href="#" className="hover:text-gray-300 whitespace-nowrap">Registry</Link>
                        <Link href="#" className="hover:text-gray-300 whitespace-nowrap">Gift Cards</Link>
                        <Link href="#" className="hover:text-gray-300 whitespace-nowrap">Sell</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

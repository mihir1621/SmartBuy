// StoreNavbar Component
import Link from 'next/link';
import { ShoppingBag, Search, Menu, X, User, Camera, Heart, MapPin, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useLocation } from '@/context/LocationContext';
import { motion, AnimatePresence } from 'framer-motion';
import AnnouncementBar from './AnnouncementBar';
import { useState, useEffect, useRef } from 'react';
import { INDIAN_CITIES } from '@/data/indianCities';

export default function StoreNavbar({ onSearch }) {
    const { setIsCartOpen, cartCount } = useCart();
    const { wishlist } = useWishlist();
    const { location, detectLocation, updateLocation } = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [locationSearch, setLocationSearch] = useState("");
    const [isDetecting, setIsDetecting] = useState(false);
    const fileInputRef = useRef(null);

    // Sort cities alphabetically by name
    const sortedCities = [...INDIAN_CITIES].sort((a, b) => a.city.localeCompare(b.city));

    const filteredCities = locationSearch.trim() === ""
        ? []
        : sortedCities.filter(item => {
            const searchTerm = locationSearch.toLowerCase();
            return (
                item.city.toLowerCase().includes(searchTerm) ||
                item.district.toLowerCase().includes(searchTerm) ||
                item.state.toLowerCase().includes(searchTerm) ||
                (item.aliases && item.aliases.some(alias => alias.toLowerCase().includes(searchTerm)))
            );
        });

    const handleCitySelect = (cityItem) => {
        updateLocation({
            ...location,
            city: cityItem.city,
            state: cityItem.state,
            district: cityItem.district,
            isDetected: false
        });
        setShowLocationModal(false);
        setLocationSearch("");
    };

    const handleDetectLocation = async () => {
        setIsDetecting(true);
        await detectLocation();
        setIsDetecting(false);
        setShowLocationModal(false);
    };

    const handleImageUpload = (e) => {
        // Placeholder for image upload logic
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        if (onSearch) onSearch(e.target.value);
    };

    return (
        <>
            <AnnouncementBar />
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

                        {/* Location Selector (Desktop) */}
                        <div className="hidden lg:flex flex-col justify-center ml-2 cursor-pointer hover:border border-white p-1 rounded" onClick={() => setShowLocationModal(true)}>
                            <span className="text-gray-500 text-xs leading-none">Deliver to</span>
                            <div className="flex items-center gap-1 font-bold text-gray-900 text-sm leading-none">
                                <MapPin className="w-3.5 h-3.5" />
                                <span className="truncate max-w-[120px]">{location?.city || "Select Location"}</span>
                            </div>
                        </div>

                        {/* Search Bar - Amazon Style */}
                        <div className="flex-1 max-w-2xl hidden md:flex items-center">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    placeholder="Search for products, brands and more..."
                                    className="w-full pl-4 pr-24 py-2.5 bg-gray-100 border-transparent focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-lg transition-all outline-none text-sm text-gray-900 placeholder-gray-500"
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

                            {/* Wishlist */}
                            <Link href="/wishlist" className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2">
                                <Heart className="w-5 h-5" />
                                <span className="text-sm font-medium hidden lg:block">Wishlist</span>
                                {wishlist.length > 0 && (
                                    <span className="absolute top-1.5 right-1.5 sm:left-6 sm:right-auto w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                                )}
                            </Link>

                            {/* Cart */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsCartOpen(true)}
                                className="p-2 text-gray-900 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2"
                            >
                                <div className="relative">
                                    <ShoppingBag className="w-5 h-5" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-white">
                                            {cartCount}
                                        </span>
                                    )}
                                </div>
                                <span className="text-sm font-medium hidden lg:block">Cart</span>
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
                                    className="w-full px-4 py-2 mb-4 bg-gray-100 rounded-lg outline-none text-sm text-gray-900 placeholder-gray-500"
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

            {/* Location Selection Modal */}
            <AnimatePresence>
                {showLocationModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowLocationModal(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]"
                        >
                            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-gray-100 flex-shrink-0">
                                <h3 className="font-bold text-lg text-gray-800">Choose your location</h3>
                                <button onClick={() => setShowLocationModal(false)} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="p-6 flex-grow flex flex-col overflow-hidden">
                                <p className="text-sm text-gray-500 mb-4">
                                    Select a delivery location to see product availability and delivery options.
                                </p>

                                <button
                                    onClick={handleDetectLocation}
                                    disabled={isDetecting}
                                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors mb-4 flex-shrink-0 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isDetecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
                                    {isDetecting ? "Detecting..." : "Detect my location"}
                                </button>

                                <div className="relative mb-4 flex-shrink-0">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">OR</span>
                                    </div>
                                </div>

                                {/* City Search Input */}
                                <div className="mb-4 flex-shrink-0">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search for your city..."
                                            value={locationSearch}
                                            onChange={(e) => setLocationSearch(e.target.value)}
                                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-2 overflow-y-auto pr-1">
                                    {locationSearch.trim() === "" ? (
                                        <div className="text-center py-8">
                                            <p className="text-gray-400 text-sm italic">Enter your city, district, or state to search</p>
                                        </div>
                                    ) : filteredCities.length > 0 ? (
                                        filteredCities.map((item, index) => (
                                            <button
                                                key={`${item.city}-${item.state}-${index}`}
                                                onClick={() => handleCitySelect(item)}
                                                className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200 group"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <span className="block font-bold text-gray-900 text-sm group-hover:text-blue-700">{item.city}</span>
                                                        <span className="block text-xs text-gray-500 mt-0.5">
                                                            {item.city} &gt;&gt; {item.district} &gt;&gt; {item.state}
                                                        </span>
                                                    </div>
                                                    {item.aliases && (
                                                        <span className="text-[10px] text-gray-400 bg-white border border-gray-200 px-1.5 py-0.5 rounded ml-2 whitespace-nowrap">
                                                            Also: {item.aliases.join(', ')}
                                                        </span>
                                                    )}
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="text-center py-4 text-gray-500 text-sm">
                                            No cities found matching "{locationSearch}"
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}

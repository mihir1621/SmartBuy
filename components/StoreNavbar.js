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
import { useRouter } from 'next/router';
import {
    Grid,
    Laptop,
    Smartphone,
    Headphones,
    Shirt,
    User as UserIcon,
    Home as HomeIcon,
    Cpu,
    Tablet,
    Watch,
    BadgeInfo,
    ChevronRight
} from 'lucide-react';

export default function StoreNavbar({ onSearch, categories = [], selectedCategory, setSelectedCategory }) {
    const { setIsCartOpen, cartCount } = useCart();
    const { wishlist } = useWishlist();
    const { location, detectLocation, updateLocation } = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [locationSearch, setLocationSearch] = useState("");
    const [isDetecting, setIsDetecting] = useState(false);
    const fileInputRef = useRef(null);
    const router = useRouter();

    const drawerCategories = [
        { name: "All", icon: Grid },
        { name: "Laptops", icon: Laptop },
        { name: "Smartphones", icon: Smartphone },
        { name: "Audio", icon: Headphones },
        { name: "Menswear", icon: Shirt },
        { name: "Womenswear", icon: UserIcon },
        { name: "Home", icon: HomeIcon },
        { name: "Electronics", icon: Cpu },
        { name: "Tablets", icon: Tablet },
        { name: "Watch", icon: Watch },
        { name: "Accessories", icon: ShoppingBag },
    ];

    const handleCategoryClick = (categoryName) => {
        setIsSidebarOpen(false);
        router.push(`/?category=${encodeURIComponent(categoryName)}`);
    };

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

            <nav className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14 gap-4">
                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center transition-all group-hover:scale-105">
                                <span className="text-white font-bold text-lg">S</span>
                            </div>
                            <span className="font-bold text-xl tracking-tight text-gray-900 hidden sm:block">SmartBuy</span>
                        </Link>

                        {/* Location Selector (Desktop) */}
                        <div className="hidden lg:flex flex-col justify-center ml-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-lg transition-all border border-transparent hover:border-gray-200" onClick={() => setShowLocationModal(true)}>
                            <span className="text-gray-400 text-[8px] uppercase font-bold leading-none mb-0.5">Deliver to</span>
                            <div className="flex items-center gap-1 font-semibold text-gray-900 text-xs leading-none">
                                <MapPin className="w-3 h-3 text-blue-600" />
                                <span className="truncate max-w-[80px]">{location?.city || "Select"}</span>
                            </div>
                        </div>




                        {/* Mobile Search Bar integrated in header */}
                        <div className="flex-1 max-w-xl md:hidden px-2">
                            <div className="relative w-full group">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    placeholder="Search..."
                                    className="w-full pl-3 pr-8 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm outline-none shadow-sm"
                                />
                                <div className="absolute right-0 top-0 h-full flex items-center pr-1.5 gap-1">
                                    <button className="text-gray-400 p-1">
                                        <Search className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Search Bar - Compact Amazon Style */}
                        <div className="flex-1 max-w-xl hidden md:flex items-center">
                            <div className="relative w-full group">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    placeholder="Search products..."
                                    className="w-full pl-3 pr-20 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm outline-none shadow-sm"
                                />
                                <div className="absolute right-0 top-0 h-full flex items-center pr-1.5 gap-1">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                                        title="Search by image"
                                    >
                                        <Camera className="w-4 h-4" />
                                    </button>
                                    <button className="bg-gray-900 text-white p-1.5 rounded-md hover:bg-blue-600 transition-all">
                                        <Search className="w-4 h-4" />
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
                        <div className="flex items-center gap-1.5">
                            <Link href="/login" className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-all flex items-center gap-1.5">
                                <User className="w-4 h-4" />
                                <span className="text-xs font-semibold hidden lg:block">Sign In</span>
                            </Link>

                            <Link href="/wishlist" className="relative p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-all flex items-center gap-1.5">
                                <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'text-red-500 fill-red-500 animate-pulse' : ''}`} />
                                <span className="text-xs font-semibold hidden lg:block">Wishlist</span>
                            </Link>

                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsCartOpen(true)}
                                className="p-1.5 px-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-all flex items-center gap-1.5"
                            >
                                <div className="relative">
                                    <ShoppingBag className="w-4 h-4" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-600 text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs font-bold hidden lg:block">Cart</span>
                            </motion.button>
                        </div>
                    </div>
                </div>



                {/* Compact Sub-nav */}
                <div className="bg-white border-t border-gray-100 py-1.5 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsSidebarOpen(true)}
                                className="flex items-center justify-center p-1.5 bg-gray-50 text-gray-900 rounded-md hover:bg-gray-200 transition-all shrink-0 border border-gray-200"
                                title="All Categories"
                            >
                                <Menu className="w-4 h-4" />
                            </motion.button>


                            <div className="h-4 w-[1px] bg-gray-200 shrink-0 mx-1"></div>

                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-3 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-all ${selectedCategory === category
                                        ? "bg-blue-50 text-blue-600 border border-blue-100"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Side Drawer Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-gray-900/30 backdrop-blur-[2px] z-[100]"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed inset-y-0 left-0 w-full max-w-[280px] bg-white z-[110] shadow-xl flex flex-col overflow-hidden"
                        >
                            <div className="bg-gray-900 text-white px-5 py-6 flex flex-col justify-end shrink-0 relative">
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="absolute top-3 right-3 p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                        <User className="w-5 h-5 text-gray-300" />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">Welcome</p>
                                        <p className="font-bold text-base leading-none">Guest Account</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto py-4">
                                {/* Mobile Location Selector */}
                                <div className="px-4 mb-6">
                                    <div
                                        onClick={() => {
                                            setIsSidebarOpen(false);
                                            setShowLocationModal(true);
                                        }}
                                        className="bg-blue-50 border border-blue-100 p-3 rounded-xl flex items-center justify-between cursor-pointer active:scale-98 transition-transform"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <MapPin className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-0.5">Deliver to</p>
                                                <p className="text-sm font-bold text-gray-900 leading-none">{location?.city || "Select Location"}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-blue-400" />
                                    </div>
                                </div>

                                <div className="px-4 mb-4">
                                    <h3 className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-3 px-2">Top Categories</h3>
                                    <div className="grid gap-0.5">
                                        {drawerCategories.map((cat) => (
                                            <button
                                                key={cat.name}
                                                onClick={() => handleCategoryClick(cat.name)}
                                                className="w-full flex items-center justify-between p-2.5 px-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-all group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <cat.icon className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                                                    <span className="text-[13px] font-medium">{cat.name}</span>
                                                </div>
                                                <ChevronRight className="w-3.5 h-3.5 opacity-20 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="px-4 border-t border-gray-50 pt-4">
                                    <h3 className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-3 px-2">Help & Tools</h3>
                                    <div className="grid gap-1">
                                        <Link href="/login" className="flex items-center gap-3 p-2.5 px-3 text-gray-700 hover:bg-gray-50 rounded-lg text-[13px] font-medium transition-all">
                                            <BadgeInfo className="w-4 h-4 text-gray-400" />
                                            <span>Customer Service</span>
                                        </Link>
                                        <Link href="/login" className="flex items-center gap-3 p-2.5 px-3 bg-blue-600 text-white rounded-lg text-[13px] font-bold transition-all hover:bg-blue-700 justify-center mt-2 shadow-md shadow-blue-100">
                                            Sign In
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 border-t border-gray-50 bg-gray-50/50">
                                <p className="text-[9px] text-gray-400 font-bold tracking-wider uppercase">© 2025 SmartBuy Inc.</p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Smart Location Modal */}
            <AnimatePresence>
                {showLocationModal && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowLocationModal(false)}
                            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col border border-gray-100"
                        >
                            <div className="px-6 py-4 flex justify-between items-center border-b border-gray-50">
                                <h3 className="font-bold text-base text-gray-900">Delivery Address</h3>
                                <button onClick={() => setShowLocationModal(false)} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                                    <X className="w-4 h-4 text-gray-400" />
                                </button>
                            </div>

                            <div className="p-6 flex flex-col gap-4">
                                <button
                                    onClick={handleDetectLocation}
                                    disabled={isDetecting}
                                    className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-bold py-2.5 rounded-lg hover:bg-black transition-all shadow-sm active:scale-98 disabled:opacity-50 text-sm"
                                >
                                    {isDetecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                                    {isDetecting ? "Detecting..." : "Detect Location"}
                                </button>

                                <div className="relative h-px bg-gray-100 my-1">
                                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-3 bg-white text-[9px] font-bold text-gray-300 uppercase tracking-widest">Or Search</span>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Enter city..."
                                            value={locationSearch}
                                            onChange={(e) => setLocationSearch(e.target.value)}
                                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all text-sm outline-none"
                                        />
                                    </div>

                                    <div className="max-h-[240px] overflow-y-auto custom-scrollbar flex flex-col gap-1">
                                        {filteredCities.map((item, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleCitySelect(item)}
                                                className="w-full p-2.5 text-left hover:bg-gray-50 rounded-lg transition-all border border-transparent group"
                                            >
                                                <p className="font-semibold text-sm text-gray-800 group-hover:text-blue-600">{item.city}</p>
                                                <p className="text-[10px] text-gray-400 font-medium uppercase">{item.state}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #F1F1F1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #E5E7EB; }
            `}</style>
        </>
    );

}

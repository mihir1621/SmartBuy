import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, Search, X, User, Camera, Heart, MapPin, Loader2, Clock, Mic, HelpCircle, ChevronLeft, ChevronRight, LogOut, ChevronDown, Settings, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useLocation } from '@/context/LocationContext';
import { motion, AnimatePresence } from 'framer-motion';
import AnnouncementBar from './AnnouncementBar';
import { useState, useEffect, useRef } from 'react';
import { INDIAN_CITIES } from '@/data/indianCities';
import { useRouter } from 'next/router';
import ThemeToggle from './ThemeToggle';


export default function StoreNavbar({ onSearch, categories = [], selectedCategory, setSelectedCategory }) {
    const { user, logout } = useAuth();
    const { setIsCartOpen, cartCount } = useCart();
    const { wishlist } = useWishlist();
    const { location, detectLocation, updateLocation } = useLocation();
    const [searchQuery, setSearchQuery] = useState("");
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [locationSearch, setLocationSearch] = useState("");
    const [isDetecting, setIsDetecting] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const fileInputRef = useRef(null);
    const router = useRouter();

    // Handle scroll for navbar transparency
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
        router.push('/');
    };

    const handleVoiceSearch = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Voice search is not supported in this browser.");
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.start();

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase().trim();

            // Short command handling
            if (['cart', 'open cart', 'view cart', 'my cart'].includes(transcript)) {
                setIsCartOpen(true);
                return;
            }
            if (['checkout', 'go to checkout', 'buy now'].includes(transcript)) {
                router.push('/checkout');
                return;
            }
            if (['login', 'sign in', 'log in', 'signin'].includes(transcript)) {
                router.push('/login');
                return;
            }
            if (['profile', 'my profile', 'account', 'my account', 'orders', 'my orders'].includes(transcript)) {
                router.push('/orders');
                return;
            }
            if (['home', 'go home', 'homepage', 'main page'].includes(transcript)) {
                router.push('/');
                return;
            }
            if (['wishlist', 'my wishlist', 'favorites'].includes(transcript)) {
                router.push('/wishlist');
                return;
            }

            // Natural Language Processing for Search
            // Remove common conversational prefixes to improve search quality
            let finalSearchTerm = event.results[0][0].transcript;
            const lowerTranscript = finalSearchTerm.toLowerCase();

            const prefixes = ['search for ', 'search ', 'show me ', 'find ', 'look for ', 'get me '];
            for (const prefix of prefixes) {
                if (lowerTranscript.startsWith(prefix)) {
                    // Preserve original casing of the search term itself if possible, 
                    // though for search checks we usually lowercase. 
                    // Let's just slice based on length.
                    finalSearchTerm = finalSearchTerm.slice(prefix.length);
                    break;
                }
            }

            setSearchQuery(finalSearchTerm);
            if (onSearch) onSearch(finalSearchTerm);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            if (event.error === 'not-allowed') {
                alert("Microphone access denied. Please allow permission to use voice search.");
            }
        };
    };

    const scrollContainerRef = useRef(null);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    return (
        <>
            <div className="h-24 sm:h-[104px] w-full" />
            <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
                <AnnouncementBar />
                <nav className={`transition-all duration-500 border-b border-border ${isScrolled
                    ? 'bg-background/70 dark:bg-black/40 backdrop-blur-xl shadow-lg py-0.5'
                    : 'bg-background dark:bg-background/90 backdrop-blur-md shadow-sm py-0'
                    }`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-14 gap-4">
                            {/* Logo */}
                            <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
                                <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center transition-all group-hover:scale-105">
                                    <span className="text-background font-bold text-lg">S</span>
                                </div>
                                <span className="font-bold text-xl tracking-tight text-foreground hidden sm:block">SmartBuy</span>
                            </Link>

                            {/* Location Selector (Desktop) */}
                            <div className="hidden lg:flex flex-col justify-center ml-2 cursor-pointer hover:bg-surface px-2 py-1 rounded-lg transition-all border border-transparent hover:border-border" onClick={() => setShowLocationModal(true)}>
                                <span className="text-gray-500 text-[8px] uppercase font-bold leading-none mb-0.5">Deliver to</span>
                                <div className="flex items-center gap-1 font-semibold text-foreground text-xs leading-none">
                                    <MapPin className="w-3 h-3 text-foreground" />
                                    <span className="truncate max-w-[80px]">{location?.city || "Select"}</span>
                                </div>
                            </div>




                            {/* Mobile Search Bar integrated in header */}
                            <div className="flex-1 max-w-xl md:hidden px-1 sm:px-2">
                                <div className="relative w-full group">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearch}
                                        placeholder="Search..."
                                        className="w-full pl-2 sm:pl-3 pr-7 sm:pr-8 py-1.5 bg-surface border border-border rounded-lg focus:bg-background focus:ring-1 focus:ring-foreground focus:border-foreground transition-all text-[12px] sm:text-sm text-foreground outline-none shadow-sm placeholder-gray-500"
                                    />
                                    <div className="absolute right-0 top-0 h-full flex items-center pr-1 sm:pr-1.5 gap-1">
                                        <button onClick={handleVoiceSearch} className="text-gray-500 p-1 hover:text-foreground transition-colors">
                                            <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        </button>
                                        <button className="text-gray-500 p-1">
                                            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Search Bar - Compact Amazon Style (Desktop) */}
                            <div className="flex-1 max-w-xl hidden md:flex items-center">
                                <div className="relative w-full group">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearch}
                                        placeholder="Search products..."
                                        className="w-full pl-3 pr-20 py-1.5 bg-surface border border-border rounded-lg focus:bg-background focus:ring-1 focus:ring-foreground focus:border-foreground transition-all text-sm text-foreground outline-none shadow-sm placeholder-gray-500"
                                    />
                                    <div className="absolute right-0 top-0 h-full flex items-center pr-1.5 gap-1">
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="p-1.5 text-gray-500 hover:text-foreground transition-colors"
                                            title="Search by image"
                                        >
                                            <Camera className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={handleVoiceSearch}
                                            className="p-1.5 text-gray-500 hover:text-foreground transition-colors"
                                            title="Search by voice"
                                        >
                                            <Mic className="w-4 h-4" />
                                        </button>
                                        <button className="bg-foreground text-background p-1.5 rounded-md hover:opacity-90 transition-all shadow-sm">
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

                            <div className="flex items-center gap-1 sm:gap-1.5">
                                <ThemeToggle />

                                <Link href="/wishlist" className="relative p-1 sm:p-1.5 text-foreground hover:bg-surface rounded-lg transition-all flex items-center gap-1.5">
                                    <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'text-red-500 fill-red-500' : ''}`} />
                                    <span className="text-xs font-semibold hidden lg:block">Wishlist</span>
                                </Link>

                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setIsCartOpen(true)}
                                    className="p-1 sm:p-1.5 px-2 sm:px-3 bg-foreground text-background rounded-lg hover:opacity-90 transition-all flex items-center gap-1 sm:gap-1.5 shadow-sm"
                                >
                                    <div className="relative">
                                        <ShoppingBag className="w-4 h-4" />
                                        {cartCount > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-red-500 text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center text-white ring-2 ring-background">
                                                {cartCount}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs font-bold hidden lg:block">Cart</span>
                                </motion.button>

                                {user ? (
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                                            className="flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 text-gray-600 dark:text-gray-300 hover:bg-surface rounded-lg transition-all"
                                        >
                                            <div className="p-1 sm:p-1.5 font-bold text-xs flex items-center gap-1.5">
                                                <User className="w-4 h-4" />
                                                <span className="hidden lg:block truncate max-w-[80px]">
                                                    {user.displayName || user.name || 'User'}
                                                </span>
                                                <motion.div
                                                    animate={{ rotate: isProfileOpen ? 180 : 0 }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                >
                                                    <ChevronDown className="w-3 h-3" />
                                                </motion.div>
                                            </div>
                                        </button>

                                        <AnimatePresence>
                                            {isProfileOpen && (
                                                <>
                                                    <div
                                                        className="fixed inset-0 z-40"
                                                        onClick={() => setIsProfileOpen(false)}
                                                    />
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        className="absolute right-0 top-full mt-2 w-56 bg-surface border border-border rounded-xl shadow-xl z-50 overflow-hidden"
                                                    >
                                                        <div className="p-4 border-b border-border">
                                                            <p className="text-sm font-bold text-foreground truncate">{user.displayName || user.name || 'User'}</p>
                                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                        </div>
                                                        <div className="p-1">
                                                            <Link href="/orders" className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" onClick={() => setIsProfileOpen(false)}>
                                                                <Package className="w-4 h-4" />
                                                                Track Orders
                                                            </Link>
                                                            <Link href="/wishlist" className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" onClick={() => setIsProfileOpen(false)}>
                                                                <Heart className="w-4 h-4" />
                                                                Wishlist
                                                            </Link>
                                                            <Link href="/addresses" className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" onClick={() => setIsProfileOpen(false)}>
                                                                <MapPin className="w-4 h-4" />
                                                                Addresses
                                                            </Link>
                                                            <Link href="/support" className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" onClick={() => setIsProfileOpen(false)}>
                                                                <HelpCircle className="w-4 h-4" />
                                                                Help Center
                                                            </Link>
                                                            <div className="h-px bg-border my-1" />
                                                            <button
                                                                onClick={handleLogout}
                                                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                                                            >
                                                                <LogOut className="w-4 h-4" />
                                                                Sign Out
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                </>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <Link href="/login" className="p-1 sm:p-1.5 text-foreground hover:bg-surface rounded-lg transition-all flex items-center gap-1.5">
                                        <User className="w-4 h-4" />
                                        <span className="text-xs font-semibold hidden lg:block">Sign In</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>



                    {/* Compact Sub-nav */}
                    <div className={`transition-all duration-300 border-t border-border overflow-hidden group/nav ${isScrolled
                        ? 'bg-surface/20 py-1'
                        : 'bg-surface py-1.5'
                        }`}>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                            <button
                                onClick={scrollLeft}
                                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 p-1 rounded-full text-foreground hover:shadow-md block border border-border"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            <div
                                ref={scrollContainerRef}
                                className="flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth px-6"
                            >
                                {categories.map((cat) => (
                                    <Link
                                        key={cat}
                                        href={`/?category=${cat}`}
                                        className={`py-1 text-[10px] font-extrabold uppercase tracking-widest whitespace-nowrap transition-all border-b-2 ${selectedCategory === cat ? 'text-foreground border-foreground' : 'text-gray-500 border-transparent hover:text-foreground'}`}
                                    >
                                        {cat}
                                    </Link>
                                ))}
                            </div>

                            <button
                                onClick={scrollRight}
                                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 p-1 rounded-full text-foreground hover:shadow-md block border border-border"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </nav>
            </header>



            {/* Smart Location Modal */}
            <AnimatePresence>
                {showLocationModal && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowLocationModal(false)}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative bg-background rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col border border-border"
                        >
                            <div className="px-6 py-4 flex justify-between items-center border-b border-border">
                                <h3 className="font-bold text-base text-foreground">Delivery Address</h3>
                                <button onClick={() => setShowLocationModal(false)} className="p-1.5 hover:bg-surface rounded-full transition-colors">
                                    <X className="w-4 h-4 text-gray-400" />
                                </button>
                            </div>

                            <div className="p-6 flex flex-col gap-4">
                                <button
                                    onClick={handleDetectLocation}
                                    disabled={isDetecting}
                                    className="w-full flex items-center justify-center gap-2 bg-foreground text-background font-bold py-2.5 rounded-lg hover:opacity-90 transition-all shadow-sm active:scale-98 disabled:opacity-50 text-sm"
                                >
                                    {isDetecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                                    {isDetecting ? "Detecting..." : "Detect Location"}
                                </button>

                                <div className="relative h-px bg-border my-1">
                                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-3 bg-background text-[9px] font-bold text-gray-500 uppercase tracking-widest">Or Search</span>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            type="text"
                                            placeholder="Enter city..."
                                            value={locationSearch}
                                            onChange={(e) => setLocationSearch(e.target.value)}
                                            className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-lg focus:bg-background focus:ring-1 focus:ring-foreground transition-all text-sm text-foreground outline-none placeholder-gray-500"
                                        />
                                    </div>

                                    <div className="max-h-[240px] overflow-y-auto custom-scrollbar flex flex-col gap-1">
                                        {filteredCities.map((item, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleCitySelect(item)}
                                                className="w-full p-2.5 text-left hover:bg-surface rounded-lg transition-all border border-transparent group"
                                            >
                                                <p className="font-semibold text-sm text-foreground group-hover:text-primary">{item.city}</p>
                                                <p className="text-[10px] text-gray-500 font-medium uppercase">{item.state}</p>
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
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
            `}</style>
        </>
    );

}

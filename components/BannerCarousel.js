import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Star } from 'lucide-react';
import Image from 'next/image';

const standardBanners = [
    {
        id: "main-1",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1600&q=80", // Laptop/Tech
        title: "Next Gen Electronics",
        subtitle: "Upgrade to the latest Tech today",
        color: "bg-purple-600",
        badge: "Featured"
    },
    {
        id: "main-2",
        image: "https://images.unsplash.com/photo-1529139574466-a302d2d3f529?w=1600&q=80", // Fashion
        title: "Fashion Festival",
        subtitle: "Trendiest Styles for Men & Women",
        color: "bg-pink-600",
        badge: "Trending"
    },
    {
        id: "main-3",
        image: "https://images.unsplash.com/photo-1616486338812-3aeb1d630438?w=1600&q=80", // Interior
        title: "Home Makeover",
        subtitle: "Premium Decor & Furniture",
        color: "bg-orange-600",
        badge: "New Arrivals"
    }
];

// Daily Rotating Offers (0=Sunday, 1=Monday, etc.)
const dailyOffers = [
    {
        id: "sun-deal",
        day: 0, // Sunday
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&q=80", // Headphones
        title: "Sunday Chill Deals",
        subtitle: "Premium Audio Gear for your Weekend",
        color: "bg-indigo-500",
        badge: "Deal of the Day"
    },
    {
        id: "mon-deal",
        day: 1, // Monday
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600&q=80", // Fitness
        title: "Monday Motivation",
        subtitle: "Get 40% Off on Sportswear & Fitness Trackers",
        color: "bg-red-600",
        badge: "Deal of the Day"
    },
    {
        id: "tue-deal",
        day: 2, // Tuesday
        image: "https://images.unsplash.com/photo-1531297461136-82lw8fca3c7c?w=1600&q=80", // Tech
        title: "Tech Tuesday",
        subtitle: "Massive Discounts on Laptops & Accessories",
        color: "bg-blue-600",
        badge: "Deal of the Day"
    },
    {
        id: "wed-deal",
        day: 3, // Wednesday
        image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1600&q=80", // Wardrobe
        title: "Wardrobe Wednesday",
        subtitle: "Mid-week Fashion Refresh Starts Here",
        color: "bg-emerald-600",
        badge: "Deal of the Day"
    },
    {
        id: "thu-deal",
        day: 4, // Thursday
        image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1600&q=80", // Electronics
        title: "Thunder Thursday",
        subtitle: "Flash Sales on Electronics & Gadgets",
        color: "bg-yellow-600",
        badge: "Deal of the Day"
    },
    {
        id: "fri-deal",
        day: 5, // Friday
        image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1600&q=80", // Party/Dress
        title: "Fashion Friday",
        subtitle: "Party Wear Special - Flat 50% Off",
        color: "bg-rose-600",
        badge: "Deal of the Day"
    },
    {
        id: "sat-deal",
        day: 6, // Saturday
        image: "https://images.unsplash.com/photo-1558002038-1091a166111c?w=1600&q=80", // Smart Home
        title: "Super Saturday",
        subtitle: "Everything for your Smart Home",
        color: "bg-cyan-600",
        badge: "Deal of the Day"
    }
];

export default function BannerCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [activeBanners, setActiveBanners] = useState(standardBanners);

    useEffect(() => {
        // Determine the daily offer based on user's local day
        const today = new Date().getDay();
        const todaysDeal = dailyOffers.find(offer => offer.day === today);

        if (todaysDeal) {
            // Put today's deal FIRST in the list
            setActiveBanners([todaysDeal, ...standardBanners]);
        }
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(timer);
    }, [currentIndex, activeBanners]);

    const nextSlide = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev === activeBanners.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev === 0 ? activeBanners.length - 1 : prev - 1));
    };

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    // Safety check
    if (!activeBanners || activeBanners.length === 0) return null;

    const currentBanner = activeBanners[currentIndex];

    return (
        <div className="relative w-full h-[250px] sm:h-[350px] md:h-[400px] lg:h-[60vh] overflow-hidden bg-gray-900 mt-1 shadow-2xl">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                    className="absolute inset-0 w-full h-full"
                >
                    <div className="relative w-full h-full group">
                        {/* Image Layer */}
                        <Image
                            src={currentBanner.image}
                            alt={currentBanner.title}
                            fill
                            className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-[20s]"
                            priority={currentIndex === 0}
                        />

                        {/* Gradient Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent`} />

                        {/* Content Layer */}
                        <div className="absolute inset-0 flex flex-col justify-center items-start text-left text-white p-8 md:p-16 lg:p-24 max-w-4xl">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="flex items-center gap-2 mb-4"
                            >
                                <span className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg ${currentBanner.color}`}>
                                    {currentBanner.badge === "Deal of the Day" ? <Clock className="w-3 h-3" /> : <Star className="w-3 h-3" />}
                                    {currentBanner.badge}
                                </span>
                            </motion.div>

                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 tracking-tight drop-shadow-2xl leading-[1.1]"
                            >
                                {currentBanner.title}
                            </motion.h2>

                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-lg md:text-2xl text-gray-200 font-medium max-w-2xl drop-shadow-lg mb-8 leading-relaxed"
                            >
                                {currentBanner.subtitle}
                            </motion.p>

                            <motion.button
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="px-10 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl active:scale-95 flex items-center gap-2 text-lg"
                            >
                                Explore Offers <ChevronRight className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-md transition-all hidden md:flex items-center justify-center border border-white/10"
            >
                <ChevronLeft className="w-8 h-8" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-md transition-all hidden md:flex items-center justify-center border border-white/10"
            >
                <ChevronRight className="w-8 h-8" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                {activeBanners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setDirection(index > currentIndex ? 1 : -1);
                            setCurrentIndex(index);
                        }}
                        className={`transition-all rounded-full shadow-sm ${index === currentIndex
                            ? 'bg-white w-12 h-3'
                            : 'bg-white/40 hover:bg-white/60 w-3 h-3'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}

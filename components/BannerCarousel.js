import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Star } from 'lucide-react';
import Image from 'next/image';

import { useRouter } from 'next/router';

const standardBanners = [
    {
        id: "main-1",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1600&q=80", // Laptop/Tech
        title: "Next Gen Electronics",
        subtitle: "Upgrade to the latest Tech today",
        color: "bg-purple-600",
        badge: "Featured",
        link: "/?category=Electronics"
    },
    {
        id: "main-2",
        image: "https://images.unsplash.com/photo-1445205170230-053b830c6050?w=1600&q=80", // Fashion
        title: "Fashion Festival",
        subtitle: "Trendiest Styles for Men & Women",
        color: "bg-pink-600",
        badge: "Trending",
        link: "/?category=Menswear"
    },
    {
        id: "main-3",
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80", // Interior
        title: "Home Makeover",
        subtitle: "Premium Decor & Furniture",
        color: "bg-orange-600",
        badge: "New Arrivals",
        link: "/?category=Home"
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
        badge: "Deal of the Day",
        link: "/?category=Audio"
    },
    {
        id: "mon-deal",
        day: 1, // Monday
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600&q=80", // Fitness
        title: "Monday Motivation",
        subtitle: "Get 40% Off on Sportswear & Fitness Trackers",
        color: "bg-red-600",
        badge: "Deal of the Day",
        link: "/?category=Menswear"
    },
    {
        id: "tue-deal",
        day: 2, // Tuesday
        image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1600&q=80", // Tech
        title: "Tech Tuesday",
        subtitle: "Massive Discounts on Laptops & Accessories",
        color: "bg-blue-600",
        badge: "Deal of the Day",
        link: "/?category=Laptops"
    },
    {
        id: "wed-deal",
        day: 3, // Wednesday
        image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1600&q=80", // Wardrobe
        title: "Wardrobe Wednesday",
        subtitle: "Mid-week Fashion Refresh Starts Here",
        color: "bg-emerald-600",
        badge: "Deal of the Day",
        link: "/?category=Menswear"
    },
    {
        id: "thu-deal",
        day: 4, // Thursday
        image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1600&q=80", // Electronics
        title: "Thunder Thursday",
        subtitle: "Flash Sales on Electronics & Gadgets",
        color: "bg-yellow-600",
        badge: "Deal of the Day",
        link: "/?category=Electronics"
    },
    {
        id: "fri-deal",
        day: 5, // Friday
        image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1600&q=80", // Party/Dress
        title: "Fashion Friday",
        subtitle: "Party Wear Special - Flat 50% Off",
        color: "bg-rose-600",
        badge: "Deal of the Day",
        link: "/?category=Menswear"
    },
    {
        id: "sat-deal",
        day: 6, // Saturday
        image: "https://images.unsplash.com/photo-1558002038-1091a166111c?w=1600&q=80", // Smart Home
        title: "Super Saturday",
        subtitle: "Everything for your Smart Home",
        color: "bg-cyan-600",
        badge: "Deal of the Day",
        link: "/?category=Home"
    }
];

export default function BannerCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [activeBanners, setActiveBanners] = useState(standardBanners);
    const router = useRouter();

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
        <div className="relative w-full h-[320px] sm:h-[400px] md:h-[450px] lg:h-[65vh] overflow-hidden bg-gray-900 mt-1 shadow-2xl">
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
                        <div className="absolute inset-0 flex flex-col justify-center items-start text-left text-white p-6 sm:p-12 md:p-16 lg:p-24 max-w-4xl">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="flex items-center gap-2 mb-4"
                            >
                                <span className={`px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-sm font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg ${currentBanner.color}`}>
                                    {currentBanner.badge === "Deal of the Day" ? <Clock className="w-3 h-3" /> : <Star className="w-3 h-3" />}
                                    {currentBanner.badge}
                                </span>
                            </motion.div>

                            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black mb-3 md:mb-4 tracking-tight drop-shadow-2xl leading-[1.1]">
                                {currentBanner.title}
                            </h2>

                            <p className="text-sm sm:text-base md:text-2xl text-gray-200 font-medium max-w-2xl drop-shadow-lg mb-6 md:mb-8 leading-relaxed line-clamp-2 md:line-clamp-none">
                                {currentBanner.subtitle}
                            </p>

                            <button
                                onClick={() => router.push(currentBanner.link)}
                                className="px-6 py-2.5 md:px-10 md:py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl active:scale-95 flex items-center gap-2 text-sm md:text-lg"
                            >
                                Explore Offers <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
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

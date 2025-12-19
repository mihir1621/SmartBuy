import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HERO_SLIDES = [
    {
        id: 1,
        title: "Summer Collection 2024",
        subtitle: "Up to 50% off on all summer essentials.",
        cta: "Shop Now",
        image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        color: "bg-orange-50",
        textCol: "text-orange-900"
    },
    {
        id: 2,
        title: "Next Gen Electronics",
        subtitle: "Upgrade your productivity with the latest tech.",
        cta: "Explore Tech",
        image: "https://images.unsplash.com/photo-1542332213-31f87348057f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        color: "bg-gray-100",
        textCol: "text-gray-900"
    },
    {
        id: 3,
        title: "Luxury Home Decor",
        subtitle: "Transform your living space into a sanctuary.",
        cta: "View Collections",
        image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        color: "bg-stone-100",
        textCol: "text-stone-800"
    }
];

export default function HeroSection() {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.offsetWidth;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="relative group">
            <div
                ref={scrollRef}
                className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth"
            >
                {HERO_SLIDES.map((slide) => (
                    <div
                        key={slide.id}
                        className={`flex-none w-full h-[300px] md:h-[400px] snap-center snap-always relative overflow-hidden`}
                    >
                        <div className="absolute inset-0 z-0">
                            <Image src={slide.image} alt={slide.title} fill className="object-cover brightness-75" priority={slide.id === 1} />
                        </div>

                        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="max-w-xl text-white space-y-4">
                                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest border border-white/30">
                                        Featured
                                    </span>
                                    <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
                                        {slide.title}
                                    </h2>
                                    <p className="text-lg md:text-xl text-gray-200">
                                        {slide.subtitle}
                                    </p>
                                    <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg mt-4">
                                        {slide.cta}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={() => scroll("left")}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            <button
                onClick={() => scroll("right")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
            >
                <ChevronRight className="w-6 h-6" />
            </button>
        </div>
    );
}

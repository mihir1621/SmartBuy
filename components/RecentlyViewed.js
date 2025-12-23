import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

export default function RecentlyViewed({ products }) {
    const scrollRef = useRef(null);

    if (!products || products.length === 0) return null;

    return (
        <section className="bg-black py-12 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 mb-6">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <h2 className="text-xl font-bold text-white">Recently Viewed</h2>
                </div>

                <div className="relative">
                    <div
                        className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x"
                        style={{ scrollPaddingLeft: '1rem', scrollPaddingRight: '1rem' }}
                    >
                        {products.map((product) => (
                            <Link href={`/product/${product.id}`} key={product.id} className="flex-none w-[160px] md:w-[200px] snap-start group">
                                <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 overflow-hidden h-full flex flex-col hover:shadow-md hover:border-blue-900 transition-all">
                                    <div className="relative w-full h-32 md:h-40 bg-gray-800">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-3 flex-1 flex flex-col">
                                        <h3 className="text-sm font-medium text-white line-clamp-2 mb-1 group-hover:text-blue-400 transition-colors">
                                            {product.name}
                                        </h3>
                                        <p className="text-xs text-gray-400 mb-2">{product.category}</p>
                                        <span className="text-sm font-bold text-white mt-auto">₹{product.price}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

import Skeleton from "../Skeleton";

export const NavbarSkeleton = () => (
    <div className="sticky top-0 z-30 bg-black/90 backdrop-blur-md shadow-sm border-b border-gray-800 h-14 flex items-center px-4 sm:px-6 lg:px-8 gap-4">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <Skeleton className="w-24 h-6 hidden sm:block" />
        <div className="flex-1 max-w-xl hidden md:block mx-auto">
            <Skeleton className="w-full h-9 rounded-lg" />
        </div>
        <div className="flex items-center gap-3 ml-auto">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="w-20 h-9 rounded-lg hidden lg:block" />
        </div>
    </div>
);

export const HomeSkeleton = () => (
    <div className="min-h-screen bg-black text-white">
        <NavbarSkeleton />
        {/* Banner Skeleton */}
        <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] bg-gray-900 animate-pulse" />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Filter/Sort Bar Skeleton */}
            <div className="flex justify-between items-center mb-6 gap-4">
                <Skeleton className="w-48 h-8" />
                <Skeleton className="w-32 h-8" />
            </div>

            {/* Product Grid Skeleton */}
            <div className="space-y-12">
                {[1, 2].map((section) => (
                    <section key={section} className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Skeleton className="w-32 h-8" />
                            <div className="h-px bg-gray-800 flex-grow" />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 p-2 space-y-3">
                                    <Skeleton className="w-full aspect-[3/4] rounded-lg" />
                                    <div className="space-y-2 px-1">
                                        <Skeleton className="w-3/4 h-4" />
                                        <Skeleton className="w-1/2 h-4" />
                                        <div className="flex justify-between items-center pt-2">
                                            <Skeleton className="w-16 h-5" />
                                            <Skeleton className="w-8 h-8 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </main>
    </div>
);

export const ProductDetailSkeleton = () => (
    <div className="min-h-screen bg-black text-white flex flex-col">
        <NavbarSkeleton />
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <div className="bg-gray-900 rounded-2xl shadow-sm border border-gray-800 overflow-hidden mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                    {/* Image Gallery Skeleton */}
                    <div className="space-y-4">
                        <Skeleton className="w-full aspect-square rounded-xl" />
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="w-20 h-20 rounded-lg flex-shrink-0" />
                            ))}
                        </div>
                    </div>

                    {/* Product Info Skeleton */}
                    <div className="flex flex-col space-y-6">
                        <div className="border-b border-gray-800 pb-6 space-y-4">
                            <Skeleton className="w-24 h-6 rounded-full" />
                            <Skeleton className="w-3/4 h-10" />
                            <Skeleton className="w-1/3 h-6" />
                            <div className="flex items-center gap-4">
                                <Skeleton className="w-16 h-6" />
                                <Skeleton className="w-24 h-6" />
                            </div>
                            <Skeleton className="w-40 h-10" />
                        </div>

                        <div className="space-y-4 flex-1">
                            <Skeleton className="w-full h-24" />
                            <div className="grid grid-cols-2 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <Skeleton key={i} className="h-12 rounded-xl" />
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4 pt-6 border-t border-gray-800">
                            <Skeleton className="flex-1 h-14 rounded-xl" />
                            <Skeleton className="flex-1 h-14 rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
);

export const OrderSkeleton = () => (
    <div className="min-h-screen bg-black text-white flex flex-col">
        <NavbarSkeleton />
        <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
                <div className="flex items-center gap-4">
                    <Skeleton className="w-16 h-16 rounded-2xl" />
                    <div className="space-y-2">
                        <Skeleton className="w-48 h-8" />
                        <Skeleton className="w-64 h-4" />
                    </div>
                </div>
                <Skeleton className="w-full lg:w-64 h-10 rounded-xl" />
            </div>

            <div className="flex gap-2 mb-8">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="w-24 h-8 rounded-xl" />
                ))}
            </div>

            <div className="space-y-8">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-[2rem] p-8 space-y-8">
                        <div className="flex flex-col lg:flex-row justify-between gap-6">
                            <div className="flex gap-10">
                                {[...Array(4)].map((_, j) => (
                                    <div key={j} className="space-y-2">
                                        <Skeleton className="w-20 h-3" />
                                        <Skeleton className="w-24 h-5" />
                                    </div>
                                ))}
                            </div>
                            <Skeleton className="w-32 h-10 rounded-xl" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[...Array(2)].map((_, j) => (
                                <div key={j} className="flex gap-5 p-4 bg-gray-950/60 rounded-2xl border border-gray-800/30">
                                    <Skeleton className="w-16 h-16 rounded-xl" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="w-3/4 h-4" />
                                        <Skeleton className="w-1/2 h-3" />
                                        <div className="flex justify-between">
                                            <Skeleton className="w-16 h-5" />
                                            <Skeleton className="w-20 h-5" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    </div>
);

export const WishlistSkeleton = () => (
    <div className="min-h-screen bg-black text-white flex flex-col">
        <NavbarSkeleton />
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <div className="flex items-center gap-4 mb-8">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="w-48 h-8" />
                    <Skeleton className="w-32 h-4" />
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 p-2 space-y-3">
                        <Skeleton className="w-full aspect-[3/4] rounded-lg" />
                        <div className="space-y-2 px-1">
                            <Skeleton className="w-3/4 h-4" />
                            <Skeleton className="w-1/2 h-4" />
                            <div className="flex justify-between items-center pt-2">
                                <Skeleton className="w-16 h-5" />
                                <Skeleton className="w-8 h-8 rounded-full" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    </div>
);

export const GenericSkeleton = () => (
    <div className="min-h-screen bg-black text-white">
        <NavbarSkeleton />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Skeleton className="w-1/3 h-10 mb-8" />
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="w-full h-24 rounded-xl" />
                ))}
            </div>
        </main>
    </div>
);


import { Star, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FilterSidebar({
    selectedCategory,
    brands,
    availableGenders = [],
    selectedBrands,
    setSelectedBrands,
    priceRange,
    setPriceRange,
    globalMaxPrice,
    selectedGender,
    setSelectedGender,
    minRating,
    setMinRating,
    sortOption,
    setSortOption,
    clearAll
}) {
    const handleBrandChange = (brand) => {
        if (selectedBrands.includes(brand)) {
            setSelectedBrands(selectedBrands.filter(b => b !== brand));
        } else {
            setSelectedBrands([...selectedBrands, brand]);
        }
    };

    const handlePriceChange = (index, value) => {
        const newRange = [...priceRange];
        newRange[index] = parseInt(value) || 0;
        // Ensure min doesn't exceed max
        if (index === 0 && newRange[0] > newRange[1]) newRange[1] = newRange[0];
        if (index === 1 && newRange[1] < newRange[0]) newRange[0] = newRange[1];
        setPriceRange(newRange);
    };

    const displayedGenders = ['All', 'Men', 'Women', 'Kids', 'Boys', 'Girls', 'Unisex'].filter(g =>
        g === 'All' || availableGenders.includes(g)
    );

    const showGenderFilter = availableGenders.length > 0;
    const showBrandFilter = brands.length > 1;

    return (
        <div className="space-y-8 bg-gray-900/40 p-6 rounded-3xl border border-gray-800/50 backdrop-blur-md">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-800/50">
                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Filters</h3>
                <button
                    onClick={clearAll}
                    className="text-xs font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors"
                >
                    Clear All
                </button>
            </div>

            {/* Sort By - Unified in Sidebar */}
            <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Sort Result</h4>
                <div className="relative group">
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="w-full bg-gray-950 border border-gray-800 rounded-2xl py-3 px-4 text-sm text-gray-200 appearance-none focus:border-blue-500 outline-none cursor-pointer transition-all"
                    >
                        <option value="popularity">Popularity</option>
                        <option value="newest">Newest Arrivals</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="rating">Top Rated</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-hover:text-blue-400 transition-colors">
                        <Star size={14} className="rotate-90" /> {/* Just a visual indicator icon */}
                    </div>
                </div>
            </div>

            {/* Current Context */}
            {selectedCategory !== 'All' && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-3 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter mb-0.5">Category</p>
                        <p className="text-sm font-bold text-gray-100">{selectedCategory}</p>
                    </div>
                </div>
            )}

            {/* Gender Filter */}
            {showGenderFilter && (
                <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Target</h4>
                    <div className="flex flex-wrap gap-2">
                        {displayedGenders.map((gender) => (
                            <button
                                key={gender}
                                onClick={() => setSelectedGender(gender)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${selectedGender === gender
                                    ? "bg-white text-black border-white shadow-lg shadow-white/10"
                                    : "bg-gray-950 text-gray-400 border-gray-800 hover:border-gray-600"
                                    }`}
                            >
                                {gender}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Price Filter - Advanced Dual Input */}
            <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Price Range (₹)</h4>
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Min</label>
                        <input
                            type="number"
                            value={priceRange[0]}
                            onChange={(e) => handlePriceChange(0, e.target.value)}
                            className="w-full bg-gray-950 border border-gray-800 rounded-xl py-2 px-3 text-sm text-gray-200 focus:border-blue-500 outline-none"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Max</label>
                        <input
                            type="number"
                            value={priceRange[1]}
                            onChange={(e) => handlePriceChange(1, e.target.value)}
                            className="w-full bg-gray-950 border border-gray-800 rounded-xl py-2 px-3 text-sm text-gray-200 focus:border-blue-500 outline-none"
                        />
                    </div>
                </div>
                {/* Visual Slider (Single range for now but dual handles would be better, using single for stability) */}
                <input
                    type="range"
                    min="0"
                    max={globalMaxPrice}
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(1, e.target.value)}
                    className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between mt-2">
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">Budget Friendly</span>
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">Premium</span>
                </div>
            </div>

            {/* Brand Filter */}
            {showBrandFilter && (
                <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Popular Brands</h4>
                    <div className="space-y-1.5 max-h-56 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                        {brands.map((brand) => (
                            <label
                                key={brand}
                                className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all border ${selectedBrands.includes(brand)
                                    ? "bg-blue-500/5 border-blue-500/20 text-blue-400"
                                    : "bg-transparent border-transparent text-gray-400 hover:bg-gray-800/30"
                                    }`}
                            >
                                <div className={`relative w-4 h-4 rounded border flex items-center justify-center transition-all ${selectedBrands.includes(brand) ? "bg-blue-500 border-blue-500" : "border-gray-700"
                                    }`}>
                                    <input
                                        type="checkbox"
                                        checked={selectedBrands.includes(brand)}
                                        onChange={() => handleBrandChange(brand)}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    {selectedBrands.includes(brand) && <X size={12} className="text-white" />}
                                </div>
                                <span className="text-sm font-bold truncate">{brand}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Rating Filter */}
            <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Customer Rating</h4>
                <div className="grid grid-cols-2 gap-2">
                    {[4, 3].map((rating) => (
                        <button
                            key={rating}
                            onClick={() => setMinRating(rating === minRating ? 0 : rating)}
                            className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all ${minRating === rating
                                ? "bg-yellow-400/10 border-yellow-400/30 ring-1 ring-yellow-400/20"
                                : "bg-gray-950 border-gray-800 hover:border-gray-700"
                                }`}
                        >
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-800'}`}
                                    />
                                )) || null}
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase whitespace-nowrap">{rating}.0 &amp; Up</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}


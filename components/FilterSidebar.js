import { Star, X, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const FilterSection = ({ title, options, selected, onChange }) => {
    if (!options || options.length === 0) return null;

    return (
        <div>
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 sm:mb-4">{title}</h4>
            <div className="space-y-1.5 max-h-48 sm:max-h-56 overflow-y-auto pr-2 custom-scrollbar">
                {options.map((option) => (
                    <label
                        key={option}
                        className={`flex items-center gap-3 p-2 px-2.5 rounded-xl cursor-pointer transition-all border ${selected.includes(option)
                            ? "bg-accent/5 border-accent/20 text-accent"
                            : "bg-surface border-border text-secondary-text hover:bg-secondary"
                            }`}
                    >
                        <div className={`relative w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0 ${selected.includes(option) ? "bg-accent border-accent shadow-sm" : "border-border"
                            }`}>
                            <input
                                type="checkbox"
                                checked={selected.includes(option)}
                                onChange={() => {
                                    if (selected.includes(option)) {
                                        onChange(selected.filter(i => i !== option));
                                    } else {
                                        onChange([...selected, option]);
                                    }
                                }}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            {selected.includes(option) && <Check size={10} className="text-white" />}
                        </div>
                        <span className="text-[11px] sm:text-sm font-bold truncate tracking-tight">{option}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

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

    // Advanced Filters
    selectedRam, setSelectedRam,
    selectedStorage, setSelectedStorage,
    selectedSize, setSelectedSize,
    selectedColor, setSelectedColor,
    selectedType, setSelectedType,
    selectedConnectivity, setSelectedConnectivity,
    selectedMaterial, setSelectedMaterial,
    selectedResolution, setSelectedResolution,
    availableRam,
    availableStorage,
    availableSizes,
    availableColors,
    availableTypes,
    availableConnectivity,
    availableMaterials,
    availableResolutions,

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
        <div className="space-y-6 sm:space-y-8 sm:bg-surface/50 p-1 sm:p-6 rounded-3xl sm:border sm:border-border sm:backdrop-blur-md">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-border">
                <h3 className="text-lg sm:text-xl font-black text-foreground uppercase tracking-tight">Filters</h3>
                <button
                    onClick={clearAll}
                    className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-accent hover:text-accent-hover transition-colors"
                >
                    Clear All
                </button>
            </div>

            {/* Sort By - Unified in Sidebar */}
            <div className="lg:hidden">
                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Sort Result</h4>
                <div className="relative group">
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="w-full bg-surface border border-border rounded-xl sm:rounded-2xl py-2.5 sm:py-3 px-4 text-xs sm:text-sm text-foreground appearance-none focus:border-accent outline-none cursor-pointer transition-all shadow-sm"
                    >
                        <option value="popularity">Popularity</option>
                        <option value="newest">Newest Arrivals</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="rating">Top Rated</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-hover:text-white transition-colors">
                        <Star size={12} className="rotate-90" />
                    </div>
                </div>
            </div>

            {/* Current Context */}
            {selectedCategory !== 'All' && (
                <div className="bg-accent/5 border border-accent/20 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 flex items-center justify-between">
                    <div className="min-w-0">
                        <p className="text-[9px] font-black text-accent uppercase tracking-widest mb-0.5">Category</p>
                        <p className="text-xs sm:text-sm font-bold text-foreground truncate">{selectedCategory}</p>
                    </div>
                </div>
            )}

            {/* Gender Filter */}
            {showGenderFilter && (
                <div>
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 sm:mb-4">Target</h4>
                    <div className="flex flex-wrap gap-2">
                        {displayedGenders.map((gender) => (
                            <button
                                key={gender}
                                onClick={() => setSelectedGender(gender)}
                                className={`px-3.5 sm:px-4 py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all border ${selectedGender === gender
                                    ? "bg-accent text-white border-accent shadow-saas"
                                    : "bg-surface text-secondary-text border-border hover:border-gray-400"
                                    }`}
                            >
                                {gender}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Price Filter */}
            <div>
                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 sm:mb-4">Price Range (₹)</h4>
                <div className="grid grid-cols-2 gap-3 mb-5 sm:mb-6">
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Min</label>
                        <input
                            type="number"
                            value={priceRange[0]}
                            onChange={(e) => handlePriceChange(0, e.target.value)}
                            className="w-full bg-surface border border-border rounded-xl py-2 px-3 text-xs sm:text-sm text-foreground focus:border-accent outline-none transition-colors shadow-sm"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Max</label>
                        <input
                            type="number"
                            value={priceRange[1]}
                            onChange={(e) => handlePriceChange(1, e.target.value)}
                            className="w-full bg-surface border border-border rounded-xl py-2 px-3 text-xs sm:text-sm text-foreground focus:border-accent outline-none transition-colors shadow-sm"
                        />
                    </div>
                </div>
                <input
                    type="range"
                    min="0"
                    max={globalMaxPrice}
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(1, e.target.value)}
                    className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-accent"
                />
            </div>

            {/* Dynamic Advanced Filters */}
            <FilterSection title="RAM" options={availableRam} selected={selectedRam} onChange={setSelectedRam} />
            <FilterSection title="Storage" options={availableStorage} selected={selectedStorage} onChange={setSelectedStorage} />
            <FilterSection title="Size" options={availableSizes} selected={selectedSize} onChange={setSelectedSize} />
            <FilterSection title="Color" options={availableColors} selected={selectedColor} onChange={setSelectedColor} />
            <FilterSection title="Type" options={availableTypes} selected={selectedType} onChange={setSelectedType} />
            <FilterSection title="Connectivity" options={availableConnectivity} selected={selectedConnectivity} onChange={setSelectedConnectivity} />
            <FilterSection title="Material" options={availableMaterials} selected={selectedMaterial} onChange={setSelectedMaterial} />
            <FilterSection title="Resolution" options={availableResolutions} selected={selectedResolution} onChange={setSelectedResolution} />

            {/* Brand Filter */}
            {showBrandFilter && (
                <div>
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 sm:mb-4">Popular Brands</h4>
                    <div className="space-y-1.5 max-h-48 sm:max-h-56 overflow-y-auto pr-2 custom-scrollbar">
                        {brands.map((brand) => (
                            <label
                                key={brand}
                                className={`flex items-center gap-3 p-2 px-2.5 rounded-xl cursor-pointer transition-all border ${selectedBrands.includes(brand)
                                    ? "bg-accent/5 border-accent/20 text-accent font-bold"
                                    : "bg-surface border-border text-secondary-text hover:bg-secondary"
                                    }`}
                            >
                                <div className={`relative w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0 ${selectedBrands.includes(brand) ? "bg-accent border-accent shadow-sm" : "border-border"
                                    }`}>
                                    <input
                                        type="checkbox"
                                        checked={selectedBrands.includes(brand)}
                                        onChange={() => handleBrandChange(brand)}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    {selectedBrands.includes(brand) && <Check size={10} className="text-white" />}
                                </div>
                                <span className="text-[11px] sm:text-sm font-bold truncate tracking-tight">{brand}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Rating Filter */}
            <div>
                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 sm:mb-4">Customer Rating</h4>
                <div className="grid grid-cols-2 gap-2">
                    {[4, 3].map((rating) => (
                        <button
                            key={rating}
                            onClick={() => setMinRating(rating === minRating ? 0 : rating)}
                            className={`flex flex-col items-center gap-1.5 p-2.5 sm:p-3 rounded-2xl border transition-all shadow-sm ${minRating === rating
                                ? "bg-accent/5 border-accent/30 ring-1 ring-accent/10"
                                : "bg-surface border-border hover:border-gray-400"
                                }`}
                        >
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${i < rating ? 'text-accent fill-accent' : 'text-secondary'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-[9px] sm:text-[10px] font-black text-secondary-text uppercase whitespace-nowrap tracking-widest">{rating}.0 &amp; Up</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}



import { Star } from 'lucide-react';
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
    clearAll
}) {
    const handleBrandChange = (brand) => {
        if (selectedBrands.includes(brand)) {
            setSelectedBrands(selectedBrands.filter(b => b !== brand));
        } else {
            setSelectedBrands([...selectedBrands, brand]);
        }
    };

    // Filter standard genders to only show relevant ones
    const displayedGenders = ['All', 'Men', 'Women', 'Boys', 'Girls', 'Unisex'].filter(g =>
        g === 'All' || availableGenders.includes(g)
    );

    const showGenderFilter = availableGenders.length > 0;
    const showBrandFilter = brands.length > 1;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                <button
                    onClick={clearAll}
                    className="text-sm text-blue-600 font-medium hover:underline"
                >
                    Clear All
                </button>
            </div>

            {/* Gender Filter - Smart Render */}
            {showGenderFilter && (
                <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Gender</h4>
                    <div className="space-y-2">
                        {displayedGenders.map((gender) => (
                            <label key={gender} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    checked={selectedGender === gender}
                                    onChange={() => setSelectedGender(gender)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-gray-700 text-sm">{gender}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Price Filter - Always Relevant */}
            <div>
                <h4 className="font-semibold text-gray-900 mb-3">Price Range</h4>
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm font-medium text-gray-700">₹{priceRange[0]}</span>
                    <input
                        type="range"
                        min="0"
                        max={globalMaxPrice}
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
                    />
                    <span className="text-sm font-medium text-gray-700">₹{priceRange[1]}</span>
                </div>
            </div>

            {/* Brand Filter - Smart Render */}
            {showBrandFilter && (
                <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Brands</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {brands.map((brand) => (
                            <label key={brand} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedBrands.includes(brand)}
                                    onChange={() => handleBrandChange(brand)}
                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-gray-700 text-sm truncate">{brand}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Rating Filter - Always Relevant */}
            <div>
                <h4 className="font-semibold text-gray-900 mb-3">Rating</h4>
                <div className="space-y-1">
                    {[4, 3, 2, 1].map((rating) => (
                        <button
                            key={rating}
                            onClick={() => setMinRating(rating === minRating ? 0 : rating)}
                            className={`flex items-center gap-2 w-full px-2 py-1 rounded hover:bg-gray-100 ${minRating === rating ? 'bg-blue-50' : ''}`}
                        >
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-3.5 h-3.5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-gray-600">& Up</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

import { useState, useMemo } from 'react';
import { RankingSystem } from '@/utils/RankingSystem';

// Helper to deterministically generate attributes based on product ID
const getAttribute = (id, options) => options[id % options.length];

const ENRICHED_PRODUCTS = (products) => products.map(p => {
    const enriched = { ...p };

    // --- SMARTPHONES & LAPTOPS ---
    if (p.category === 'Smartphones' || p.category === 'Laptops') {
        enriched.ram = getAttribute(p.id, ['4GB', '6GB', '8GB', '12GB', '16GB', '32GB']);
        enriched.storage = getAttribute(p.id, ['64GB', '128GB', '256GB', '512GB', '1TB']);
    }

    // --- CLOTHING ---
    if (['Menswear', 'Womenswear'].includes(p.category)) {
        enriched.size = getAttribute(p.id, ['S', 'M', 'L', 'XL', 'XXL']);
        enriched.color = getAttribute(p.id, ['Black', 'White', 'Blue', 'Red', 'Green', 'Navy', 'Grey']);
        enriched.material = getAttribute(p.id, ['Cotton', 'Polyester', 'Denim', 'Linen', 'Blend']);
        enriched.occasion = getAttribute(p.id, ['Casual', 'Formal', 'Party', 'Sports']);
    }

    // --- AUDIO ---
    if (p.category === 'Audio') {
        enriched.type = getAttribute(p.id, ['In-Ear', 'Over-Ear', 'Headphones', 'Earbuds']);
        enriched.connectivity = getAttribute(p.id, ['Wireless', 'Wired']);
    }

    // --- WATCHES ---
    if (p.category === 'Watch') {
        enriched.display = getAttribute(p.id, ['Analog', 'Digital', 'Smartwatch', 'Chronograph']);
        enriched.strap = getAttribute(p.id, ['Leather', 'Metal', 'Silicon', 'Fabric']);
    }

    // --- ACCESSORIES & BAGS ---
    if (['Accessories', 'Bags'].includes(p.category)) {
        enriched.type = getAttribute(p.id, ['Backpack', 'Wallet', 'Belt', 'Handbag', 'Tote', 'Messenger']);
        enriched.material = getAttribute(p.id, ['Leather', 'Canvas', 'Nylon', 'Polyester']);
    }

    // --- TABLETS ---
    if (p.category === 'Tablets') {
        enriched.storage = getAttribute(p.id, ['64GB', '128GB', '256GB', '512GB']);
        enriched.connectivity = getAttribute(p.id, ['Wi-Fi', 'Wi-Fi + Cellular']);
    }

    // --- CAMERAS ---
    if (p.category === 'Cameras') {
        enriched.type = getAttribute(p.id, ['DSLR', 'Mirrorless', 'Action', 'Point & Shoot']);
        enriched.resolution = getAttribute(p.id, ['20MP', '24MP', '45MP', '60MP']);
    }

    return enriched;
});

export function useProductSystem(initialProducts) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 1000000]);
    const [selectedGender, setSelectedGender] = useState("All");
    const [minRating, setMinRating] = useState(0);
    const [sortOption, setSortOption] = useState("popularity");

    // Advanced Filters State
    const [selectedRam, setSelectedRam] = useState([]);
    const [selectedStorage, setSelectedStorage] = useState([]);
    const [selectedSize, setSelectedSize] = useState([]);
    const [selectedColor, setSelectedColor] = useState([]);
    const [selectedType, setSelectedType] = useState([]); // Audio type, Watch display type
    const [selectedConnectivity, setSelectedConnectivity] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState([]);
    const [selectedResolution, setSelectedResolution] = useState([]);

    // 1. Enrich Data
    const allEnrichedProducts = useMemo(() => ENRICHED_PRODUCTS(initialProducts), [initialProducts]);

    // 2. Base Products (Search + Category)
    const baseProducts = useMemo(() => {
        let result = [...allEnrichedProducts];

        if (searchQuery) {
            const words = searchQuery.toLowerCase().split(/\s+/).filter(w => w.length > 0);
            result = result.filter(p => {
                const searchString = `${p.name} ${p.brand || ''} ${p.category} ${p.description}`.toLowerCase();
                return words.every(word => searchString.includes(word));
            });
        }

        if (selectedCategory !== "All") {
            result = result.filter(p => p.category === selectedCategory);
        }

        return result;
    }, [allEnrichedProducts, searchQuery, selectedCategory]);

    // 3. Final Filtered Products
    const filteredProducts = useMemo(() => {
        let result = [...baseProducts];

        // --- COMMON FILTERS ---
        if (selectedBrands.length > 0) result = result.filter(p => selectedBrands.includes(p.brand));
        if (selectedGender !== "All") {
            if (["Men", "Women"].includes(selectedGender)) {
                result = result.filter(p => p.gender === selectedGender || p.gender === "Unisex");
            } else {
                result = result.filter(p => p.gender === selectedGender);
            }
        }
        result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
        if (minRating > 0) result = result.filter(p => p.rating >= minRating);

        // --- CATEGORY SPECIFIC FILTERS ---

        // Tech Specs (Mobiles, Laptops, Tablets)
        if (selectedRam.length > 0) result = result.filter(p => selectedRam.includes(p.ram));
        if (selectedStorage.length > 0) result = result.filter(p => selectedStorage.includes(p.storage));
        if (selectedResolution.length > 0) result = result.filter(p => selectedResolution.includes(p.resolution));

        // Fashion (Clothing, Accessories, Bags)
        if (selectedSize.length > 0) result = result.filter(p => selectedSize.includes(p.size));
        if (selectedColor.length > 0) result = result.filter(p => selectedColor.includes(p.color));
        if (selectedMaterial.length > 0) result = result.filter(p => selectedMaterial.includes(p.material));

        // Audio / Watches / Cameras / Accessories
        if (selectedType.length > 0) {
            result = result.filter(p => selectedType.includes(p.type) || selectedType.includes(p.display));
        }
        if (selectedConnectivity.length > 0) result = result.filter(p => selectedConnectivity.includes(p.connectivity));

        // --- SORTING ---
        const scoredResult = result.map(p => ({
            ...p,
            _score: RankingSystem.computeScore(p, searchQuery)
        }));

        scoredResult.sort((a, b) => {
            switch (sortOption) {
                case "price-asc": return a.price - b.price;
                case "price-desc": return b.price - a.price;
                case "newest": return new Date(b.createdAt || 0) - new Date(a.createdAt || 0) || (b.isNew ? 1 : -1);
                case "rating": return b.rating - a.rating;
                case "popularity": return b.reviews - a.reviews;
                default: return b._score - a._score;
            }
        });

        return scoredResult;
    }, [baseProducts, selectedBrands, selectedGender, priceRange, minRating, sortOption, searchQuery, selectedRam, selectedStorage, selectedSize, selectedColor, selectedType, selectedConnectivity, selectedMaterial, selectedResolution]);

    // 4. Extract Available Options for UI
    const getOptions = (key) => [...new Set(baseProducts.map(p => p[key]).filter(Boolean))].sort();

    return {
        products: filteredProducts,
        searchQuery, setSearchQuery,
        selectedCategory, setSelectedCategory,
        selectedBrands, setSelectedBrands,
        priceRange, setPriceRange,
        selectedGender, setSelectedGender,
        minRating, setMinRating,
        sortOption, setSortOption,

        // Advanced Filter States & Setters
        selectedRam, setSelectedRam,
        selectedStorage, setSelectedStorage,
        selectedSize, setSelectedSize,
        selectedColor, setSelectedColor,
        selectedType, setSelectedType,
        selectedConnectivity, setSelectedConnectivity,
        selectedMaterial, setSelectedMaterial,
        selectedResolution, setSelectedResolution,

        // Available Options
        availableBrands: getOptions('brand'),
        availableGenders: getOptions('gender'),
        availableRam: getOptions('ram'),
        availableStorage: getOptions('storage'),
        availableSizes: getOptions('size'),
        availableColors: getOptions('color'),
        availableTypes: [...getOptions('type'), ...getOptions('display')], // Merged
        availableConnectivity: getOptions('connectivity'),
        availableMaterials: getOptions('material'),
        availableResolutions: getOptions('resolution'),

        globalMaxPrice: baseProducts.length ? Math.max(...baseProducts.map(p => p.price)) : 10000
    };
}

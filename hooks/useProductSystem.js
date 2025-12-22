
import { useState, useMemo } from 'react';

export function useProductSystem(initialProducts) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 1000000]);
    const [selectedGender, setSelectedGender] = useState("All");
    const [minRating, setMinRating] = useState(0);
    const [sortOption, setSortOption] = useState("popularity"); // popularity, price-asc, price-desc, newest, rating

    // 1. Base Products (Search + Category only) - Used for determining available filters
    const baseProducts = useMemo(() => {
        let result = [...initialProducts];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p => {
                const searchString = `${p.name} ${p.brand || ''} ${p.category} ${p.subCategory || ''} ${p.description}`.toLowerCase();
                return searchString.includes(query);
            });
        }

        if (selectedCategory !== "All") {
            result = result.filter(p => p.category === selectedCategory);
        }

        return result;
    }, [initialProducts, searchQuery, selectedCategory]);

    // 2. Final Filtered Products (Apply remaining filters to base)
    const filteredProducts = useMemo(() => {
        let result = [...baseProducts];

        // Brand Filter
        if (selectedBrands.length > 0) {
            result = result.filter(p => selectedBrands.includes(p.brand));
        }

        // Gender Filter
        // Gender Filter
        if (selectedGender !== "All") {
            if (["Men", "Women"].includes(selectedGender)) {
                // For Men and Women, include Unisex items (typically Smartwatches)
                result = result.filter(p => p.gender === selectedGender || p.gender === "Unisex");
            } else {
                // For Kids, Unisex, and others, use strict filtering to avoid mixing adult items
                result = result.filter(p => p.gender === selectedGender);
            }
        }

        // Price Filter
        result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        // Rating Filter
        if (minRating > 0) {
            result = result.filter(p => p.rating >= minRating);
        }

        // Sorting
        result.sort((a, b) => {
            switch (sortOption) {
                case "price-asc":
                    return a.price - b.price;
                case "price-desc":
                    return b.price - a.price;
                case "newest":
                    return (b.newArrival === a.newArrival) ? 0 : b.newArrival ? 1 : -1;
                case "rating":
                    return b.rating - a.rating;
                case "popularity":
                default:
                    return b.reviews - a.reviews;
            }
        });

        return result;
    }, [baseProducts, selectedBrands, selectedGender, priceRange, minRating, sortOption]);

    // Derived Lists for UI (Smart Filters based on baseProducts)
    const brands = useMemo(() => {
        const availableBrands = new Set();
        baseProducts.forEach(p => {
            if (p.brand) availableBrands.add(p.brand);
        });
        return [...availableBrands].sort();
    }, [baseProducts]);

    const availableGenders = useMemo(() => {
        const genders = new Set();
        baseProducts.forEach(p => {
            if (p.gender) genders.add(p.gender);
        });
        return [...genders];
    }, [baseProducts]);

    const maxPrice = useMemo(() => {
        if (baseProducts.length === 0) return 10000;
        return Math.max(...baseProducts.map(p => p.price));
    }, [baseProducts]);

    return {
        products: filteredProducts,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedBrands,
        setSelectedBrands,
        priceRange,
        setPriceRange,
        selectedGender,
        setSelectedGender,
        minRating,
        setMinRating,
        sortOption,
        setSortOption,
        availableBrands: brands,
        availableGenders,
        globalMaxPrice: maxPrice
    };
}


import { useState, useMemo } from 'react';

export function useProductSystem(initialProducts) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 5000]);
    const [selectedGender, setSelectedGender] = useState("All");
    const [minRating, setMinRating] = useState(0);
    const [sortOption, setSortOption] = useState("popularity"); // popularity, price-asc, price-desc, newest, rating

    const filteredProducts = useMemo(() => {
        let result = [...initialProducts];

        // 1. Search Logic (Weighted)
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p => {
                const searchString = `${p.name} ${p.brand || ''} ${p.category} ${p.subCategory || ''} ${p.description}`.toLowerCase();
                return searchString.includes(query);
            });
        }

        // 2. Category Filter
        if (selectedCategory !== "All") {
            result = result.filter(p => p.category === selectedCategory);
        }

        // 3. Brand Filter
        if (selectedBrands.length > 0) {
            result = result.filter(p => selectedBrands.includes(p.brand));
        }

        // 4. Gender Filter
        if (selectedGender !== "All") {
            result = result.filter(p => p.gender === selectedGender || p.gender === "Unisex");
        }

        // 5. Price Filter
        result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        // 6. Rating Filter
        if (minRating > 0) {
            result = result.filter(p => p.rating >= minRating);
        }

        // 7. Sorting
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
    }, [initialProducts, searchQuery, selectedCategory, selectedBrands, selectedGender, priceRange, minRating, sortOption]);

    // Derived Lists for UI
    const brands = useMemo(() => {
        const availableBrands = new Set();
        // Only show brands relevant to current category to be smart
        const sourceData = selectedCategory === "All" ? initialProducts : initialProducts.filter(p => p.category === selectedCategory);
        sourceData.forEach(p => {
            if (p.brand) availableBrands.add(p.brand);
        });
        return [...availableBrands].sort();
    }, [initialProducts, selectedCategory]);

    const maxPrice = useMemo(() => {
        return Math.max(...initialProducts.map(p => p.price)) + 100;
    }, [initialProducts]);

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
        globalMaxPrice: maxPrice
    };
}

import { useState, useEffect, useMemo } from 'react';
import { products as allProducts } from '@/data/products';

export function useRecommendations(currentProduct) {
    const [fbtProducts, setFbtProducts] = useState([]);
    const [recommendedProducts, setRecommendedProducts] = useState([]);

    // 1. Frequently Bought Together Logic
    useEffect(() => {
        if (!currentProduct) return;

        let recommendations = [];

        // Define complementary categories
        const complementaryRules = {
            'Smartphones': ['Audio', 'Accessories', 'Watch'],
            'Laptops': ['Accessories', 'Audio', 'Bags'],
            'Cameras': ['Accessories', 'Bags'],
            'Menswear': ['Footwear', 'Watch', 'Accessories'],
            'Womenswear': ['Footwear', 'Bags', 'Accessories'],
            'Tablets': ['Audio', 'Accessories'],
            'TVs': ['Audio', 'Home Appliances']
        };

        const targetCategories = complementaryRules[currentProduct.category] || ['Accessories'];

        // Find products in target categories
        recommendations = allProducts.filter(p =>
            targetCategories.includes(p.category) &&
            p.id !== currentProduct.id &&
            p.stock > 0
        );

        // Sort by rating/popularity to get best matches
        recommendations.sort((a, b) => b.rating - a.rating);

        // Take top 2-3 items
        setFbtProducts(recommendations.slice(0, 3));

    }, [currentProduct]);

    // 2. Recommended For You (Personalization) Logic
    useEffect(() => {
        // Get history from local storage
        const history = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');

        if (history.length === 0) {
            // Fallback: Trending products (high rating + high reviews)
            const trending = allProducts
                .sort((a, b) => (b.reviews * b.rating) - (a.reviews * a.rating))
                .slice(0, 5);
            setRecommendedProducts(trending);
            return;
        }

        // Extract user preferences
        const viewedCategories = new Set(history.map(p => p.category));
        const viewedBrands = new Set(history.map(p => p.brand));
        const viewedIds = new Set(history.map(p => p.id));

        // Score products based on relevance
        const scoredProducts = allProducts.map(p => {
            if (viewedIds.has(p.id)) return { ...p, score: -1 }; // Exclude viewed

            let score = 0;
            if (viewedCategories.has(p.category)) score += 5;
            if (viewedBrands.has(p.brand)) score += 3;
            score += p.rating * 0.5; // Quality bias

            return { ...p, score };
        });

        // Filter and sort
        const personalized = scoredProducts
            .filter(p => p.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 8);

        setRecommendedProducts(personalized);

    }, [currentProduct]); // Re-run when page changes (user views new product)

    return { fbtProducts, recommendedProducts };
}

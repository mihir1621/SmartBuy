export class RankingSystem {
    // Relevance Weights (Flipkart/Amazon style importance)
    static WEIGHTS = {
        TEXT_RELEVANCE: 0.35,  // W1: Highest priority (Match query FIRST)
        SALES_VELOCITY: 0.15,  // W2: Popular items rank higher
        RATING_SCORE: 0.10,    // W5: High rated items > low rated
        DISCOUNT_ATTRACTIVENESS: 0.05, // Users love deals
        PRICE_RELEVANCE: 0.10, // Price range affinity
        BRAND_AFFINITY: 0.10,  // Official/Top brands
        FRESHNESS: 0.05,       // New arrivals
        IN_STOCK: 0.10         // W6: Availability is critical
    };

    /**
     * Compute comprehensive ranking score for a product
     */
    static computeScore(product, query) {
        let score = 0;

        // 1. Text Relevance (W1) - The Foundation
        const textScore = this.calculateTextRelevance(product, query);
        score += textScore * this.WEIGHTS.TEXT_RELEVANCE;

        // 2. Sales/Popularity (W2)
        // Normalized review count as a proxy for sales velocity
        const popularityScore = Math.min(product.reviews / 1000, 1);
        score += popularityScore * this.WEIGHTS.SALES_VELOCITY;

        // 3. Rating Quality (W5)
        // 4.5+ is great, 3.0 is poor. Normalize 0-5 to 0-1
        const ratingScore = (product.rating || 0) / 5;
        score += ratingScore * this.WEIGHTS.RATING_SCORE;

        // 4. Discount Attractiveness
        const discountScore = (product.discount || 0) / 100; // 50% discount = 0.5
        score += discountScore * this.WEIGHTS.DISCOUNT_ATTRACTIVENESS;

        // 5. Freshness
        const freshnessScore = product.isNew ? 1 : 0;
        score += freshnessScore * this.WEIGHTS.FRESHNESS;

        // 6. Availability (W6)
        // Out of stock should be punished heavily (-1 or 0)
        const stockScore = product.inStock ? 1 : 0;
        score += stockScore * this.WEIGHTS.IN_STOCK;

        return score;
    }

    /**
     * Advanced Text Matching Algorithm
     * Handles exact matches, partial matches, category matches, and synonyms
     */
    static calculateTextRelevance(product, query) {
        if (!query) return 1; // If no query, text relevance is neutral/equal

        const q = query.toLowerCase();
        const name = product.name.toLowerCase();
        const brand = (product.brand || "").toLowerCase();
        const category = product.category.toLowerCase();
        const description = (product.description || "").toLowerCase();

        // Tier 1: Exact Name Match (Highest Value)
        if (name === q) return 1.0;

        // Tier 2: Name Starts With Query
        if (name.startsWith(q)) return 0.95;

        // Tier 3: Brand Match
        if (brand === q) return 0.90;

        // Tier 4: Category Match
        if (category.includes(q)) return 0.85;

        // Tier 5: Name Contains Query
        if (name.includes(q)) return 0.80;

        // Tier 6: Description contains (Lowest)
        if (description.includes(q)) return 0.50;

        // Tier 7: Fuzzy/Synonym Match (Simulated)
        // Example: "phone" matches "mobile"
        if (this.checkSynonyms(q, [name, brand, category])) return 0.70;

        return 0; // No match
    }

    /**
     * Simple Synonym Engine
     */
    static checkSynonyms(query, fields) {
        const synonyms = {
            "phone": ["mobile", "smartphone", "iphone", "android"],
            "laptop": ["macbook", "notebook", "computer"],
            "shoe": ["sneaker", "footwear", "boot", "running"],
            "tv": ["television", "led", "oled", "smart tv"],
            "watch": ["smartwatch", "wearable", "band"]
        };

        for (const [key, similarWords] of Object.entries(synonyms)) {
            // If query is a key ("phone") and fields contain value ("mobile")
            if (key === query) {
                if (fields.some(f => similarWords.some(w => f.includes(w)))) return true;
            }
            // If query is a value ("mobile") and fields contain key ("phone")
            if (similarWords.includes(query)) {
                if (fields.some(f => f.includes(key))) return true;
            }
        }
        return false;
    }
}

import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from local storage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('smartbuy_wishlist');
            if (saved) {
                try {
                    setWishlist(JSON.parse(saved));
                } catch (e) {
                    console.error("Failed to parse wishlist", e);
                }
            }
            setIsInitialized(true);
        }
    }, []);

    // Save to local storage
    useEffect(() => {
        if (isInitialized && typeof window !== 'undefined') {
            localStorage.setItem('smartbuy_wishlist', JSON.stringify(wishlist));
        }
    }, [wishlist, isInitialized]);

    const addToWishlist = (product) => {
        setWishlist((prev) => {
            if (prev.some(item => item.id === product.id)) return prev;
            return [...prev, product];
        });
    };

    const removeFromWishlist = (productId) => {
        setWishlist((prev) => prev.filter((item) => item.id !== productId));
    };

    const toggleWishlist = (product) => {
        if (wishlist.some(item => item.id === product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => item.id === productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    return useContext(WishlistContext);
}

import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const { data: session } = useSession();
    const [wishlist, setWishlist] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initial Load
    useEffect(() => {
        const initWishlist = async () => {
            if (session) {
                // Fetch from DB if logged in
                try {
                    const res = await fetch('/api/wishlist');
                    if (res.ok) {
                        const data = await res.json();
                        setWishlist(data);
                    }
                } catch (error) {
                    console.error("Failed to fetch wishlist from DB", error);
                }
            } else if (typeof window !== 'undefined') {
                // Fetch from local storage if NOT logged in
                const saved = localStorage.getItem('smartbuy_wishlist');
                if (saved) {
                    try {
                        setWishlist(JSON.parse(saved));
                    } catch (e) {
                        console.error("Failed to parse local wishlist", e);
                    }
                }
            }
            setIsInitialized(true);
        };

        initWishlist();
    }, [session]);

    // Save to local storage ONLY if NOT logged in
    useEffect(() => {
        if (isInitialized && !session && typeof window !== 'undefined') {
            localStorage.setItem('smartbuy_wishlist', JSON.stringify(wishlist));
        }
    }, [wishlist, isInitialized, session]);

    const addToWishlist = async (product) => {
        if (session) {
            try {
                const res = await fetch('/api/wishlist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId: product.id })
                });
                if (res.ok) {
                    setWishlist(prev => [...prev.filter(p => p.id !== product.id), product]);
                }
            } catch (error) {
                console.error("Failed to add to remote wishlist", error);
            }
        } else {
            setWishlist((prev) => {
                if (prev.some(item => item.id === product.id)) return prev;
                return [...prev, product];
            });
        }
    };

    const removeFromWishlist = async (productId) => {
        if (session) {
            try {
                const res = await fetch('/api/wishlist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId })
                });
                if (res.ok) {
                    setWishlist(prev => prev.filter(item => item.id !== productId));
                }
            } catch (error) {
                console.error("Failed to remove from remote wishlist", error);
            }
        } else {
            setWishlist((prev) => prev.filter((item) => item.id !== productId));
        }
    };

    const toggleWishlist = async (product) => {
        if (wishlist.some(item => item.id === product.id)) {
            await removeFromWishlist(product.id);
        } else {
            await addToWishlist(product);
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

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initial Load
    useEffect(() => {
        const initWishlist = async () => {
            if (user) {
                // Fetch from DB if logged in
                try {
                    const res = await fetch(`/api/wishlist?userId=${user.uid}&email=${encodeURIComponent(user.email)}`);
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
    }, [user]);

    // Save to local storage ONLY if NOT logged in
    useEffect(() => {
        if (isInitialized && !user && typeof window !== 'undefined') {
            localStorage.setItem('smartbuy_wishlist', JSON.stringify(wishlist));
        }
    }, [wishlist, isInitialized, user]);

    const addToWishlist = async (product) => {
        if (user) {
            try {
                const res = await fetch('/api/wishlist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId: product.id, userId: user.uid, email: user.email })
                });
                if (res.ok) {
                    setWishlist(prev => [...prev.filter(p => p.id !== product.id), product]);
                    toast.success("Added to wishlist!");
                }
            } catch (error) {
                console.error("Failed to add to remote wishlist", error);
            }
        } else {
            setWishlist((prev) => {
                if (prev.some(item => item.id === product.id)) return prev;
                toast.success("Added to wishlist!");
                return [...prev, product];
            });
        }
    };

    const removeFromWishlist = async (productId) => {
        if (user) {
            try {
                const res = await fetch('/api/wishlist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId, userId: user.uid, email: user.email })
                });
                if (res.ok) {
                    setWishlist(prev => prev.filter(item => item.id !== productId));
                    toast.info("Removed from wishlist");
                }
            } catch (error) {
                console.error("Failed to remove from remote wishlist", error);
            }
        } else {
            setWishlist((prev) => prev.filter((item) => item.id !== productId));
            toast.info("Removed from wishlist");
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

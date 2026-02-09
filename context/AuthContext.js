import { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    GoogleAuthProvider,
    updateProfile
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const syncUserWithBackend = async (firebaseUser, role = null) => {
        try {
            const res = await fetch('/api/auth/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName,
                    image: firebaseUser.photoURL,
                    role: role // Optional, mostly for new creations
                })
            });
            if (res.ok) {
                const dbUser = await res.json();
                return { ...firebaseUser, ...dbUser };
            }
            console.error("Failed to sync user with backend");
            return firebaseUser;
        } catch (e) {
            console.error("Auth Sync Error", e);
            return firebaseUser;
        }
    };

    useEffect(() => {
        if (!auth) {
            setLoading(false);
            return;
        }

        // Handle Redirect Result (Fallback from Popup Blocked)
        getRedirectResult(auth).then(async (result) => {
            if (result && result.user) {
                console.log("Redirect Login Success");
                const role = sessionStorage.getItem('auth_role_pending') || 'customer';
                sessionStorage.removeItem('auth_role_pending');

                const syncedUser = await syncUserWithBackend(result.user, role);
                setUser(syncedUser);
                toast.success(`Welcome back, ${syncedUser.displayName || 'User'}!`);
            }
        }).catch((error) => {
            console.error("Redirect Auth Error:", error);
            if (error.code !== 'auth/redirect-cancelled-by-user') {
                toast.error("Login failed: " + error.message);
            }
        });

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Sync with backend to get Role and ID
                const syncedUser = await syncUserWithBackend(firebaseUser);
                setUser(syncedUser);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const signup = async (email, password, name, role) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = result.user;

        await updateProfile(newUser, { displayName: name });

        // Force Backend Sync/Create
        const syncedUser = await syncUserWithBackend(newUser, role);
        setUser(syncedUser);

        return newUser;
    };

    const loginWithGoogle = async (role = 'customer') => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Sync with backend (will create if first time)
            await syncUserWithBackend(user, role);

            return user;
        } catch (error) {
            if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
                console.warn("Popup blocked, falling back to redirect...");
                sessionStorage.setItem('auth_role_pending', role);
                await signInWithRedirect(auth, provider);
                return null; // Will redirect
            }
            throw error;
        }
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, loginWithGoogle, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);


import { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    signInWithPopup,
    GoogleAuthProvider,
    updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Fetch user role and additional data from Firestore
                    const userDocRef = doc(db, "users", firebaseUser.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUser({ ...firebaseUser, ...userData });
                    } else {
                        // If user exists in Auth but not in Firestore (e.g. fresh Google Login that wasn't handled yet)
                        // We might handle this in the login component, or basic fallback here
                        setUser(firebaseUser);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setUser(firebaseUser);
                }
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

        // Create User Document
        await setDoc(doc(db, "users", newUser.uid), {
            id: newUser.uid,
            name: name,
            email: email,
            role: role,
            createdAt: new Date().toISOString(),
            cart: [],
            wishlist: []
        });

        // Force refresh user state
        const userDoc = await getDoc(doc(db, "users", newUser.uid));
        setUser({ ...newUser, ...userDoc.data() });

        return newUser;
    };

    const loginWithGoogle = async (role = 'customer') => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check if user exists
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            // Create new user if first time
            await setDoc(userDocRef, {
                id: user.uid,
                name: user.displayName,
                email: user.email,
                role: role,
                createdAt: new Date().toISOString(),
                cart: [],
                wishlist: []
            });
        }

        return user;
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

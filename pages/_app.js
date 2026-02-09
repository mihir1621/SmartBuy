import { ThemeProvider } from "next-themes";
import "../styles/globals.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Head from "next/head";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { LocationProvider } from "@/context/LocationContext";
import { AuthProvider } from "@/context/AuthContext";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { HomeSkeleton, ProductDetailSkeleton, GenericSkeleton, OrderSkeleton, WishlistSkeleton } from "@/components/skeletons/PageSkeletons";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [targetPath, setTargetPath] = useState(null);

  useEffect(() => {
    const handleStart = (url, { shallow }) => {
      if (shallow) return;
      setTargetPath(url);
      setLoading(true);
    };
    const handleComplete = () => {
      setLoading(false);
      setTargetPath(null);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  const getSkeleton = () => {
    if (!targetPath) return <GenericSkeleton />;
    // Handle query parameters by checking the base path
    const path = targetPath.split('?')[0];

    if (path === '/') return <HomeSkeleton />;
    if (path.startsWith('/product/')) return <ProductDetailSkeleton />;
    if (path.startsWith('/orders')) return <OrderSkeleton />;
    if (path === '/wishlist') return <WishlistSkeleton />;
    if (path === '/login' || path === '/signup') return null;

    return <GenericSkeleton />;
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <LocationProvider>
          <WishlistProvider>
            <CartProvider>
              <div className="relative min-h-screen flex flex-col font-sans text-gray-900 dark:text-gray-100 bg-[var(--background)] transition-colors duration-300">
                {loading ? getSkeleton() : <Component {...pageProps} />}
              </div>
              <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
            </CartProvider>
          </WishlistProvider>
        </LocationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

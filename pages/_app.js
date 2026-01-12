import "@/styles/globals.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { LocationProvider } from "@/context/LocationContext";
import { AuthProvider } from "@/context/AuthContext";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <AuthProvider>
        <LocationProvider>
          <WishlistProvider>
            <CartProvider>
              <div className="relative min-h-screen flex flex-col font-sans text-gray-900">
                <Component {...pageProps} />
              </div>
              <ToastContainer position="bottom-right" autoClose={3000} />
            </CartProvider>
          </WishlistProvider>
        </LocationProvider>
      </AuthProvider>
    </SessionProvider>
  );
}

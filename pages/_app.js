import "@/styles/globals.css";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { LocationProvider } from "@/context/LocationContext";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <LocationProvider>
        <WishlistProvider>
          <CartProvider>
            <div className="relative min-h-screen flex flex-col font-sans text-gray-900">
              <Component {...pageProps} />
            </div>
          </CartProvider>
        </WishlistProvider>
      </LocationProvider>
    </SessionProvider>
  );
}

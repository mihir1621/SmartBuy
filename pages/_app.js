import "@/styles/globals.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Head from "next/head";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { LocationProvider } from "@/context/LocationContext";
import { AuthProvider } from "@/context/AuthContext";

export default function App({ Component, pageProps }) {
  return (
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
  );
}

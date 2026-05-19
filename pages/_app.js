import { ThemeProvider } from "next-themes";
import "../styles/globals.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Head from "next/head";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { LocationProvider } from "@/context/LocationContext";
import { useOfflineSync } from "@/hooks/useOfflineSync";
import OfflineIndicator from "@/components/OfflineIndicator";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { requestNotificationPermission, onForegroundMessage } from "@/lib/notifications";

function NotificationHandler() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Request permission and sync token
      requestNotificationPermission(user.uid);
      
      // Setup foreground listener
      onForegroundMessage();
    }
  }, [user]);

  return null;
}

export default function App({ Component, pageProps }) {
  const router = useRouter();
  
  // Initialize Offline Sync Engine
  useOfflineSync();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <LocationProvider>
          <WishlistProvider>
            <CartProvider>
              <NotificationHandler />
              <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
              </Head>
              <AnimatePresence mode="wait">
                <motion.div
                  key={router.route}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="min-h-screen flex flex-col"
                >
                  <Component {...pageProps} />
                </motion.div>
              </AnimatePresence>
              <ToastContainer theme="colored" position="bottom-right" />
              <OfflineIndicator />
            </CartProvider>
          </WishlistProvider>
        </LocationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

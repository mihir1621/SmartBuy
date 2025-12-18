import "@/styles/globals.css";
import Head from "next/head";
import { CartProvider } from "@/context/CartContext";

import { SessionProvider } from "next-auth/react"

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <CartProvider>
        <Head>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          />
        </Head>
        <div className="relative min-h-screen flex flex-col font-sans text-gray-900">
          <Component {...pageProps} />
        </div>
      </CartProvider>
    </SessionProvider>
  );
}

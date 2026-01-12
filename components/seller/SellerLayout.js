import Head from 'next/head';
import Image from 'next/image';
import SellerSidebar from './SellerSidebar';
import { Bell, Search, User, ShieldAlert, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SellerLayout({ children, title }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/seller/login');
        } else if (status === 'authenticated' && session?.user?.role !== 'SELLER') {
            // If logged in but not a seller (e.g. USER or ADMIN), redirect or show error.
            // For smoother flow, maybe redirect to seller registration or generic login.
            // But strict requirement says "only useful for seller", so redirecting to seller login logic check.
            router.push('/seller/login');
        }
    }, [status, session, router]);

    useEffect(() => {
        // Sync search bar with URL query if present (only on products page to avoid confusion)
        if (router.pathname.includes('/seller/products') && router.query.search) {
            setSearchQuery(router.query.search);
        }
    }, [router.pathname, router.query.search]);

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            router.push(`/seller/products?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="text-orange-500 animate-spin" size={40} />
                    <p className="text-gray-500 font-bold animate-pulse text-sm uppercase tracking-widest">Loading Seller Hub...</p>
                </div>
            </div>
        );
    }

    if (!session || session.user.role !== 'SELLER') {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
                <div className="max-w-md space-y-6">
                    <div className="w-20 h-20 bg-gray-800 rounded-3xl flex items-center justify-center mx-auto border border-gray-700 text-gray-500">
                        <User size={40} />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Seller Access Only</h1>
                    <p className="text-gray-500 font-medium italic">
                        &quot;This area is exclusive to verified Sellers. Please log in with a Seller account.&quot;
                    </p>
                    <div className="flex flex-col gap-3 pt-4">
                        <button
                            onClick={() => router.push('/seller/login')}
                            className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-2xl transition-all"
                        >
                            Log in as Seller
                        </button>
                        <Link href="/" className="text-gray-500 font-bold hover:text-white py-2">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <Head>
                <title>{title ? `${title} | Seller Hub` : 'SmartBuy Seller'}</title>
            </Head>

            <SellerSidebar />

            <div className="lg:ml-72 min-h-screen flex flex-col">
                <header className="h-20 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-30 px-6 lg:px-10 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">{title || 'Dashboard'}</h2>
                        <p className="text-xs text-gray-400 font-medium">Store: {session.user.name || 'My Store'}</p>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="hidden md:flex items-center bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 gap-3 focus-within:ring-2 focus-within:ring-orange-500/50 transition-all">
                            <Search size={18} className="text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search inventory..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                className="bg-transparent border-none outline-none text-sm w-48 text-gray-200 placeholder:text-gray-600"
                            />
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 border-l border-gray-800 pl-4 sm:pl-6">
                            <button className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 transition-all relative">
                                <Bell size={20} />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-gray-900" />
                            </button>

                            <div className="flex items-center gap-3 ml-2 group cursor-pointer">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gray-800 to-gray-700 border border-gray-700 flex items-center justify-center text-gray-200 group-hover:scale-105 transition-transform overflow-hidden">
                                    {session.user.image ? (
                                        <Image src={session.user.image} alt="Seller" fill className="object-cover" />
                                    ) : (
                                        <User size={20} />
                                    )}
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-sm font-bold leading-tight group-hover:text-orange-400 transition-colors capitalize">{session.user.name}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{session.user.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}

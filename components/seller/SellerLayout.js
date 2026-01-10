import Head from 'next/head';
import Image from 'next/image';
import { Package, Plus, BarChart, Settings, LogOut, ShoppingBag, User } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Link from 'next/link';
import { Loader2, ShieldAlert } from 'lucide-react';

export default function SellerLayout({ children, title }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login?callbackUrl=' + encodeURIComponent(router.asPath));
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="text-orange-500 animate-spin" size={40} />
            </div>
        );
    }

    if (!session || session.user.role !== 'SELLER') {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
                <div className="max-w-md space-y-6">
                    <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto border border-red-500/20 text-red-500 shadow-2xl shadow-red-500/10">
                        <ShieldAlert size={40} />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Access Restricted</h1>
                    <p className="text-gray-500 font-medium italic">
                        &quot;This area is exclusive to verified Sellers. Please log in with a Seller account.&quot;
                    </p>
                    <div className="flex flex-col gap-3 pt-4">
                        <Link href="/" className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 rounded-2xl transition-all">
                            Back to Home
                        </Link>
                        <button
                            onClick={() => router.push('/login')}
                            className="text-orange-400 font-bold hover:underline py-2"
                        >
                            Log in as Seller
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const navigation = [
        { name: 'Dashboard', href: '/seller', icon: BarChart },
        { name: 'My Products', href: '/seller/products', icon: Package },
        { name: 'Add Product', href: '/seller/products/new', icon: Plus },
        { name: 'Orders', href: '/seller/orders', icon: ShoppingBag },
        { name: 'Settings', href: '/seller/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            <Head>
                <title>{title ? `${title} | Seller Center` : 'SmartBuy Seller'}</title>
            </Head>

            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-64 bg-gray-900 border-r border-gray-800 hidden lg:flex flex-col z-20">
                <div className="h-20 flex items-center px-8 border-b border-gray-800">
                    <span className="text-xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Seller Center</span>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2">
                    {navigation.map((item) => {
                        const isActive = router.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive
                                    ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                    }`}
                            >
                                <item.icon size={20} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex w-full items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all font-bold"
                    >
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:ml-64 min-h-screen flex flex-col">
                <header className="h-20 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-30 px-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">{title || 'Dashboard'}</h2>
                    </div>
                </header>

                <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}

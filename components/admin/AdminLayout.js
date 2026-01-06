import Head from 'next/head';
import AdminSidebar from './AdminSidebar';
import { Bell, Search, User, ShieldAlert, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminLayout({ children, title }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login?callbackUrl=' + encodeURIComponent(router.asPath));
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="text-blue-500 animate-spin" size={40} />
                    <p className="text-gray-500 font-bold animate-pulse text-sm uppercase tracking-widest">Verifying Admin Session...</p>
                </div>
            </div>
        );
    }

    if (!session || session.user.role !== 'ADMIN') {
        return (
            <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-6 text-center">
                <div className="max-w-md space-y-6">
                    <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto border border-red-500/20 text-red-500 shadow-2xl shadow-red-500/10">
                        <ShieldAlert size={40} />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Access Restricted</h1>
                    <p className="text-gray-500 font-medium italic">
                        "Your current account does not have administrative privileges. Please log in with an authorized administrator account to access this panel."
                    </p>
                    <div className="flex flex-col gap-3 pt-4">
                        <Link href="/" className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 rounded-2xl transition-all">
                            Back to Home
                        </Link>
                        <button
                            onClick={() => router.push('/login')}
                            className="text-blue-400 font-bold hover:underline py-2"
                        >
                            Sign in as Admin
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-white">
            <Head>
                <title>{title ? `${title} | Admin Dashboard` : 'SmartBuy Admin'}</title>
            </Head>

            <AdminSidebar />

            <div className="lg:ml-72 min-h-screen flex flex-col">
                <header className="h-20 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-30 px-6 lg:px-10 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">{title || 'Dashboard'}</h2>
                        <p className="text-xs text-gray-400 font-medium">Welcome back, {session.user.name || 'Admin'}</p>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="hidden md:flex items-center bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 gap-3 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
                            <Search size={18} className="text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search orders, products..."
                                className="bg-transparent border-none outline-none text-sm w-64 text-gray-200 placeholder:text-gray-600"
                            />
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 border-l border-gray-800 pl-4 sm:pl-6">
                            <button className="p-2.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700 transition-all relative">
                                <Bell size={20} />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-gray-900" />
                            </button>

                            <div className="flex items-center gap-3 ml-2 group cursor-pointer">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gray-700 to-gray-600 border border-gray-600 flex items-center justify-center text-gray-200 group-hover:scale-105 transition-transform overflow-hidden">
                                    {session.user.image ? (
                                        <img src={session.user.image} alt="Admin" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={20} />
                                    )}
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-sm font-bold leading-tight group-hover:text-blue-400 transition-colors capitalize">{session.user.name}</p>
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

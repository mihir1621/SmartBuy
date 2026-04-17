import Head from 'next/head';
import Image from 'next/image';
import AdminSidebar from './AdminSidebar';
import { Bell, Search, User, ShieldAlert, Loader2, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminLayout({ children, title }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login?callbackUrl=' + encodeURIComponent(router.asPath));
            } else if (user.role !== 'ADMIN' && user.role !== 'admin') {
                router.push('/login');
            }
        }
    }, [user, loading, router]);


    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="text-secondary-text animate-spin" size={40} />
                    <p className="text-secondary-text font-black animate-pulse text-sm uppercase tracking-[0.2em]">Verifying Admin Session...</p>
                </div>
            </div>
        );
    }



    if (!user || (user.role !== 'ADMIN' && user.role !== 'admin')) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="text-accent animate-spin" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors">
            <Head>
                <title>{title ? `${title} | Admin Dashboard` : 'SmartBuy Admin'}</title>
            </Head>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <AdminSidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

            <div className="lg:ml-72 min-h-screen flex flex-col">
                <header className="h-20 border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-30 px-6 lg:px-10 flex items-center justify-between transition-colors">
                    <div className="flex items-center gap-4">
                        {/* Mobile Hamburger Menu */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 rounded-xl bg-background border border-border text-secondary-text hover:text-foreground hover:bg-secondary transition-all"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
 
                        <div>
                            <h2 className="text-xl font-black tracking-tight text-foreground">{title || 'Dashboard'}</h2>
                            <p className="text-xs text-secondary-text font-bold uppercase tracking-widest">Welcome back, {user.name || 'Admin'}</p>
                        </div>
                    </div>
 
                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="hidden md:flex items-center bg-background border border-border rounded-xl px-4 py-2 gap-3 focus-within:ring-2 focus-within:ring-accent/20 transition-all">
                            <Search size={18} className="text-secondary-text" />
                            <input
                                type="text"
                                placeholder="Search orders, products..."
                                className="bg-transparent border-none outline-none text-sm w-64 text-foreground placeholder:text-secondary-text/50"
                            />
                        </div>
 
                        <div className="flex items-center gap-2 sm:gap-3 border-l border-border pl-4 sm:pl-6">
                            <button className="p-2.5 rounded-xl bg-background border border-border text-secondary-text hover:text-accent hover:bg-secondary transition-all relative">
                                <Bell size={20} />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full border-2 border-background" />
                            </button>
 
                            <div className="flex items-center gap-3 ml-2 group cursor-pointer">
                                <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-foreground group-hover:scale-105 transition-transform overflow-hidden">
                                    {user.image || user.photoURL ? (
                                        <Image src={user.image || user.photoURL} alt="Admin" fill className="object-cover" />
                                    ) : (
                                        <User size={20} />
                                    )}
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-sm font-black leading-tight group-hover:text-accent transition-colors capitalize">{user.name || user.displayName}</p>
                                    <p className="text-[10px] text-secondary-text font-black uppercase tracking-wider">{user.role}</p>
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

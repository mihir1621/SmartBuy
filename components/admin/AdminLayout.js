import Head from 'next/head';
import AdminSidebar from './AdminSidebar';
import { Bell, Search, User } from 'lucide-react';

export default function AdminLayout({ children, title }) {
    return (
        <div className="min-h-screen bg-[#0a0a0c] text-white">
            <Head>
                <title>{title ? `${title} | Admin Dashboard` : 'SmartBuy Admin'}</title>
            </Head>

            <AdminSidebar />

            {/* Main Content Area */}
            <div className="lg:ml-72 min-h-screen flex flex-col">
                {/* Top Header */}
                <header className="h-20 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-30 px-6 lg:px-10 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">{title || 'Dashboard'}</h2>
                        <p className="text-xs text-gray-400 font-medium">Welcome back, Admin</p>
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
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gray-700 to-gray-600 border border-gray-600 flex items-center justify-center text-gray-200 group-hover:scale-105 transition-transform">
                                    <User size={20} />
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-sm font-bold leading-tight group-hover:text-blue-400 transition-colors">Admin User</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Super Admin</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}

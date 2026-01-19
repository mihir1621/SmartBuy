import Link from 'next/link';
import { useRouter } from 'next/router';
import { Home, Package, ShoppingBag, Settings, LogOut, Store } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function SellerSidebar({ isMobileMenuOpen, setIsMobileMenuOpen }) {
    const router = useRouter();
    const { logout } = useAuth();

    const isActive = (path) => router.pathname === path || router.pathname.startsWith(path + '/');

    const menuItems = [
        { name: 'Overview', icon: Home, path: '/seller' },
        { name: 'My Products', icon: Package, path: '/seller/products' },
        { name: 'Orders', icon: ShoppingBag, path: '/seller/orders' },
        { name: 'Settings', icon: Settings, path: '/seller/settings' },
    ];

    const handleMenuItemClick = () => {
        // Close mobile menu when clicking a menu item
        if (setIsMobileMenuOpen) {
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <aside className={`fixed left-0 top-0 h-screen w-72 bg-[#0a0a0c] border-r border-gray-800 z-50 flex flex-col transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}>
            {/* Logo Area */}
            <div className="h-20 flex items-center px-8 border-b border-gray-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-tr from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                        <Store className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-white font-black text-xl tracking-tight">Seller<span className="text-orange-500">Hub</span></h1>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
                <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Main Menu</p>
                {menuItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <Link key={item.path} href={item.path} onClick={handleMenuItemClick}>
                            <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group ${active
                                ? 'bg-orange-500/10 text-orange-500 font-bold'
                                : 'text-gray-400 hover:text-white hover:bg-gray-800/50 font-medium'
                                }`}>
                                <item.icon size={20} className={active ? 'text-orange-500' : 'text-gray-500 group-hover:text-white transition-colors'} />
                                <span>{item.name}</span>
                                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500" />}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={() => logout()}
                    className="flex items-center gap-3 px-4 py-3.5 w-full rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all font-medium group"
                >
                    <LogOut size={20} className="group-hover:text-red-400 transition-colors" />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}

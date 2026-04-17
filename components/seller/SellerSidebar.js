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
        <aside className={`fixed left-0 top-0 h-screen w-72 bg-background border-r border-border z-50 flex flex-col transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}>
            {/* Logo Area */}
            <div className="h-20 flex items-center px-8 border-b border-border transition-colors">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
                        <Store className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-foreground font-black text-xl tracking-tight">Seller<span className="text-accent">Hub</span></h1>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
                <p className="px-4 text-[10px] font-black text-secondary-text uppercase tracking-[0.2em] mb-4">Main Menu</p>
                {menuItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <Link key={item.path} href={item.path} onClick={handleMenuItemClick}>
                            <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group ${active
                                ? 'bg-accent text-white font-black shadow-lg shadow-accent/10'
                                : 'text-secondary-text hover:text-foreground hover:bg-secondary font-bold'
                                }`}>
                                <item.icon size={20} className={active ? 'text-white' : 'text-secondary-text group-hover:text-accent transition-colors'} />
                                <span>{item.name}</span>
                                {active && <motion.div layoutId="active-indicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-border">
                <button
                    onClick={() => logout()}
                    className="flex items-center gap-3 px-4 py-3.5 w-full rounded-xl text-secondary-text hover:text-error hover:bg-error/5 transition-all font-bold group"
                >
                    <LogOut size={20} className="group-hover:text-error transition-colors" />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}

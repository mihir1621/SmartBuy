import Link from 'next/link';
import { useRouter } from 'next/router';
import {
    LayoutDashboard,
    Package,
    Users,
    Settings,
    LogOut,
    ShoppingBag,
    PlusCircle
} from 'lucide-react';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Package, label: 'Products', href: '/admin/products' },
    { icon: PlusCircle, label: 'Add Product', href: '/admin/products/new' },
    { icon: ShoppingBag, label: 'Orders', href: '/admin/orders' },
    { icon: Users, label: 'Customers', href: '/admin/customers' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export default function AdminSidebar({ isMobileMenuOpen, setIsMobileMenuOpen }) {
    const router = useRouter();

    const handleMenuItemClick = () => {
        // Close mobile menu when clicking a menu item
        if (setIsMobileMenuOpen) {
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <>
            {/* Sidebar Container */}
            <aside className={`
        fixed top-0 left-0 h-full w-72 bg-gray-900 border-r border-gray-800 z-50
        transform transition-transform duration-300 flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="flex flex-col h-full p-6">
                    {/* Logo Section */}
                    <div className="flex items-center gap-3 mb-10 px-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-black rounded-xl flex items-center justify-center shadow-lg shadow-white/20">
                            <Package className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight">SmartBuy</h1>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Store Admin</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2">
                        {menuItems.map((item) => {
                            const isActive = router.pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={handleMenuItemClick}
                                    className={`
                    flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group
                    ${isActive
                                            ? 'bg-white/10 text-white border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                                            : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                                        }
                  `}
                                >
                                    <item.icon size={20} className={isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
                                    <span className="font-semibold">{item.label}</span>
                                    {isActive && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Section / Logout */}
                    <div className="mt-auto border-t border-gray-800 pt-6">
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/10 hover:text-white transition-colors group"
                        >
                            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="font-semibold">Exit Admin</span>
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
}

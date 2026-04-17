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
        fixed top-0 left-0 h-full w-72 bg-background border-r border-border z-50
        transform transition-transform duration-300 flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="flex flex-col h-full p-6">
                    {/* Logo Section */}
                    <div className="flex items-center gap-3 mb-10 px-2 transition-colors">
                        <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
                            <Package className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-foreground tracking-tight">SmartBuy</h1>
                            <p className="text-[10px] text-secondary-text font-black uppercase tracking-[0.2em]">Store Admin</p>
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
                                            ? 'bg-accent text-white shadow-lg shadow-accent/15'
                                            : 'text-secondary-text hover:bg-secondary hover:text-foreground'
                                        }
                  `}
                                >
                                    <item.icon size={20} className={isActive ? 'text-white' : 'text-secondary-text group-hover:text-accent group-hover:scale-110 transition-all'} />
                                    <span className="font-bold">{item.label}</span>
                                    {isActive && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Section / Logout */}
                    <div className="mt-auto border-t border-border pt-6">
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-secondary-text hover:bg-secondary hover:text-foreground transition-all group font-bold"
                        >
                            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Exit Admin</span>
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
}

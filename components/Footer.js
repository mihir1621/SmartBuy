
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-surface text-foreground py-10 sm:py-16 border-t border-border transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
                    {/* Brand Section */}
                    <div className="col-span-2 lg:col-span-1 space-y-5 sm:space-y-6">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-foreground rounded-xl flex items-center justify-center transition-all group-hover:scale-110 shadow-lg shadow-black/5">
                                <span className="text-background font-black text-xl sm:text-2xl">S</span>
                            </div>
                            <span className="font-black text-xl sm:text-2xl tracking-tighter text-foreground">SmartBuy</span>
                        </Link>
                        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-xs font-medium">
                            Premium shopping experience for the modern aesthetic. Quality goods, fast delivery, and 24/7 dedicated support.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="col-span-1">
                        <h3 className="text-foreground font-black text-xs sm:text-sm uppercase tracking-[0.2em] mb-4 sm:mb-6">Shop</h3>
                        <ul className="space-y-3 sm:space-y-4 text-[11px] sm:text-sm font-bold">
                            <li><Link href="#" className="text-gray-500 hover:text-foreground transition-colors">New Arrivals</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-foreground transition-colors">Best Sellers</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-foreground transition-colors">Electronics</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-foreground transition-colors">Fashion</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="col-span-1">
                        <h3 className="text-foreground font-black text-xs sm:text-sm uppercase tracking-[0.2em] mb-4 sm:mb-6">Support</h3>
                        <ul className="space-y-3 sm:space-y-4 text-[11px] sm:text-sm font-bold">
                            <li><Link href="/support" className="text-gray-500 hover:text-foreground transition-colors">Help Center</Link></li>
                            <li><Link href="/orders" className="text-gray-500 hover:text-foreground transition-colors">Track Order</Link></li>
                            <li><Link href="/support" className="text-gray-500 hover:text-foreground transition-colors">Returns</Link></li>
                            <li><Link href="/support" className="text-gray-500 hover:text-foreground transition-colors">Warranty</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="col-span-2 lg:col-span-1 pt-4 lg:pt-0">
                        <h3 className="text-foreground font-black text-xs sm:text-sm uppercase tracking-[0.2em] mb-4 sm:mb-6">Newsletter</h3>
                        <p className="text-[11px] sm:text-sm text-gray-500 mb-5 font-medium leading-relaxed">Join our club for exclusive updates and premium offers.</p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="bg-background border border-border text-foreground text-xs sm:text-sm px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground w-full transition-all"
                            />
                            <button className="bg-foreground text-background px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-sm shrink-0">
                                Join
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-border mt-12 sm:mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-500">
                    <p>&copy; {new Date().getFullYear()} SmartBuy Inc. All rights reserved.</p>
                    <div className="flex gap-6 sm:gap-8">
                        <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

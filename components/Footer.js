
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-10 sm:py-16 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
                    {/* Brand Section */}
                    <div className="col-span-2 lg:col-span-1 space-y-5 sm:space-y-6">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-xl flex items-center justify-center transition-all group-hover:scale-110 shadow-lg shadow-white/5">
                                <span className="text-gray-900 font-black text-xl sm:text-2xl">S</span>
                            </div>
                            <span className="font-black text-xl sm:text-2xl tracking-tighter text-white">SmartBuy</span>
                        </Link>
                        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-xs font-medium">
                            Premium shopping experience for the modern aesthetic. Quality goods, fast delivery, and 24/7 dedicated support.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="col-span-1">
                        <h3 className="text-white font-black text-xs sm:text-sm uppercase tracking-[0.2em] mb-4 sm:mb-6">Shop</h3>
                        <ul className="space-y-3 sm:space-y-4 text-[11px] sm:text-sm font-bold">
                            <li><Link href="#" className="text-gray-500 hover:text-white transition-colors">New Arrivals</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-white transition-colors">Best Sellers</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-white transition-colors">Electronics</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-white transition-colors">Fashion</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="col-span-1">
                        <h3 className="text-white font-black text-xs sm:text-sm uppercase tracking-[0.2em] mb-4 sm:mb-6">Support</h3>
                        <ul className="space-y-3 sm:space-y-4 text-[11px] sm:text-sm font-bold">
                            <li><Link href="/support" className="text-gray-500 hover:text-white transition-colors">Help Center</Link></li>
                            <li><Link href="/orders" className="text-gray-500 hover:text-white transition-colors">Track Order</Link></li>
                            <li><Link href="/support" className="text-gray-500 hover:text-white transition-colors">Returns</Link></li>
                            <li><Link href="/support" className="text-gray-500 hover:text-white transition-colors">Warranty</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="col-span-2 lg:col-span-1 pt-4 lg:pt-0">
                        <h3 className="text-white font-black text-xs sm:text-sm uppercase tracking-[0.2em] mb-4 sm:mb-6">Newsletter</h3>
                        <p className="text-[11px] sm:text-sm text-gray-500 mb-5 font-medium leading-relaxed">Join our club for exclusive updates and premium offers.</p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="bg-gray-800/50 border border-gray-700 text-white text-xs sm:text-sm px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-white/20 focus:border-white w-full transition-all"
                            />
                            <button className="bg-white text-black px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95 shadow-lg shadow-white/20 shrink-0">
                                Join
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 sm:mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-600">
                    <p>&copy; {new Date().getFullYear()} SmartBuy Inc. All rights reserved.</p>
                    <div className="flex gap-6 sm:gap-8">
                        <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

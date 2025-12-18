
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
                                <span className="text-gray-900 font-bold text-xl">S</span>
                            </div>
                            <span className="font-bold text-xl tracking-tight text-white">SmartBuy</span>
                        </Link>
                        <p className="text-sm text-gray-400">
                            Your one-stop destination for premium products. Experience quality shopping with fast delivery and excellent support.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Shop</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:text-white transition-colors">New Arrivals</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Best Sellers</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Electronics</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Fashion</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Support</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Track Order</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Stay Updated</h3>
                        <p className="text-sm text-gray-400 mb-4">Subscribe to our newsletter for the latest updates and offers.</p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="bg-gray-800 text-white text-sm px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 w-full"
                            />
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} SmartBuy. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link href="#" className="hover:text-white">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

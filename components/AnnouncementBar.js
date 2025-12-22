import { useState } from 'react';
import { X } from 'lucide-react';

export default function AnnouncementBar() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="bg-gray-900 text-white px-4 py-1.5 text-xs font-semibold relative z-40">
            <div className="max-w-7xl mx-auto flex items-center justify-between sm:justify-center">
                <p className="text-center pr-8 sm:pr-0 tracking-wide uppercase">
                    🎉 Free Shipping on Orders Over ₹300! Use Code: <span className="font-black text-blue-400">SMARTBUY</span>
                </p>
                <button
                    onClick={() => setIsVisible(false)}
                    className="sm:absolute sm:right-4 p-1 hover:text-gray-300 transition-colors"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );

}

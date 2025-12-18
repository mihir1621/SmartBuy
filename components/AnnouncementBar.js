import { useState } from 'react';
import { X } from 'lucide-react';

export default function AnnouncementBar() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="bg-gray-900 text-white px-4 py-2 text-sm font-medium relative z-40">
            <div className="max-w-7xl mx-auto flex items-center justify-between sm:justify-center">
                <p className="text-center pr-8 sm:pr-0">
                    🎉 Free Shipping on Orders Over $50! Use Code: <span className="font-bold text-yellow-400">SMARTBUY</span>
                </p>
                <button
                    onClick={() => setIsVisible(false)}
                    className="sm:absolute sm:right-4 p-1 hover:text-gray-300 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { X, Calculator, IndianRupee } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EMICalculatorModal({ isOpen, onClose, price }) {
    const [bank, setBank] = useState('HDFC Bank Credit Card');
    const [interestRate, setInterestRate] = useState(15); // Default HDFC rate
    const [months, setMonths] = useState(12); // Default 1 year
    const [downPayment, setDownPayment] = useState(0);

    const banks = [
        { name: 'HDFC Bank Credit Card', rate: 15.0 },
        { name: 'SBI Credit Card', rate: 14.5 },
        { name: 'ICICI Bank Credit Card', rate: 14.99 },
        { name: 'Axis Bank Credit Card', rate: 15.5 },
        { name: 'Bajaj Finserv', rate: 16.0 },
        { name: 'Custom', rate: 0 }
    ];

    const handleBankChange = (e) => {
        const selectedBank = e.target.value;
        setBank(selectedBank);
        const bankData = banks.find(b => b.name === selectedBank);
        if (bankData && bankData.name !== 'Custom') {
            setInterestRate(bankData.rate);
        }
    };

    // EMI Calculation
    const calculateEMI = () => {
        const principal = price - downPayment;
        if (principal <= 0) return 0;

        // Monthly interest rate
        const r = interestRate / 12 / 100;

        // EMI Formula: E = P * r * (1+r)^n / ((1+r)^n - 1)
        if (interestRate === 0) return Math.round(principal / months); // Handle 0% interest case

        const emi = principal * r * (Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1));
        return Math.round(emi);
    };

    const monthlyEMI = calculateEMI();
    const totalAmount = monthlyEMI * months + downPayment;
    const totalInterest = monthlyEMI * months - (price - downPayment);

    // Reset on open
    useEffect(() => {
        if (isOpen) {
            setDownPayment(0);
            setMonths(12);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-800"
                >
                    {/* Header */}
                    <div className="bg-gray-900 text-white p-4 flex items-center justify-between border-b border-gray-800">
                        <div className="flex items-center gap-2">
                            <Calculator className="w-5 h-5" />
                            <h2 className="text-lg font-bold">EMI Calculator</h2>
                        </div>
                        <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Product Value Display */}
                        <div className="flex justify-between items-center text-sm font-medium text-gray-400">
                            <span>Product Price</span>
                            <span className="text-white font-bold text-base">₹{price.toLocaleString()}</span>
                        </div>

                        {/* Down Payment Input */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-gray-300">Down Payment (₹)</label>
                                <span className="text-sm font-bold text-blue-400">₹{downPayment.toLocaleString()}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max={price * 0.9} // Max 90% down payment
                                step="1000"
                                value={downPayment}
                                onChange={(e) => setDownPayment(Number(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>

                        {/* Bank Selection */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-gray-300">Select Bank</label>
                            </div>
                            <select
                                value={bank}
                                onChange={handleBankChange}
                                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
                            >
                                {banks.map((b) => (
                                    <option key={b.name} value={b.name}>
                                        {b.name} {b.name !== 'Custom' ? `(${b.rate}%)` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Duration Slider */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-gray-300">Duration</label>
                                <span className="text-sm font-bold text-blue-400">{months} Months ({Math.floor(months / 12) > 0 ? `${(months / 12).toFixed(1)} Years` : "Months"})</span>
                            </div>
                            <input
                                type="range"
                                min="3"
                                max="36"
                                step="3"
                                value={months}
                                onChange={(e) => setMonths(Number(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                            <div className="flex justify-between mt-1 text-xs text-gray-500">
                                <span>3M</span>
                                <span>6M</span>
                                <span>9M</span>
                                <span>12M</span>
                                <span>18M</span>
                                <span>24M</span>
                                <span>36M</span>
                            </div>
                        </div>

                        {/* Interest Rate Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Interest Rate (% p.a)</label>
                            <input
                                type="number"
                                value={interestRate}
                                onChange={(e) => setInterestRate(Number(e.target.value))}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        {/* Summary Card */}
                        <div className="bg-blue-900/20 rounded-xl p-4 space-y-3 border border-blue-900/30">
                            <div className="flex justify-between items-end pb-3 border-b border-blue-900/30">
                                <span className="text-sm text-blue-300 font-medium">Monthly EMI</span>
                                <span className="text-2xl font-bold text-blue-400">₹{monthlyEMI.toLocaleString()}</span>
                            </div>

                            <div className="flex justify-between text-xs text-blue-400">
                                <span>Total Interest</span>
                                <span className="font-medium">+ ₹{Math.max(0, totalInterest).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs text-blue-400">
                                <span>Total Payable</span>
                                <span className="font-bold">₹{totalAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

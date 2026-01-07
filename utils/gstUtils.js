
import { INDIAN_CITIES } from '@/data/indianCities';

// GST Rates as per Indian Market Taxation
export const GST_RATES = {
    "Laptops": 18,
    "Smartphones": 18,
    "Tablets": 18,
    "Cameras": 18,
    "Electronics": 18,
    "Accessories": 18,
    "Headphones": 18,
    "Speakers": 18,
    "Smartwatches": 18,
    "Watch": 18,
    "Fashion": 12,
    "Clothing": 12,
    "Footwear": 12,
    "Shoes": 12,
    "Bags": 12,
    "Wallets": 12,
    "Eyewear": 12,
    "Home Decor": 12,
    "Furniture": 12,
    "default": 18
};

export const STORE_STATE = "Karnataka"; // Assuming store is based in Karnataka

/**
 * Calculates GST breakdown from an inclusive price.
 * @param {number} inclusivePrice - The total price including GST.
 * @param {string} category - The product category to determine the GST rate.
 * @param {string} shippingState - The destination state for the order.
 * @returns {object} - An object containing taxableValue, Total GST, and breakdown (CGST, SGST, IGST).
 */
export const calculateGST = (inclusivePrice, category, shippingState) => {
    const rate = GST_RATES[category] || GST_RATES.default;
    const taxableValue = inclusivePrice / (1 + rate / 100);
    const totalGst = inclusivePrice - taxableValue;

    // Default to STORE_STATE if shippingState is missing to avoid calculation errors, 
    // but usually it should be provided.
    const isIntraState = !shippingState || shippingState.toLowerCase() === STORE_STATE.toLowerCase();

    if (isIntraState) {
        return {
            rate,
            taxableValue,
            totalGst,
            cgst: totalGst / 2,
            sgst: totalGst / 2,
            igst: 0,
            type: 'Intra-state'
        };
    } else {
        return {
            rate,
            taxableValue,
            totalGst,
            cgst: 0,
            sgst: 0,
            igst: totalGst,
            type: 'Inter-state'
        };
    }
};

/**
 * Helper to get state from city name
 */
export const getStateFromCity = (city) => {
    if (!city) return null;
    const cityData = INDIAN_CITIES.find(c => c.city.toLowerCase() === city.toLowerCase());
    return cityData ? cityData.state : null;
};

/**
 * Calculates aggregate GST for a list of items
 */
export const calculateTotalGST = (items, shippingState) => {
    return items.reduce((acc, item) => {
        const gst = calculateGST(item.price * item.quantity, item.category || 'default', shippingState);
        return {
            taxableValue: acc.taxableValue + gst.taxableValue,
            totalGst: acc.totalGst + gst.totalGst,
            cgst: acc.cgst + gst.cgst,
            sgst: acc.sgst + gst.sgst,
            igst: acc.igst + gst.igst
        };
    }, { taxableValue: 0, totalGst: 0, cgst: 0, sgst: 0, igst: 0 });
};

import { products } from './data/products.js';
import fs from 'fs';

// Load verified images
const validImages = JSON.parse(fs.readFileSync('valid_images.json', 'utf8'));

// Keyword based overrides for better specificity
const keywordImages = {
    'shoe': ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80', 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80'],
    'sneaker': ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80'],
    'boot': ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80'],
    'tv': ['https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80'],
    'television': ['https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80'],
    'bag': validImages['Bags'] || [],
    'backpack': validImages['Bags'] || []
};

// Fallback mappings
const categoryMapping = {
    'Laptops': validImages['Laptops'],
    'Smartphones': validImages['Smartphones'],
    'Tablets': validImages['Smartphones'], // Close enough? Or generic Electronics
    'Audio': validImages['Audio'],
    'Electronics': [...(validImages['Electronics'] || []), ...validImages['Laptops'], ...validImages['Smartphones']],
    'Menswear': validImages['Menswear'],
    'Womenswear': validImages['Womenswear'],
    'Bags': validImages['Bags'],
    'Home': validImages['Home'],
    'Home Appliances': validImages['Home'],
    'Watch': validImages['Watch'],
    'Beauty': validImages['Womenswear'], // Fallback
    'Sports': validImages['Menswear'], // Fallback
    'Outdoors': validImages['Home'], // Fallback
    'Automotive': validImages['Electronics'], // Fallback
    'Pets': validImages['Home'], // Fallback
    'Baby': validImages['Home'], // Fallback
    'Grocery': validImages['Home'], // Fallback
    'Office': validImages['Laptops'], // Fallback
    'Books': validImages['Home'], // Fallback
    'TVs': keywordImages['tv'],
    'Computers': validImages['Laptops'],
    'Cameras': validImages['Electronics'],
    'Smart Devices': validImages['Electronics']
};

function getImageForProduct(p) {
    const nameLower = p.name.toLowerCase();

    // Check keywords first
    for (const [keyword, images] of Object.entries(keywordImages)) {
        if (nameLower.includes(keyword) && images && images.length > 0) {
            return images[p.id % images.length];
        }
    }

    // Check category matches
    let pool = categoryMapping[p.category];

    // Default to Electronics/Home if no mapping
    if (!pool || pool.length === 0) {
        if (['Electronics', 'Computers', 'Smart Devices'].includes(p.category)) pool = validImages['Electronics'];
        else pool = validImages['Home'];
    }

    // Final fallback
    if (!pool || pool.length === 0) {
        // Use a definitely verified generic image
        return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80";
    }

    return pool[p.id % pool.length];
}

// Reconstruct the file content
let newContent = 'export const products = [\n';

products.forEach((p, index) => {
    const newImage = getImageForProduct(p);
    // Sanitize description if needed, but we keep it
    // preserve comments? formatting might be lost but data is safe.
    // Creating object string
    const pStr = JSON.stringify({
        ...p,
        image: newImage,
        images: [newImage] // Reset images array to avoid broken ones
    }, null, 8); // indentation

    // Fix JSON stringify keys to look like JS object keys (optional but nicer)
    // Actually JSON is valid JS.

    newContent += '    ' + pStr + (index < products.length - 1 ? ',' : '') + '\n';
});

newContent += '];\n';

// Write back
fs.writeFileSync('data/products.js', newContent);
console.log('Updated data/products.js with reliable images.');

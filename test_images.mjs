import { products } from './data/products.js';

async function checkImages() {
    const cats = {};
    products.forEach(p => {
        if (!cats[p.category]) cats[p.category] = [];
        if (cats[p.category].length < 3) cats[p.category].push(p.image);
    });

    for (const cat in cats) {
        console.log(`\nTesting ${cat}:`);
        for (const url of cats[cat]) {
            try {
                const res = await fetch(url);
                console.log(`${res.status} ${res.statusText} - ${url}`);
            } catch (e) {
                console.log(`Failed - ${url}`);
            }
        }
    }
}
checkImages();

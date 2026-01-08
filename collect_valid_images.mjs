import { products } from './data/products.js';
import https from 'https';
import fs from 'fs';

async function checkUrl(url) {
    return new Promise((resolve) => {
        const req = https.get(url, (res) => {
            if (res.statusCode === 302 || res.statusCode === 301) {
                // Follow redirect? Unsplash does redirects.
                // Usually Unsplash source URLs redirect to actual image.
                // If it's a redirect, consider it valid? Or follow.
                // Actually unsplash.com/photos/... might redirect.
                // But images.unsplash.com/... usually returns 200 or 404.
                resolve(true);
            } else {
                resolve(res.statusCode === 200);
            }
            req.abort(); // Don't download body
        }).on('error', () => resolve(false));
    });
}

async function main() {
    const uniqueImages = [];
    const seen = new Set();

    products.forEach(p => {
        if (p.image && !seen.has(p.image)) {
            seen.add(p.image);
            uniqueImages.push({ url: p.image, cat: p.category });
        }
    });

    console.log(`Checking ${Math.min(uniqueImages.length, 100)} images...`);
    const validImages = {};
    let count = 0;

    // Check first 100 unique images
    for (const item of uniqueImages.slice(0, 100)) {
        const isValid = await checkUrl(item.url);
        if (isValid) {
            if (!validImages[item.cat]) validImages[item.cat] = [];
            validImages[item.cat].push(item.url);
        }
        process.stdout.write('.');
        count++;
    }

    fs.writeFileSync('valid_images.json', JSON.stringify(validImages, null, 2));
    console.log('\nValid images saved.');
}

main();

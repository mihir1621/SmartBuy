const fs = require('fs');
const content = fs.readFileSync('data/products.js', 'utf8');
const matches = content.match(/category:\s*"([^"]+)"/g);
const counts = {};
if (matches) {
    matches.forEach(m => {
        const cat = m.match(/"([^"]+)"/)[1];
        counts[cat] = (counts[cat] || 0) + 1;
    });
}
console.log(counts);

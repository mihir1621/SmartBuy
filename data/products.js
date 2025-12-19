
// Reliable LoremFlickr Images with /all tag for accuracy
const exactImages = {
    // Electronics
    // /all ensures the image matches ALL keywords, improving relevance
    iphone15: "https://loremflickr.com/800/800/iphone,smartphone/all",
    s24ultra: "https://loremflickr.com/800/800/samsung,smartphone/all",
    macbookAir: "https://loremflickr.com/800/800/macbook,laptop/all",
    sonyXM5: "https://loremflickr.com/800/800/headphones,audio/all",
    ps5: "https://loremflickr.com/800/800/playstation,console/all",
    xbox: "https://loremflickr.com/800/800/xbox,console/all",
    switch: "https://loremflickr.com/800/800/nintendo,switch/all",
    tv: "https://loremflickr.com/800/800/smart,tv/all",
    drone: "https://loremflickr.com/800/800/drone,camera/all",
    camera: "https://loremflickr.com/800/800/dslr,camera/all",

    // Fashion
    jordan1: "https://loremflickr.com/800/800/jordan,sneakers/all",
    levis: "https://loremflickr.com/800/800/jeans,denim/all",
    kanjeevaram: "https://loremflickr.com/800/800/saree,silk/all",
    sauvage: "https://loremflickr.com/800/800/perfume,bottle/all",
    tshirt: "https://loremflickr.com/800/800/tshirt,white/all",
    hoodie: "https://loremflickr.com/800/800/hoodie,fashion/all",
    dress: "https://loremflickr.com/800/800/dress,fashion/all",
    suit: "https://loremflickr.com/800/800/suit,man/all",

    // Home
    dyson: "https://loremflickr.com/800/800/vacuum,cleaner/all",
    hermanMiller: "https://loremflickr.com/800/800/office,chair/all",
    lego: "https://loremflickr.com/800/800/lego,toy/all",
    sofa: "https://loremflickr.com/800/800/sofa,furniture/all",
    lamp: "https://loremflickr.com/800/800/lamp,light/all",

    // Fallbacks
    laptop: "https://loremflickr.com/800/800/laptop,computer/all",
    watch: "https://loremflickr.com/800/800/wristwatch,time/all",
    skincare: "https://loremflickr.com/800/800/skincare,product/all",
    lipstick: "https://loremflickr.com/800/800/lipstick,makeup/all",
};

export const products = [
    // --- Electronics ---
    { id: 101, name: "iPhone 15 Pro Max", brand: "Apple", category: "Electronics", subCategory: "Mobiles", price: 1199, rating: 4.9, reviews: 3420, image: exactImages.iphone15, description: "The ultimate iPhone with Titanium design.", newArrival: true, bestseller: true },
    { id: 102, name: "Sony WH-1000XM5", brand: "Sony", category: "Electronics", subCategory: "Audio", price: 348, rating: 4.8, reviews: 2100, image: exactImages.sonyXM5, description: "Industry-leading noise cancellation.", newArrival: false, bestseller: true },
    { id: 103, name: "MacBook Air M3", brand: "Apple", category: "Electronics", subCategory: "Laptops", price: 1099, rating: 4.9, reviews: 950, image: exactImages.macbookAir, description: "Supercharged by M3 chip.", newArrival: true, bestseller: false },
    { id: 104, name: "Samsung Galaxy S24 Ultra", brand: "Samsung", category: "Electronics", subCategory: "Mobiles", price: 1299, rating: 4.7, reviews: 1500, image: exactImages.s24ultra, description: "Galaxy AI is here.", newArrival: true, bestseller: true },
    { id: 105, name: "Dell XPS 15", brand: "Dell", category: "Electronics", subCategory: "Laptops", price: 1499, rating: 4.6, reviews: 800, image: exactImages.laptop, description: "High performance creator laptop.", newArrival: false, bestseller: false },
    { id: 106, name: "iPad Air 5", brand: "Apple", category: "Electronics", subCategory: "Tablets", price: 599, rating: 4.8, reviews: 1200, image: "https://loremflickr.com/800/800/ipad,tablet/all", description: "Light. Bright. Full of might.", newArrival: false, bestseller: true },
    { id: 107, name: "Logitech MX Master 3S", brand: "Logitech", category: "Electronics", subCategory: "Accessories", price: 99, rating: 4.9, reviews: 4500, image: "https://loremflickr.com/800/800/computer,mouse/all", description: "The iconic mouse, remastered.", newArrival: true, bestseller: true },
    { id: 108, name: "Samsung Odyssey Monitor", brand: "Samsung", category: "Electronics", subCategory: "Monitors", price: 799, rating: 4.5, reviews: 300, image: exactImages.tv, description: "Curved gaming monitor.", newArrival: false, bestseller: false },
    { id: 109, name: "JBL Flip 6", brand: "JBL", category: "Electronics", subCategory: "Audio", price: 129, rating: 4.7, reviews: 2500, image: "https://loremflickr.com/800/800/bluetooth,speaker/all", description: "Bold sound for every adventure.", newArrival: false, bestseller: true },
    { id: 110, name: "GoPro Hero 12", brand: "GoPro", category: "Electronics", subCategory: "Cameras", price: 399, rating: 4.6, reviews: 600, image: exactImages.camera, description: "Incredible image quality.", newArrival: true, bestseller: false },
    { id: 111, name: "Canon EOS R6", brand: "Canon", category: "Electronics", subCategory: "Cameras", price: 2499, rating: 4.9, reviews: 150, image: exactImages.camera, description: "Mirrorless camera for pros.", newArrival: false, bestseller: false },
    { id: 112, name: "Nintendo Switch OLED", brand: "Nintendo", category: "Electronics", subCategory: "Gaming", price: 349, rating: 4.8, reviews: 5000, image: exactImages.switch, description: "7-inch OLED screen.", newArrival: false, bestseller: true },
    { id: 113, name: "PS5 Console", brand: "Sony", category: "Electronics", subCategory: "Gaming", price: 499, rating: 4.9, reviews: 8000, image: exactImages.ps5, description: "Play Has No Limits.", newArrival: false, bestseller: true },
    { id: 114, name: "Xbox Series X", brand: "Microsoft", category: "Electronics", subCategory: "Gaming", price: 499, rating: 4.8, reviews: 4000, image: exactImages.xbox, description: "Power your dreams.", newArrival: false, bestseller: true },
    { id: 115, name: "Apple Watch Ultra 2", brand: "Apple", category: "Electronics", subCategory: "Wearables", price: 799, rating: 4.9, reviews: 1000, image: exactImages.watch, description: "Rugged and capable.", newArrival: true, bestseller: true },
    { id: 116, name: "Kindle Paperwhite", brand: "Amazon", category: "Electronics", subCategory: "Tablets", price: 139, rating: 4.7, reviews: 9000, image: "https://loremflickr.com/800/800/kindle,reader/all", description: "Now with a 6.8” display.", newArrival: false, bestseller: true },
    { id: 117, name: "Anker Power Bank", brand: "Anker", category: "Electronics", subCategory: "Accessories", price: 49, rating: 4.8, reviews: 3000, image: "https://loremflickr.com/800/800/powerbank,battery/all", description: "High-speed charging.", newArrival: false, bestseller: true },
    { id: 118, name: "Google Pixel 8 Pro", brand: "Google", category: "Electronics", subCategory: "Mobiles", price: 999, rating: 4.6, reviews: 500, image: "https://loremflickr.com/800/800/pixel,phone/all", description: "Built with Google AI.", newArrival: true, bestseller: false },
    { id: 119, name: "Bose QuietComfort Ultra", brand: "Bose", category: "Electronics", subCategory: "Audio", price: 429, rating: 4.7, reviews: 800, image: exactImages.sonyXM5, description: "World-class noise cancellation.", newArrival: true, bestseller: false },
    { id: 120, name: "Razer BlackWidow V4", brand: "Razer", category: "Electronics", subCategory: "Accessories", price: 169, rating: 4.5, reviews: 400, image: "https://loremflickr.com/800/800/gaming,keyboard/all", description: "Mechanical gaming keyboard.", newArrival: false, bestseller: false },

    // --- Fashion: Men ---
    { id: 201, name: "Levi's 511 Slim Jeans", brand: "Levi's", category: "Fashion", subCategory: "Jeans", price: 69, rating: 4.5, reviews: 4500, image: exactImages.levis, description: "Modern slim fit.", newArrival: false, bestseller: true },
    { id: 202, name: "Nike Air Jordan 1", brand: "Nike", category: "Footwear", subCategory: "Sneakers", price: 180, rating: 4.8, reviews: 8900, image: exactImages.jordan1, description: "Classic style.", newArrival: false, bestseller: true },
    { id: 203, name: "Puma Motorsport Jacket", brand: "Puma", category: "Fashion", subCategory: "Outerwear", price: 85, rating: 4.4, reviews: 320, image: "https://loremflickr.com/800/800/jacket,men/all", description: "High-octane style.", newArrival: true, bestseller: false },
    { id: 204, name: "Raymond Formal Shirt", brand: "Raymond", category: "Fashion", subCategory: "Shirts", price: 45, rating: 4.3, reviews: 120, image: "https://loremflickr.com/800/800/shirt,formal/all", description: "Crisp formal wear.", newArrival: false, bestseller: false },
    { id: 205, name: "Tommy Hilfiger Polo", brand: "Tommy Hilfiger", category: "Fashion", subCategory: "T-Shirts", price: 55, rating: 4.6, reviews: 600, image: exactImages.tshirt, description: "Classic American cool.", newArrival: false, bestseller: true },
    { id: 206, name: "Adidas Ultraboost", brand: "Adidas", category: "Footwear", subCategory: "Sneakers", price: 160, rating: 4.8, reviews: 3000, image: "https://loremflickr.com/800/800/running,shoes/all", description: "Energy return boost.", newArrival: true, bestseller: true },
    { id: 207, name: "Calvin Klein Boxer Briefs", brand: "Calvin Klein", category: "Fashion", subCategory: "Innerwear", price: 30, rating: 4.7, reviews: 5000, image: "https://loremflickr.com/800/800/boxer,underwear/all", description: "Maximum comfort.", newArrival: false, bestseller: true },
    { id: 208, name: "Casio G-Shock", brand: "Casio", category: "Accessories", subCategory: "Watches", price: 120, rating: 4.8, reviews: 4000, image: exactImages.watch, description: "Tough solar power.", newArrival: false, bestseller: true },
    { id: 209, name: "Ray-Ban Wayfarer", brand: "Ray-Ban", category: "Accessories", subCategory: "Eyewear", price: 150, rating: 4.7, reviews: 3500, image: "https://loremflickr.com/800/800/sunglasses,men/all", description: "Iconic style.", newArrival: false, bestseller: true },
    { id: 210, name: "Timberland Boots", brand: "Timberland", category: "Footwear", subCategory: "Boots", price: 198, rating: 4.7, reviews: 2000, image: "https://loremflickr.com/800/800/boots,timberland/all", description: "Waterproof premium leather.", newArrival: false, bestseller: false },
    { id: 211, name: "North Face Puffer", brand: "The North Face", category: "Fashion", subCategory: "Outerwear", price: 280, rating: 4.9, reviews: 1500, image: "https://loremflickr.com/800/800/puffer,jacket/all", description: "Warmth without weight.", newArrival: true, bestseller: true },
    { id: 212, name: "Gucci Leather Belt", brand: "Gucci", category: "Accessories", subCategory: "Belts", price: 450, rating: 4.8, reviews: 500, image: "https://loremflickr.com/800/800/belt,leather/all", description: "Luxury leather accessory.", newArrival: false, bestseller: true },
    { id: 213, name: "Zara Chinos", brand: "Zara", category: "Fashion", subCategory: "Trousers", price: 49, rating: 4.4, reviews: 800, image: "https://loremflickr.com/800/800/chinos,men/all", description: "Smart casual essential.", newArrival: true, bestseller: false },
    { id: 214, name: "Under Armour Tech Tee", brand: "Under Armour", category: "Fashion", subCategory: "T-Shirts", price: 25, rating: 4.6, reviews: 1200, image: exactImages.tshirt, description: "Quick-drying fabric.", newArrival: false, bestseller: true },
    { id: 215, name: "Clarks Desert Boots", brand: "Clarks", category: "Footwear", subCategory: "Boots", price: 130, rating: 4.5, reviews: 650, image: "https://loremflickr.com/800/800/desert,boots/all", description: "Original suede design.", newArrival: false, bestseller: false },

    // --- Fashion: Women ---
    { id: 301, name: "Kanjeevaram Silk Saree", brand: "Ethnic Basket", category: "Fashion", subCategory: "Ethnic Wear", price: 189, rating: 4.9, reviews: 320, image: exactImages.kanjeevaram, description: "Red and gold silk.", newArrival: true, bestseller: true },
    { id: 302, name: "Zara Floral Midi Dress", brand: "Zara", category: "Fashion", subCategory: "Dresses", price: 59, rating: 4.5, reviews: 890, image: exactImages.dress, description: "Perfect for summer.", newArrival: true, bestseller: true },
    { id: 303, name: "H&M Oversized Hoodie", brand: "H&M", category: "Fashion", subCategory: "Winter Wear", price: 35, rating: 4.6, reviews: 1200, image: exactImages.hoodie, description: "Cozy comfort.", newArrival: false, bestseller: true },
    { id: 304, name: "Swarovski Crystal Necklace", brand: "Swarovski", category: "Accessories", subCategory: "Jewelry", price: 129, rating: 4.8, reviews: 450, image: "https://loremflickr.com/800/800/necklace,crystal/all", description: "Sparkling elegance.", newArrival: false, bestseller: false },
    { id: 305, name: "Michael Kors Tote", brand: "Michael Kors", category: "Accessories", subCategory: "Bags", price: 258, rating: 4.7, reviews: 2000, image: "https://loremflickr.com/800/800/handbag,fashion/all", description: "Spacious and stylish.", newArrival: false, bestseller: true },
    { id: 306, name: "Nike Air Force 1", brand: "Nike", category: "Footwear", subCategory: "Sneakers", price: 110, rating: 4.8, reviews: 6000, image: "https://loremflickr.com/800/800/sneakers,white/all", description: "Legendary style.", newArrival: false, bestseller: true },
    { id: 307, name: "Levi's Review Denim Jacket", brand: "Levi's", category: "Fashion", subCategory: "Outerwear", price: 98, rating: 4.6, reviews: 800, image: "https://loremflickr.com/800/800/denim,jacket/all", description: "Timeless trucker jacket.", newArrival: true, bestseller: false },
    { id: 308, name: "Uniqlo Pleated Skirt", brand: "Uniqlo", category: "Fashion", subCategory: "Skirts", price: 39, rating: 4.5, reviews: 400, image: "https://loremflickr.com/800/800/skirt,pleated/all", description: "Elegant pleats.", newArrival: true, bestseller: true },
    { id: 309, name: "Birkenstock Arizona", brand: "Birkenstock", category: "Footwear", subCategory: "Sandals", price: 130, rating: 4.7, reviews: 3500, image: "https://loremflickr.com/800/800/sandals,birkenstock/all", description: "Anatomic footbed.", newArrival: false, bestseller: true },
    { id: 310, name: "Chanel No. 5", brand: "Chanel", category: "Beauty", subCategory: "Fragrance", price: 160, rating: 4.9, reviews: 1000, image: exactImages.sauvage, description: "The classic fragrance.", newArrival: false, bestseller: true },
    { id: 311, name: "Lululemon Leggings", brand: "Lululemon", category: "Fashion", subCategory: "Activewear", price: 98, rating: 4.8, reviews: 5000, image: "https://loremflickr.com/800/800/leggings,yoga/all", description: "Buttery soft fabric.", newArrival: false, bestseller: true },
    { id: 312, name: "Pandora Charm Bracelet", brand: "Pandora", category: "Accessories", subCategory: "Jewelry", price: 85, rating: 4.7, reviews: 1200, image: "https://loremflickr.com/800/800/bracelet,jewelry/all", description: "Collect your moments.", newArrival: false, bestseller: true },
    { id: 313, name: "Vogue Eyewear", brand: "Vogue", category: "Accessories", subCategory: "Eyewear", price: 80, rating: 4.4, reviews: 300, image: "https://loremflickr.com/800/800/glasses,fashion/all", description: "Chic frames.", newArrival: true, bestseller: false },
    { id: 314, name: "Forever 21 Crop Top", brand: "Forever 21", category: "Fashion", subCategory: "Tops", price: 15, rating: 4.2, reviews: 600, image: exactImages.tshirt, description: "Summer essential.", newArrival: true, bestseller: false },
    { id: 315, name: "Steve Madden Heels", brand: "Steve Madden", category: "Footwear", subCategory: "Heels", price: 99, rating: 4.5, reviews: 400, image: "https://loremflickr.com/800/800/heels,shoes/all", description: "Statement stilettos.", newArrival: false, bestseller: false },

    // --- Kids ---
    { id: 401, name: "LEGO Star Wars Set", brand: "LEGO", category: "Kids", subCategory: "Toys", price: 89, rating: 4.9, reviews: 5000, image: exactImages.lego, description: "Build your galaxy.", newArrival: false, bestseller: true },
    { id: 402, name: "Mothercare T-Shirt", brand: "Mothercare", category: "Fashion", subCategory: "Kids Wear", price: 15, rating: 4.4, reviews: 200, image: "https://loremflickr.com/800/800/kids,tshirt/all", description: "Soft cotton.", newArrival: true, bestseller: false },
    { id: 403, name: "Barbie Dreamhouse", brand: "Mattel", category: "Kids", subCategory: "Toys", price: 199, rating: 4.8, reviews: 1500, image: "https://loremflickr.com/800/800/dollhouse,toy/all", description: "3-story fun.", newArrival: false, bestseller: true },
    { id: 404, name: "Hot Wheels Track", brand: "Hot Wheels", category: "Kids", subCategory: "Toys", price: 45, rating: 4.7, reviews: 2000, image: "https://loremflickr.com/800/800/hotwheels,toy/all", description: "High speed racing.", newArrival: false, bestseller: true },
    { id: 405, name: "Carter's Onesies", brand: "Carter's", category: "Fashion", subCategory: "Baby Wear", price: 25, rating: 4.8, reviews: 3000, image: "https://loremflickr.com/800/800/baby,clothes/all", description: "Pack of 5 bodysuits.", newArrival: false, bestseller: true },
    { id: 406, name: "Nerf Elite Blaster", brand: "Nerf", category: "Kids", subCategory: "Toys", price: 30, rating: 4.6, reviews: 1000, image: "https://loremflickr.com/800/800/nerf,toy/all", description: "Action packed fun.", newArrival: false, bestseller: true },
    { id: 407, name: "Sketchers Light-Ups", brand: "Sketchers", category: "Footwear", subCategory: "Kids Shoes", price: 45, rating: 4.7, reviews: 800, image: "https://loremflickr.com/800/800/kids,sneakers/all", description: "Shoes that light up.", newArrival: true, bestseller: false },
    { id: 408, name: "Melissa & Doug Puzzle", brand: "Melissa & Doug", category: "Kids", subCategory: "Educational", price: 15, rating: 4.8, reviews: 500, image: "https://loremflickr.com/800/800/puzzle,toy/all", description: "Wooden puzzle set.", newArrival: false, bestseller: false },
    { id: 409, name: "Fisher-Price Walker", brand: "Fisher-Price", category: "Kids", subCategory: "Baby Gear", price: 35, rating: 4.7, reviews: 1500, image: "https://loremflickr.com/800/800/baby,walker/all", description: "Learn to walk.", newArrival: false, bestseller: true },
    { id: 410, name: "Disney Princess Doll", brand: "Disney", category: "Kids", subCategory: "Toys", price: 25, rating: 4.6, reviews: 900, image: "https://loremflickr.com/800/800/doll,toy/all", description: "Magical adventures.", newArrival: true, bestseller: false },

    // --- Home & Living ---
    { id: 501, name: "Dyson V15 Detect", brand: "Dyson", category: "Home", subCategory: "Appliances", price: 749, rating: 4.8, reviews: 1200, image: exactImages.dyson, description: "Laser dust detection.", newArrival: false, bestseller: true },
    { id: 502, name: "IKEA Poang Chair", brand: "IKEA", category: "Home", subCategory: "Furniture", price: 99, rating: 4.6, reviews: 8000, image: exactImages.hermanMiller, description: "Comfortable resilience.", newArrival: false, bestseller: true },
    { id: 503, name: "Philips Hue Kit", brand: "Philips", category: "Home", subCategory: "Smart Home", price: 159, rating: 4.7, reviews: 2100, image: exactImages.lamp, description: "16 million colors.", newArrival: true, bestseller: false },
    { id: 504, name: "KitchenAid Mixer", brand: "KitchenAid", category: "Home", subCategory: "Appliances", price: 399, rating: 4.9, reviews: 5000, image: "https://loremflickr.com/800/800/kitchenaid,mixer/all", description: "The baker's dream.", newArrival: false, bestseller: true },
    { id: 505, name: "Nespresso Vertuo", brand: "Nespresso", category: "Home", subCategory: "Appliances", price: 199, rating: 4.7, reviews: 3000, image: "https://loremflickr.com/800/800/coffee,machine/all", description: "Perfect coffee every time.", newArrival: false, bestseller: true },
    { id: 506, name: "Casper Mattress", brand: "Casper", category: "Home", subCategory: "Furniture", price: 995, rating: 4.6, reviews: 1500, image: "https://loremflickr.com/800/800/mattress,bed/all", description: "Sleep better.", newArrival: false, bestseller: true },
    { id: 507, name: "Le Creuset Dutch Oven", brand: "Le Creuset", category: "Home", subCategory: "Kitchen", price: 420, rating: 4.9, reviews: 800, image: "https://loremflickr.com/800/800/dutch,oven/all", description: "Enameled cast iron.", newArrival: false, bestseller: false },
    { id: 508, name: "Shark Robot Vacuum", brand: "Shark", category: "Home", subCategory: "Appliances", price: 299, rating: 4.5, reviews: 1000, image: exactImages.dyson, description: "Hands-free cleaning.", newArrival: true, bestseller: false },
    { id: 509, name: "Herman Miller Chair", brand: "Herman Miller", category: "Home", subCategory: "Furniture", price: 1299, rating: 4.9, reviews: 500, image: exactImages.hermanMiller, description: "Ergonomic excellence.", newArrival: false, bestseller: false },
    { id: 510, name: "Yankee Candle", brand: "Yankee Candle", category: "Home", subCategory: "Decor", price: 29, rating: 4.7, reviews: 4000, image: "https://loremflickr.com/800/800/candle,decor/all", description: "Long-lasting fragrance.", newArrival: false, bestseller: true },
    { id: 511, name: "NutriBullet Blender", brand: "NutriBullet", category: "Home", subCategory: "Kitchen", price: 69, rating: 4.6, reviews: 2500, image: "https://loremflickr.com/800/800/blender/all", description: "Compact nutrition.", newArrival: false, bestseller: true },
    { id: 512, name: "Ring Video Doorbell", brand: "Ring", category: "Home", subCategory: "Smart Home", price: 99, rating: 4.7, reviews: 6000, image: "https://loremflickr.com/800/800/doorbell/all", description: "See who's there.", newArrival: false, bestseller: true },
    { id: 513, name: "Echo Dot 5", brand: "Amazon", category: "Home", subCategory: "Smart Home", price: 49, rating: 4.6, reviews: 10000, image: "https://loremflickr.com/800/800/amazonecho,assistant/all", description: "Voice control everything.", newArrival: false, bestseller: true },
    { id: 514, name: "West Elm Sofa", brand: "West Elm", category: "Home", subCategory: "Furniture", price: 1499, rating: 4.5, reviews: 300, image: exactImages.sofa, description: "Mid-century modern.", newArrival: true, bestseller: false },
    { id: 515, name: "Hydro Flask Bottle", brand: "Hydro Flask", category: "Home", subCategory: "Kitchen", price: 45, rating: 4.8, reviews: 3000, image: "https://loremflickr.com/800/800/water,bottle/all", description: "Keeps water cold.", newArrival: false, bestseller: true },

    // --- Beauty & Personal Care ---
    { id: 601, name: "Estee Lauder Serum", brand: "Estee Lauder", category: "Beauty", subCategory: "Skincare", price: 85, rating: 4.8, reviews: 5600, image: exactImages.skincare, description: "Advanced night repair.", newArrival: false, bestseller: true },
    { id: 602, name: "Dior Sauvage", brand: "Dior", category: "Beauty", subCategory: "Fragrance", price: 145, rating: 4.9, reviews: 3200, image: exactImages.sauvage, description: "Iconic men's scent.", newArrival: true, bestseller: true },
    { id: 603, name: "MAC Lipstick", brand: "MAC", category: "Beauty", subCategory: "Makeup", price: 21, rating: 4.7, reviews: 4000, image: exactImages.lipstick, description: "Rich matte color.", newArrival: false, bestseller: true },
    { id: 604, name: "Olaplex No. 3", brand: "Olaplex", category: "Beauty", subCategory: "Haircare", price: 30, rating: 4.8, reviews: 2000, image: "https://loremflickr.com/800/800/shampoo,bottle/all", description: "Hair perfector.", newArrival: false, bestseller: true },
    { id: 605, name: "CeraVe Cleanser", brand: "CeraVe", category: "Beauty", subCategory: "Skincare", price: 15, rating: 4.6, reviews: 8000, image: "https://loremflickr.com/800/800/cleanser,bottle/all", description: "Hydrating cleanser.", newArrival: false, bestseller: true },
    { id: 606, name: "Fenty Beauty Foundation", brand: "Fenty Beauty", category: "Beauty", subCategory: "Makeup", price: 39, rating: 4.8, reviews: 1500, image: "https://loremflickr.com/800/800/foundation,makeup/all", description: "Soft matte base.", newArrival: true, bestseller: false },
    { id: 607, name: "Oral-B Electric Toothbrush", brand: "Oral-B", category: "Beauty", subCategory: "Personal Care", price: 99, rating: 4.6, reviews: 1000, image: "https://loremflickr.com/800/800/toothbrush,electric/all", description: "Deep clean.", newArrival: false, bestseller: true },
    { id: 608, name: "Philips Norelco Shaver", brand: "Philips", category: "Beauty", subCategory: "Grooming", price: 60, rating: 4.5, reviews: 2500, image: "https://loremflickr.com/800/800/shaver,men/all", description: "Smooth shave.", newArrival: false, bestseller: true },
    { id: 609, name: "La Mer Cream", brand: "La Mer", category: "Beauty", subCategory: "Skincare", price: 350, rating: 4.7, reviews: 300, image: "https://loremflickr.com/800/800/face,cream/all", description: "Luxury moisturizing.", newArrival: false, bestseller: false },
    { id: 610, name: "Jo Malone Candle", brand: "Jo Malone", category: "Beauty", subCategory: "Fragrance", price: 70, rating: 4.8, reviews: 600, image: "https://loremflickr.com/800/800/candle,luxury/all", description: "English Pear & Freesia.", newArrival: true, bestseller: false },

    // --- Sports ---
    { id: 701, name: "Yonex Racket", brand: "Yonex", category: "Sports", subCategory: "Badminton", price: 45, rating: 4.5, reviews: 890, image: "https://loremflickr.com/800/800/badminton,racket/all", description: "Lightweight graphite.", newArrival: false, bestseller: false },
    { id: 702, name: "Adidas Yoga Mat", brand: "Adidas", category: "Sports", subCategory: "Fitness", price: 35, rating: 4.4, reviews: 560, image: "https://loremflickr.com/800/800/yoga,mat/all", description: "Non-slip surface.", newArrival: false, bestseller: true },
    { id: 703, name: "Nike Football", brand: "Nike", category: "Sports", subCategory: "Football", price: 25, rating: 4.7, reviews: 1000, image: "https://loremflickr.com/800/800/soccer,ball/all", description: "Durable match ball.", newArrival: false, bestseller: true },
    { id: 704, name: "Wilson Tennis Racket", brand: "Wilson", category: "Sports", subCategory: "Tennis", price: 189, rating: 4.8, reviews: 400, image: "https://loremflickr.com/800/800/tennis,racket/all", description: "Pro staff precision.", newArrival: true, bestseller: false },
    { id: 705, name: "Fitbit Charge 6", brand: "Fitbit", category: "Electronics", subCategory: "Wearables", price: 159, rating: 4.6, reviews: 2000, image: exactImages.watch, description: "Advanced fitness tracker.", newArrival: true, bestseller: true },
    { id: 706, name: "Spalding Basketball", brand: "Spalding", category: "Sports", subCategory: "Basketball", price: 30, rating: 4.7, reviews: 1500, image: "https://loremflickr.com/800/800/basketball,ball/all", description: "Official game ball.", newArrival: false, bestseller: true },
    { id: 707, name: "Bowflex Dumbbells", brand: "Bowflex", category: "Sports", subCategory: "Fitness", price: 399, rating: 4.8, reviews: 800, image: "https://loremflickr.com/800/800/dumbbell,gym/all", description: "Adjustable weights.", newArrival: false, bestseller: true },
    { id: 708, name: "Garmin Edge 530", brand: "Garmin", category: "Sports", subCategory: "Cycling", price: 299, rating: 4.7, reviews: 300, image: exactImages.watch, description: "GPS cycling computer.", newArrival: false, bestseller: false },
    { id: 709, name: "Speedo Goggles", brand: "Speedo", category: "Sports", subCategory: "Swimming", price: 20, rating: 4.6, reviews: 600, image: "https://loremflickr.com/800/800/swimming,goggles/all", description: "Anti-fog protection.", newArrival: true, bestseller: true },
    { id: 710, name: "Salomon Hiking Boots", brand: "Salomon", category: "Footwear", subCategory: "Hiking", price: 140, rating: 4.8, reviews: 400, image: "https://loremflickr.com/800/800/hiking,boots/all", description: "All-terrain grip.", newArrival: false, bestseller: false },

    // --- Miscellaneous / New ---
    { id: 801, name: "Ray-Ban Aviator", brand: "Ray-Ban", category: "Accessories", subCategory: "Eyewear", price: 160, rating: 4.7, reviews: 3400, image: "https://loremflickr.com/800/800/sunglasses/all", description: "Classic aviators.", newArrival: false, bestseller: true },
    { id: 802, name: "Fossil Gen 6", brand: "Fossil", category: "Electronics", subCategory: "Wearables", price: 299, rating: 4.4, reviews: 890, image: exactImages.watch, description: "Wear OS smartwatch.", newArrival: false, bestseller: false },
    { id: 803, name: "Samsonite Luggage", brand: "Samsonite", category: "Accessories", subCategory: "Travel", price: 180, rating: 4.6, reviews: 1000, image: "https://loremflickr.com/800/800/suitcase/all", description: "Durable hardshell.", newArrival: false, bestseller: true },
    { id: 804, name: "Herschel Backpack", brand: "Herschel", category: "Accessories", subCategory: "Bags", price: 60, rating: 4.7, reviews: 2000, image: "https://loremflickr.com/800/800/backpack,bag/all", description: "Classic everyday pack.", newArrival: true, bestseller: true },
    { id: 805, name: "Moleskine Notebook", brand: "Moleskine", category: "Stationery", subCategory: "Notebooks", price: 22, rating: 4.8, reviews: 5000, image: "https://loremflickr.com/800/800/notebook,book/all", description: "Classic hard cover.", newArrival: false, bestseller: true },
    { id: 806, name: "Lamy Safari Pen", brand: "Lamy", category: "Stationery", subCategory: "Pens", price: 30, rating: 4.6, reviews: 1500, image: "https://loremflickr.com/800/800/pen,stationery/all", description: "Ergonomic fountain pen.", newArrival: false, bestseller: true },
    { id: 807, name: "Bose SoundLink", brand: "Bose", category: "Electronics", subCategory: "Audio", price: 119, rating: 4.7, reviews: 2800, image: "https://loremflickr.com/800/800/bluetooth,speaker/all", description: "Micro bluetooth speaker.", newArrival: false, bestseller: true },
    { id: 808, name: "Weber Grill", brand: "Weber", category: "Home", subCategory: "Outdoor", price: 549, rating: 4.8, reviews: 900, image: "https://loremflickr.com/800/800/grill,bbq/all", description: "Gas grill for patio.", newArrival: true, bestseller: false },
    { id: 809, name: "Yeti Cooler", brand: "Yeti", category: "Sports", subCategory: "Outdoor", price: 250, rating: 4.9, reviews: 1200, image: "https://loremflickr.com/800/800/cooler,ice/all", description: "Indestructible cooler.", newArrival: false, bestseller: true },
    { id: 810, name: "Makita Drill", brand: "Makita", category: "Tools", subCategory: "Power Tools", price: 129, rating: 4.7, reviews: 800, image: "https://loremflickr.com/800/800/drill,tool/all", description: "Cordless hammer drill.", newArrival: false, bestseller: false },
    { id: 811, name: "Bosch Tool Kit", brand: "Bosch", category: "Tools", subCategory: "Hand Tools", price: 35, rating: 4.5, reviews: 500, image: "https://loremflickr.com/800/800/toolbox,tools/all", description: "Mixed tool set.", newArrival: true, bestseller: true },
    { id: 812, name: "DJI Mini Drone", brand: "DJI", category: "Electronics", subCategory: "Cameras", price: 459, rating: 4.8, reviews: 1100, image: exactImages.drone, description: "Fly cam.", newArrival: true, bestseller: false },
    { id: 813, name: "Peak Design Bag", brand: "Peak Design", category: "Accessories", subCategory: "Bags", price: 150, rating: 4.9, reviews: 600, image: "https://loremflickr.com/800/800/messenger,bag/all", description: "Everyday messenger.", newArrival: false, bestseller: false },
    { id: 814, name: "Sony Alpha a7 IV", brand: "Sony", category: "Electronics", subCategory: "Cameras", price: 2498, rating: 4.9, reviews: 400, image: exactImages.camera, description: "Full-frame hybrid.", newArrival: true, bestseller: false },
    { id: 815, name: "Roku Streaming Stick", brand: "Roku", category: "Electronics", subCategory: "TV", price: 49, rating: 4.6, reviews: 7000, image: exactImages.tv, description: "4K streaming.", newArrival: false, bestseller: true }
];

export const categories = [...new Set(products.map(p => p.category))];
export const brands = [...new Set(products.map(p => p.brand))];

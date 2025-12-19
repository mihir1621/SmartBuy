export const products = [
    // --- LAPTOPS ---
    {
        id: 1,
        name: "MacBook Air M2",
        category: "Laptops",
        price: 99999,
        originalPrice: 119900,
        discount: 17,
        rating: 4.8,
        reviews: 2150,
        brand: "Apple",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800&q=80",
        description: "Supercharged by M2 chip. The world's thinnest 15-inch laptop.",
        inStock: true,
        isNew: true
    },
    {
        id: 101,
        name: "Dell XPS 13",
        category: "Laptops",
        price: 115000,
        originalPrice: 135000,
        discount: 15,
        rating: 4.7,
        reviews: 1200,
        brand: "Dell",
        image: "https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=800&q=80",
        description: "Premium ultrabook with InfinityEdge display and high performance.",
        inStock: true
    },
    {
        id: 102,
        name: "HP Spectre x360",
        category: "Laptops",
        price: 125000,
        originalPrice: 145000,
        discount: 14,
        rating: 4.6,
        reviews: 950,
        brand: "HP",
        image: "https://images.unsplash.com/photo-1531297461136-82lw8fca3c7c?w=800&q=80", // Replaced with a reliable laptop image
        description: "Convertible laptop with stunning design and powerful features.",
        inStock: true
    },
    {
        id: 103,
        name: "Acer Predator Helios",
        category: "Laptops",
        price: 105000,
        originalPrice: 130000,
        discount: 19,
        rating: 4.5,
        reviews: 1500,
        brand: "Acer",
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80",
        description: "Gaming powerhouse with advanced cooling and high refresh rate.",
        inStock: true
    },
    {
        id: 104,
        name: "Lenovo ThinkPad X1",
        category: "Laptops",
        price: 135000,
        originalPrice: 160000,
        discount: 16,
        rating: 4.8,
        reviews: 800,
        brand: "Lenovo",
        image: "https://images.unsplash.com/photo-1588872657578-a3d2e184594c?w=800&q=80",
        description: "Business laptop known for reliability and excellent keyboard.",
        inStock: true
    },
    {
        id: 105,
        name: "Asus ROG Zephyrus",
        category: "Laptops",
        price: 140000,
        originalPrice: 170000,
        discount: 18,
        rating: 4.7,
        reviews: 1100,
        brand: "Asus",
        image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&q=80",
        description: "Ultra-slim gaming laptop with top-tier performance.",
        inStock: true
    },
    {
        id: 106,
        name: "Microsoft Surface Laptop 5",
        category: "Laptops",
        price: 95000,
        originalPrice: 110000,
        discount: 14,
        rating: 4.4,
        reviews: 600,
        brand: "Microsoft",
        image: "https://images.unsplash.com/photo-1661347334036-54266ec95d86?w=800&q=80", // Updated to a reliable workspace image
        description: "Sleek and stylish laptop with a vibrant touchscreen pixel sense display.",
        inStock: true
    },

    // --- SMARTPHONES ---
    {
        id: 2,
        name: "iPhone 15 Pro",
        category: "Smartphones",
        price: 134900,
        originalPrice: 144900,
        discount: 7,
        rating: 4.9,
        reviews: 3400,
        brand: "Apple",
        image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80", // Use generic iPhone-like image
        description: "Titanium design. A17 Pro chip. The most powerful iPhone ever.",
        inStock: true,
        isNew: true
    },
    {
        id: 3,
        name: "Samsung S24 Ultra",
        category: "Smartphones",
        price: 129999,
        originalPrice: 144999,
        discount: 10,
        rating: 4.8,
        reviews: 1800,
        brand: "Samsung",
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80", // Samsung phone image
        description: "Galaxy AI is here. Experience the new era of mobile.",
        inStock: true
    },
    {
        id: 107,
        name: "Google Pixel 8 Pro",
        category: "Smartphones",
        price: 98000,
        originalPrice: 110000,
        discount: 11,
        rating: 4.6,
        reviews: 900,
        brand: "Google",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff23?w=800&q=80", // Generic smartphone
        description: "The AI-powered phone from Google with an amazing camera.",
        inStock: true
    },
    {
        id: 108,
        name: "OnePlus 12",
        category: "Smartphones",
        price: 64999,
        originalPrice: 69999,
        discount: 7,
        rating: 4.5,
        reviews: 2000,
        brand: "OnePlus",
        image: "https://images.unsplash.com/photo-1592657497426-30238e8ec205?w=800&q=80", // Generic Android
        description: "Smooth beyond belief. Flagship performance.",
        inStock: true
    },
    {
        id: 109,
        name: "Xiaomi 14 Ultra",
        category: "Smartphones",
        price: 99999,
        originalPrice: 110000,
        discount: 9,
        rating: 4.6,
        reviews: 500,
        brand: "Xiaomi",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80", // High quality phone
        description: "Leica optics for professional photography on a phone.",
        inStock: true
    },

    // --- HEADPHONES & AUDIO ---
    {
        id: 4,
        name: "Sony WH-1000XM5",
        category: "Audio",
        price: 29990,
        originalPrice: 34990,
        discount: 14,
        rating: 4.7,
        reviews: 1200,
        brand: "Sony",
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80", // Headphones
        description: "Industry-leading noise cancellation.",
        inStock: true
    },
    {
        id: 110,
        name: "Bose QuietComfort 45",
        category: "Audio",
        price: 24900,
        originalPrice: 29900,
        discount: 17,
        rating: 4.6,
        reviews: 850,
        brand: "Bose",
        image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80", // Reliable Headphones
        description: "Iconic quiet. Comfort. And sound.",
        inStock: true
    },
    {
        id: 111,
        name: "JBL Flip 6",
        category: "Audio",
        price: 9999,
        originalPrice: 13999,
        discount: 28,
        rating: 4.5,
        reviews: 3000,
        brand: "JBL",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80", // Bluetooth Speaker
        description: "Bold sound for every adventure.",
        inStock: true
    },
    {
        id: 112,
        name: "Sennheiser Momentum 4",
        category: "Audio",
        price: 27990,
        originalPrice: 34990,
        discount: 20,
        rating: 4.6,
        reviews: 400,
        brand: "Sennheiser",
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80", // Headphones
        description: "Audiophile-inspired sound with long battery life.",
        inStock: true
    },
    {
        id: 113,
        name: "Apple AirPods Pro 2",
        category: "Audio",
        price: 24900,
        originalPrice: 26900,
        discount: 7,
        rating: 4.8,
        reviews: 5000,
        brand: "Apple",
        image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80", // Earbuds
        description: "Rebuilt from the sound up. Active Noise Cancellation.",
        inStock: true
    },

    // --- MENSWEAR ---
    {
        id: 5,
        name: "Nike Air Max 90",
        category: "Menswear",
        price: 9995,
        originalPrice: 11995,
        discount: 16,
        rating: 4.6,
        reviews: 850,
        brand: "Nike",
        gender: "Men",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80", // Famous red shoe
        description: "The shoe that defined the 90s.",
        inStock: true
    },
    {
        id: 6,
        name: "H&M Relaxed Fit Hoodie",
        category: "Menswear",
        price: 1499,
        originalPrice: 2499,
        discount: 40,
        rating: 4.3,
        reviews: 450,
        brand: "H&M",
        gender: "Men",
        image: "https://images.unsplash.com/photo-1556906781-9a412961d28c?w=800&q=80",
        description: "Soft cotton hoodie for everyday comfort.",
        inStock: true
    },
    {
        id: 114,
        name: "Levi's 511 Slim Jeans",
        category: "Menswear",
        price: 2800,
        originalPrice: 4000,
        discount: 30,
        rating: 4.5,
        reviews: 1100,
        brand: "Levi's",
        gender: "Men",
        image: "https://images.unsplash.com/photo-1542272454315-4c01d74bed82?w=800&q=80", // Jeans
        description: "A modern slim with room to move.",
        inStock: true
    },
    {
        id: 115,
        name: "Puma T-Shirt",
        category: "Menswear",
        price: 899,
        originalPrice: 1299,
        discount: 30,
        rating: 4.2,
        reviews: 600,
        brand: "Puma",
        gender: "Men",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
        description: "Casual comfort with a sporty look.",
        inStock: true
    },
    {
        id: 116,
        name: "Allen Solly Formal Shirt",
        category: "Menswear",
        price: 1899,
        originalPrice: 2599,
        discount: 27,
        rating: 4.4,
        reviews: 700,
        brand: "Allen Solly",
        gender: "Men",
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80", // Shirt
        description: "Crisp cotton shirt for professional appeal.",
        inStock: true
    },
    {
        id: 117,
        name: "Adidas Running Shoes",
        category: "Menswear",
        price: 4500,
        originalPrice: 6000,
        discount: 25,
        rating: 4.6,
        reviews: 950,
        brand: "Adidas",
        gender: "Men",
        image: "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=800&q=80", // Adidas shoe
        description: "Lightweight shoes for your daily run.",
        inStock: true
    },

    // --- WOMENSWEAR ---
    {
        id: 7,
        name: "Zara Floral Maxi Dress",
        category: "Womenswear",
        price: 3590,
        originalPrice: 4990,
        discount: 28,
        rating: 4.5,
        reviews: 320,
        brand: "Zara",
        gender: "Women",
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80", // Dress
        description: "Elegant floral print dress perfect for summer.",
        inStock: true
    },
    {
        id: 8,
        name: "Mango Tote Bag",
        category: "Womenswear",
        price: 2290,
        originalPrice: 2990,
        discount: 23,
        rating: 4.4,
        reviews: 180,
        brand: "Mango",
        gender: "Women",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80", // Bag
        description: "Spacious and stylish for your daily essentials.",
        inStock: true
    },
    {
        id: 118,
        name: "H&M Blouse",
        category: "Womenswear",
        price: 1299,
        originalPrice: 1999,
        discount: 35,
        rating: 4.3,
        reviews: 500,
        brand: "H&M",
        gender: "Women",
        image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80", // Clothes
        description: "Chic blouse for work or casual outings.",
        inStock: true
    },
    {
        id: 119,
        name: "Levis Skinny Jeans",
        category: "Womenswear",
        price: 3200,
        originalPrice: 4500,
        discount: 28,
        rating: 4.5,
        reviews: 800,
        brand: "Levi's",
        gender: "Women",
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80",
        description: "Flattering skinny fit jeans.",
        inStock: true
    },
    {
        id: 120,
        name: "Nike Air Zoom Pegasus",
        category: "Womenswear",
        price: 9000,
        originalPrice: 11000,
        discount: 18,
        rating: 4.7,
        reviews: 650,
        brand: "Nike",
        gender: "Women",
        image: "https://images.unsplash.com/photo-1518002171953-a080ee32280d?w=800&q=80", // Shoe
        description: "Responsive running shoes.",
        inStock: true
    },
    {
        id: 121,
        name: "Silk Saree",
        category: "Womenswear",
        price: 5500,
        originalPrice: 8000,
        discount: 31,
        rating: 4.8,
        reviews: 200,
        brand: "Myntra",
        gender: "Women",
        image: "https://images.unsplash.com/photo-1583391726247-bd74a8138ca7?w=800&q=80", // Replaced with a reliable Fashion/Saree style image
        description: "Traditional silk saree with intricate designs.",
        inStock: true
    },

    // --- HOME & KITCHEN ---
    {
        id: 9,
        name: "Dyson V15 Detect",
        category: "Home",
        price: 54900,
        originalPrice: 65900,
        discount: 16,
        rating: 4.9,
        reviews: 950,
        brand: "Dyson",
        image: "https://images.unsplash.com/photo-1558317374-a309d244678d?w=800&q=80",
        description: "Powerful cordless vacuum with laser detection.",
        inStock: true
    },
    {
        id: 10,
        name: "Philips Air Fryer",
        category: "Home",
        price: 8999,
        originalPrice: 12999,
        discount: 30,
        rating: 4.6,
        reviews: 2500,
        brand: "Philips",
        image: "https://images.unsplash.com/photo-1626082927389-d42a6d7a4124?w=800&q=80", // Fried food/Air fryer thematic
        description: "Great tasting fries with up to 90% less fat.",
        inStock: true
    },
    {
        id: 122,
        name: "IKEA Billy Bookcase",
        category: "Home",
        price: 4500,
        originalPrice: 5000,
        discount: 10,
        rating: 4.7,
        reviews: 3000,
        brand: "IKEA",
        image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80",
        description: "Classic bookcase that fits everywhere.",
        inStock: true
    },
    {
        id: 123,
        name: "Milton Thermosteel Bottle",
        category: "Home",
        price: 850,
        originalPrice: 1100,
        discount: 22,
        rating: 4.5,
        reviews: 1500,
        brand: "Milton",
        image: "https://images.unsplash.com/photo-1602143407151-11115cdbf69c?w=800&q=80",
        description: "Keeps beverages hot or cold for 24 hours.",
        inStock: true
    },
    {
        id: 124,
        name: "Prestige Gas Stove",
        category: "Home",
        price: 3500,
        originalPrice: 4500,
        discount: 22,
        rating: 4.3,
        reviews: 900,
        brand: "Prestige",
        image: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=800&q=80", // Kitchen area
        description: "Efficient gas stove for modern kitchens.",
        inStock: true
    },

    // --- SMARTWATCHES ---
    {
        id: 125,
        name: "Apple Watch Series 9",
        category: "Electronics",
        price: 41900,
        originalPrice: 44900,
        discount: 6,
        rating: 4.8,
        reviews: 1500,
        brand: "Apple",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80", // Watch
        description: "Smarter. Brighter. Mightier.",
        inStock: true
    },
    {
        id: 126,
        name: "Samsung Galaxy Watch 6",
        category: "Electronics",
        price: 26999,
        originalPrice: 32999,
        discount: 18,
        rating: 4.6,
        reviews: 900,
        brand: "Samsung",
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80", // Smartwatch
        description: "Track your health with the latest Galaxy Watch.",
        inStock: true
    },

    // --- CAMERAS ---
    {
        id: 127,
        name: "Sony Alpha a7 IV",
        category: "Electronics",
        price: 215000,
        originalPrice: 240000,
        discount: 10,
        rating: 4.9,
        reviews: 400,
        brand: "Sony",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80", // Camera
        description: "The basic is never basic. Full-frame hybrid perfection.",
        inStock: true
    },
    {
        id: 128,
        name: "Canon EOS R6",
        category: "Electronics",
        price: 200000,
        originalPrice: 225000,
        discount: 11,
        rating: 4.8,
        reviews: 350,
        brand: "Canon",
        image: "https://images.unsplash.com/photo-1519638831568-d9897f54ed69?w=800&q=80",
        description: "High speed, low light, and 4K video.",
        inStock: true
    },

    // --- MORE ADIDAS SHOES ---
    {
        id: 129,
        name: "Adidas Ultraboost 22",
        category: "Menswear",
        price: 17999,
        originalPrice: 19999,
        discount: 10,
        rating: 4.8,
        reviews: 1200,
        brand: "Adidas",
        gender: "Men",
        image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80", // Adidas Ultraboost style
        description: "Energy-returning boost midsole for comfort.",
        inStock: true
    },
    {
        id: 130,
        name: "Adidas Superstar",
        category: "Menswear",
        price: 8999,
        originalPrice: 10999,
        discount: 18,
        rating: 4.7,
        reviews: 3000,
        brand: "Adidas",
        gender: "Men",
        image: "https://images.unsplash.com/photo-1518002171953-a080ee32280d?w=800&q=80",
        description: "Iconic rubber shell toe design since the 70s.",
        inStock: true
    },
    {
        id: 131,
        name: "Adidas NMD_R1",
        category: "Menswear",
        price: 12999,
        originalPrice: 14999,
        discount: 13,
        rating: 4.5,
        reviews: 850,
        brand: "Adidas",
        gender: "Men",
        image: "https://images.unsplash.com/photo-1587563871167-1ee9c731aef4?w=800&q=80", // Sneaker
        description: "Modern street style with archive-inspired details.",
        inStock: true
    },
    {
        id: 132,
        name: "Adidas Stan Smith",
        category: "Menswear",
        price: 7999,
        originalPrice: 9999,
        discount: 20,
        rating: 4.6,
        reviews: 2100,
        brand: "Adidas",
        gender: "Men",
        image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80", // White sneaker
        description: "Timeless white minimal sneakers.",
        inStock: true
    }
];

export const products = [
    // --- Electronics: Mobiles ---
    {
        id: 1001,
        name: "iPhone 15 Pro Max",
        price: 1199,
        category: "Mobiles",
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800", // Front/Side Titanium
            "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800", // Back Camera
            "https://images.unsplash.com/photo-1695048132860-29687e144a19?auto=format&fit=crop&q=80&w=800"  // Hand holding
        ],
        description: "Forged in titanium. The iPhone 15 Pro Max features the powerful A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever with 5x Telephoto zoom.",
        rating: 4.9,
        reviews: 3420,
        bestseller: true,
    },
    {
        id: 1002,
        name: "Samsung Galaxy S24 Ultra",
        price: 1299,
        category: "Mobiles",
        image: "https://images.unsplash.com/photo-1610945265064-f45a855f79d1?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1610945265064-f45a855f79d1?auto=format&fit=crop&q=80&w=800", // Back
            "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=800", // Front
            "https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?auto=format&fit=crop&q=80&w=800"  // Side/Detail
        ],
        description: "Unleash new levels of creativity, productivity and possibility with Galaxy S24 Ultra. Featuring Galaxy AI, a 200MP camera, and the built-in S Pen.",
        rating: 4.8,
        reviews: 2100,
    },
    {
        id: 1003,
        name: "Google Pixel 8 Pro",
        price: 999,
        category: "Mobiles",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff5b?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1598327105666-5b89351aff5b?auto=format&fit=crop&q=80&w=800", // Back
            "https://images.unsplash.com/photo-1612442443566-ae737296f433?auto=format&fit=crop&q=80&w=800", // Front
            "https://images.unsplash.com/photo-1658314756662-e472580e6d55?auto=format&fit=crop&q=80&w=800"  // Lifestyle
        ],
        description: "The all-pro phone engineered by Google. It has a polished aluminum frame and matte back glass, and comes with the best Pixel Camera yet.",
        rating: 4.7,
        reviews: 1500,
    },
    {
        id: 1004,
        name: "OnePlus 12",
        price: 799,
        category: "Mobiles",
        image: "https://images.unsplash.com/photo-1678911820864-e2eecfcbc377?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1678911820864-e2eecfcbc377?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1660309199321-dfa5223068e5?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1673847429188-75cbe6f2d24c?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Smooth beyond belief. OnePlus 12 features the Snapdragon 8 Gen 3, a 4th Gen Hasselblad Camera System, and an all-new 2K 120Hz ProXDR display.",
        rating: 4.7,
        reviews: 1250,
    },
    {
        id: 1005,
        name: "Xiaomi 14 Ultra",
        price: 1099,
        category: "Mobiles",
        image: "https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1551817958-c1bfa7d1d234?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1537589376225-5405c60a5cd8?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Co-engineered with Leica. The Xiaomi 14 Ultra redefines mobile photography with a 1-inch sensor and variable aperture system.",
        rating: 4.6,
        reviews: 890,
    },
    {
        id: 1006,
        name: "Realme GT 5 Pro",
        price: 649,
        category: "Mobiles",
        image: "https://images.unsplash.com/photo-1629193798544-d8438dbdf2a7?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1629193798544-d8438dbdf2a7?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1550184461-1250325c9359?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Flagship performance at an unbeatable price. Features 240W fast charging and a Snapdragon 8 Gen 3 processor.",
        rating: 4.5,
        reviews: 670,
    },
    {
        id: 1007,
        name: "Motorola Edge 50 Ultra",
        price: 999,
        category: "Mobiles",
        image: "https://images.unsplash.com/photo-1592899677712-a17ebd1e2665?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1592899677712-a17ebd1e2665?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Design meets intelligence. The Motorola Edge 50 Ultra features a Pantone-validated display and body, with Hello UI.",
        rating: 4.4,
        reviews: 450,
    },
    {
        id: 1008,
        name: "iPhone 15",
        price: 799,
        category: "Mobiles",
        image: "https://images.unsplash.com/photo-1696446702183-f8a58759ce6c?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1696446702183-f8a58759ce6c?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1696446700445-568eb746db98?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1695048133590-b6a4a1599587?auto=format&fit=crop&q=80&w=800"
        ],
        description: "New 48MP camera, Dynamic Island, and USB-C. The standard iPhone 15 brings pro features to everyone.",
        rating: 4.8,
        reviews: 2100,
    },
    {
        id: 1009,
        name: "iPhone SE (3rd Gen)",
        price: 429,
        category: "Mobiles",
        image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1590497914856-14ab77de0db3?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Budget-friendly power. A15 Bionic chip in a classic design.",
        rating: 4.5,
        reviews: 1500,
    },
    {
        id: 1010,
        name: "Samsung Galaxy A55 5G",
        price: 449,
        category: "Mobiles",
        image: "https://images.unsplash.com/photo-1678911820864-e2eecfcbc377?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1678911820864-e2eecfcbc377?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1610945265064-f45a855f79d1?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1629193798544-d8438dbdf2a7?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Awesome for everyone. Premium design, vibrant Nightography, and 2-day battery life.",
        rating: 4.6,
        reviews: 3200,
    },
    {
        id: 1011,
        name: "Samsung Galaxy Z Fold 5",
        price: 1799,
        category: "Mobiles",
        image: "https://images.unsplash.com/photo-1658564038848-18e0018d9cc9?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1658564038848-18e0018d9cc9?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1657630712953-ad4bd0042467?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1616400619175-5beda3a17896?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Unfold your world. The ultimate 7.6-inch Main Display invites you to do more.",
        rating: 4.7,
        reviews: 950,
    },
    {
        id: 1012,
        name: "Redmi Note 13 Pro+",
        price: 399,
        category: "Mobiles",
        image: "https://images.unsplash.com/photo-1695574585148-3a137812547b?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1695574585148-3a137812547b?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1598327105666-5b89351aff5b?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800"
        ],
        description: "SuperNote. 200MP OIS Camera, curved 1.5K display, and IP68 water resistance.",
        rating: 4.5,
        reviews: 5000,
    },
    {
        id: 1013,
        name: "POCO X6 Pro",
        price: 349,
        category: "Mobiles",
        image: "https://images.unsplash.com/photo-1629193798544-d8438dbdf2a7?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1629193798544-d8438dbdf2a7?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1592899677712-a17ebd1e2665?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Speedoulsy fast. Dimensity 8300-Ultra processor for flagship-level gaming.",
        rating: 4.4,
        reviews: 1800,
    },
    {
        id: 1014,
        name: "Realme 12 Pro+",
        price: 369,
        category: "Mobiles",
        image: "https://images.unsplash.com/photo-1679069150117-64032d80dcb8?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1679069150117-64032d80dcb8?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1681284562543-855776d6ec55?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Portrait Master. Periscope Portrait Camera and Luxury Watch Design.",
        rating: 4.6,
        reviews: 1200,
    },
    {
        id: 1015,
        name: "Vivo X100 Pro",
        price: 999,
        category: "Mobiles",
        image: "https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1610945265064-f45a855f79d1?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1598327105666-5b89351aff5b?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Photography Redefined. ZEISS APO Floating Telephoto Camera and MediaTek Dimensity 9300.",
        rating: 4.7,
        reviews: 650,
    },
    {
        id: 1016,
        name: "iQOO 12",
        price: 649,
        category: "Mobiles",
        image: "https://images.unsplash.com/photo-1611317544062-817ab3210d32?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1611317544062-817ab3210d32?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1621330387646-5a25e295d436?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Monster Inside. India's first Snapdragon 8 Gen 3 phone designed for peak gaming performance.",
        rating: 4.5,
        reviews: 900,
    },
    {
        id: 1017,
        name: "OPPO Find X7 Ultra",
        price: 1099,
        category: "Mobiles",
        image: "https://images.unsplash.com/photo-1610945265064-f45a855f79d1?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1610945265064-f45a855f79d1?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800"
        ],
        description: "The Ultimate Camera Phone. World's first quad main camera with HyperTone Image Engine.",
        rating: 4.8,
        reviews: 430,
    },
    {
        id: 1018,
        name: "OPPO Reno 11 Pro",
        price: 499,
        category: "Mobiles",
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&q=80&w=800"
        ],
        description: "The Portrait Expert. Ultra-Clear Portrait Camera System and natural aesthetic design.",
        rating: 4.5,
        reviews: 800,
    },
    {
        id: 1019,
        name: "OnePlus Nord CE 4",
        price: 329,
        category: "Mobiles",
        image: "https://images.unsplash.com/photo-1617127365659-367c4af88060?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1617127365659-367c4af88060?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1550184461-1250325c9359?auto=format&fit=crop&q=80&w=800"
        ],
        description: "A little more than you'd expect. Fast charging, smooth display, and reliable performance.",
        rating: 4.4,
        reviews: 2500,
    },
    {
        id: 1020,
        name: "OnePlus Open",
        price: 1699,
        category: "Mobiles",
        image: "https://images.unsplash.com/photo-1603534608331-50e587fd54d6?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1603534608331-50e587fd54d6?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1627341935634-1c42289c09c2?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Open to everything. The first foldable from OnePlus, delivering a desktop-like experience in your pocket.",
        rating: 4.8,
        reviews: 650,
    },
    {
        id: 1021,
        name: "Google Pixel 8a",
        price: 499,
        category: "Mobiles",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff5b?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1598327105666-5b89351aff5b?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1612442443566-ae737296f433?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1658314756662-e472580e6d55?auto=format&fit=crop&q=80&w=800"
        ],
        description: "The AI phone at an amazing price. Google Tensor G3, best-in-class camera, and 7 years of updates.",
        rating: 4.6,
        reviews: 1100,
    },
    {
        id: 1022,
        name: "Motorola Razr 40 Ultra",
        price: 999,
        category: "Mobiles",
        image: "https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1558238711-e6e287042a9b?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Flip the script. Largest external display on a flip phone, iconic design, and infinite possibilities.",
        rating: 4.5,
        reviews: 780,
    },
    {
        id: 1023,
        name: "Huawei Mate 60 Pro",
        price: 1199,
        category: "Mobiles",
        image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Breakthrough technology. Satellite calling, ultra-reliable Kunlun Glass, and powerful XMAGE camera.",
        rating: 4.9,
        reviews: 2000,
    },
    {
        id: 1024,
        name: "Honor Magic 6 Pro",
        price: 1099,
        category: "Mobiles",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1593121925328-369cc8459c08?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Discover the Magic. Falcon Camera System, Silicon-Carbon Battery, and NanoCrystal Shield.",
        rating: 4.7,
        reviews: 550,
    },
    {
        id: 1025,
        name: "Nothing Phone (2a)",
        price: 349,
        category: "Mobiles",
        image: "https://images.unsplash.com/photo-1627622323385-d6d13d752402?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1627622323385-d6d13d752402?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Powerfully unique. Transparent back design, Glyph Interface, and clean Nothing OS.",
        rating: 4.6,
        reviews: 1400,
    },

    // --- Electronics: Laptops ---
    {
        id: 2001,
        name: "MacBook Air M3",
        price: 1099,
        category: "Laptops",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=800", // Open front
            "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800", // Top down
            "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800"  // Side profile
        ],
        description: "Lean. Mean. M3 machine. The MacBook Air sails through work and play, and the M3 chip brings even greater capabilities to the world's most popular laptop.",
        rating: 4.9,
        reviews: 5600,
        bestseller: true,
    },
    {
        id: 2002,
        name: "Dell XPS 15",
        price: 1499,
        category: "Laptops",
        image: "https://images.unsplash.com/photo-1593642632823-8f78536788c6?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1593642632823-8f78536788c6?auto=format&fit=crop&q=80&w=800", // Front
            "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&q=80&w=800", // Keyboard detail
            "https://images.unsplash.com/photo-1588872657578-a3d2af14e501?auto=format&fit=crop&q=80&w=800"  // Closed/Side
        ],
        description: "Immersive 15.6-inch laptop with a stunning 4K+ OLED display and high-performance 13th Gen Intel Core processors.",
        rating: 4.6,
        reviews: 1200,
    },
    {
        id: 2003,
        name: "ASUS ROG Gaming Laptop",
        price: 1599,
        category: "Laptops",
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800", // Front
            "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800", // Keyboard
            "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=800"  // Setup
        ],
        description: "High-performance gaming laptop with RGB keyboard, high refresh rate display, and powerful dedicated graphics.",
        rating: 4.7,
        reviews: 890,
    },
    {
        id: 2004,
        name: "MacBook Pro 16 (M3 Max)",
        price: 2499,
        category: "Laptops",
        image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Mind-blowing. Head-turning. The most powerful MacBook Pro ever is here, capable of the most demanding workflows.",
        rating: 4.9,
        reviews: 3200,
    },
    {
        id: 2005,
        name: "Dell Alienware m16 R2",
        price: 1899,
        category: "Laptops",
        image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Game like a pro. High-performance gaming laptop with advanced Cryo-tech cooling and AlienFX lighting.",
        rating: 4.7,
        reviews: 950,
    },
    {
        id: 2006,
        name: "Dell Inspiron 16 Plus",
        price: 999,
        category: "Laptops",
        image: "https://images.unsplash.com/photo-1588872657578-a3d2af14e501?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1588872657578-a3d2af14e501?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1593642632823-8f78536788c6?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Inspiration comes easy. A 16-inch laptop designed for creators, featuring a 2.5K display and NVIDIA RTX graphics.",
        rating: 4.5,
        reviews: 1500,
    },
    {
        id: 2007,
        name: "HP Spectre x360 14",
        price: 1399,
        category: "Laptops",
        image: "https://images.unsplash.com/photo-1544731612-de7f96afe55f?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1544731612-de7f96afe55f?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1555618254-754d9c72e2a2?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Adaptive intelligence. A stunning 2-in-1 laptop that automatically adjusts to your surroundings for the best experience.",
        rating: 4.8,
        reviews: 890,
    },
    {
        id: 2008,
        name: "HP OMEN 16",
        price: 1299,
        category: "Laptops",
        image: "https://images.unsplash.com/photo-1595327656903-2f54e37ce09b?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1595327656903-2f54e37ce09b?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1592351989710-53b5168dc04c?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1626218174358-77b797b6eb68?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Don't just play, transcend. OMEN Tempest Cooling technology keeping you cool under pressure.",
        rating: 4.6,
        reviews: 700,
    },
    {
        id: 2009,
        name: "Lenovo ThinkPad X1 Carbon Gen 12",
        price: 1699,
        category: "Laptops",
        image: "https://images.unsplash.com/photo-1515347619252-60a6bf4fffce?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1515347619252-60a6bf4fffce?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1588702547923-7093a6c3f067?auto=format&fit=crop&q=80&w=800"
        ],
        description: "The gold standard of business laptops. Ultralight weight, legendary keyboard, and military-grade durability.",
        rating: 4.8,
        reviews: 2100,
    },
    {
        id: 2010,
        name: "Lenovo Legion Pro 7i",
        price: 2199,
        category: "Laptops",
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1580522154071-c6ca47a859ad?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1602526212450-422203cf090c?auto=format&fit=crop&q=80&w=800"
        ],
        description: "The world's most powerful AI-tuned gaming laptops. Pure performance with RTX 4090 support.",
        rating: 4.8,
        reviews: 650,
    },
    {
        id: 2011,
        name: "ASUS ZenBook Duo (2024)",
        price: 1699,
        category: "Laptops",
        image: "https://images.unsplash.com/photo-1516387938699-a93567ec168e?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1516387938699-a93567ec168e?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Let's Duo it. Dual 14-inch OLED touchscreens for the ultimate multitasking experience.",
        rating: 4.7,
        reviews: 320,
    },
    {
        id: 2012,
        name: "Acer Predator Helios 16",
        price: 1599,
        category: "Laptops",
        image: "https://images.unsplash.com/photo-1592351989710-53b5168dc04c?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1592351989710-53b5168dc04c?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1618424181497-157f2c906d84?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Prepare for battle. Equipped with superior cooling technology and high-speed displays.",
        rating: 4.6,
        reviews: 480,
    },
    {
        id: 2013,
        name: "Microsoft Surface Laptop Studio 2",
        price: 1999,
        category: "Laptops",
        image: "https://images.unsplash.com/photo-1531297461136-82lw632225a0?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1531297461136-82lw632225a0?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1512314889357-e157c22f938d?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Built for performance. A versatile laptop that transitions from a touchscreen laptop to a portable canvas.",
        rating: 4.8,
        reviews: 550,
    },
    {
        id: 2014,
        name: "Samsung Galaxy Book4 Ultra",
        price: 2399,
        category: "Laptops",
        image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1531297461136-82lw632225a0?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Connect your Galaxy. A premium laptop with a stunning Dynamic AMOLED 2X display and seamless phone connectivity.",
        rating: 4.7,
        reviews: 430,
    },
    {
        id: 2015,
        name: "MSI Raider GE78",
        price: 2599,
        category: "Laptops",
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Light 'em up. The ultimate powerhouse with Matrix Light Bar and extreme performance for gamers.",
        rating: 4.7,
        reviews: 620,
    },

    // --- Audio ---
    {
        id: 8001,
        name: "Apple AirPods Pro (2nd Gen)",
        price: 249,
        category: "Audio",
        image: "https://images.unsplash.com/photo-1629367494173-c78a56567877?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1629367494173-c78a56567877?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1588156979435-379b9d802b74?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Rebuilt from the sound up. AirPods Pro feature up to 2x more Active Noise Cancellation and Adaptive Transparency.",
        rating: 4.9,
        reviews: 4500,
    },
    {
        id: 8002,
        name: "Samsung Galaxy Buds2 Pro",
        price: 229,
        category: "Audio",
        image: "https://images.unsplash.com/photo-1658564038848-18e0018d9cc9?auto=format&fit=crop&q=80&w=800", // Generic buds look
        images: [
            "https://images.unsplash.com/photo-1658564038848-18e0018d9cc9?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=800"
        ],
        description: "24-bit Hi-Fi audio for quality listening. Active Noise Canceling with 3 high-SNR microphones.",
        rating: 4.7,
        reviews: 2100,
    },
    {
        id: 8003,
        name: "Sony WH-1000XM5",
        price: 399,
        category: "Audio",
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1596516109370-29001ec8ec36?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Industry-leading noise cancellation. Ultra-clear call quality and a 30-hour battery life.",
        rating: 4.8,
        reviews: 3200,
    },
    {
        id: 8004,
        name: "boAt Rockerz 550",
        price: 49,
        category: "Audio",
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Playback that keeps you going. 50mm dynamic drivers providing immersive audio.",
        rating: 4.4,
        reviews: 5500,
    },
    {
        id: 8005,
        name: "JBL Tune 770NC",
        price: 99,
        category: "Audio",
        image: "https://images.unsplash.com/photo-1612444530582-fc661f24d38d?auto=format&fit=crop&q=80&w=800", // Generic headphone
        images: [
            "https://images.unsplash.com/photo-1612444530582-fc661f24d38d?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1487215078519-e21cc028d29c?auto=format&fit=crop&q=80&w=800"
        ],
        description: "JBL Pure Bass Sound. Adaptive Noise Cancelling with Smart Ambient.",
        rating: 4.5,
        reviews: 1200,
    },
    {
        id: 8006,
        name: "OnePlus Buds Pro 2",
        price: 179,
        category: "Audio",
        image: "https://images.unsplash.com/photo-1606220588913-176375c6d1cb?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1606220588913-176375c6d1cb?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1590658006998-ca756317d084?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Unlock the next level of sound. MelodyBoost Dual Drivers co-created with Dynaudio.",
        rating: 4.6,
        reviews: 800,
    },

    // --- Smartwatches ---
    {
        id: 9001,
        name: "Apple Watch Series 9",
        price: 399,
        category: "Smartwatches",
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1510017098667-27dfc7150acb?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Smarter. Brighter. Mightier. Featuring the new S9 SiP and Double Tap gesture.",
        rating: 4.9,
        reviews: 2100,
    },
    {
        id: 9002,
        name: "Samsung Galaxy Watch6",
        price: 299,
        category: "Smartwatches",
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Know your gear. Advanced sleep coaching, heart rate monitoring, and a larger display.",
        rating: 4.7,
        reviews: 1500,
    },
    {
        id: 9003,
        name: "Fitbit Versa 4",
        price: 199,
        category: "Smartwatches",
        image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1557935728-e6d1eaed5540?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Get better results. Daily Readiness Score, GPS, and 40+ exercise modes.",
        rating: 4.5,
        reviews: 900,
    },
    {
        id: 9004,
        name: "Garmin Fenix 7 Pro",
        price: 799,
        category: "Smartwatches",
        image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Be your best. Solar charging, built-in flashlight, and advanced training metrics.",
        rating: 4.9,
        reviews: 450,
    },
    {
        id: 9005,
        name: "Fossil Gen 6 Wellness Edition",
        price: 229,
        category: "Smartwatches",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800", // Classic watch face
        images: [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Classic design, smart tech. Always-on display and Snapdragon Wear 4100+ platform.",
        rating: 4.4,
        reviews: 600,
    },

    // --- TVs ---
    {
        id: 10001,
        name: "Samsung 65\" Neo QLED 4K",
        price: 1499,
        category: "TVs",
        image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1577979749830-f1d742b96791?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Quantum Matrix Technology. Experience ultra-precise light control and brilliant details.",
        rating: 4.8,
        reviews: 1200,
    },
    {
        id: 10002,
        name: "Sony BRAVIA XR 55\" OLED",
        price: 1399,
        category: "TVs",
        image: "https://images.unsplash.com/photo-1552975084-6e027cd345c2?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1552975084-6e027cd345c2?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1601944179066-29786cb9d32a?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Pure Black. Lifelike brightness. Cognitive Processor XR ensures real-life depth and color.",
        rating: 4.9,
        reviews: 800,
    },
    {
        id: 10003,
        name: "LG OLED evo C3 65\"",
        price: 1699,
        category: "TVs",
        image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Brightness Booster. The world's #1 OLED TV series featuring the a9 AI Processor Gen6.",
        rating: 4.8,
        reviews: 1500,
    },


    // --- Desktops ---
    {
        id: 11001,
        name: "Apple iMac 24\" (M3)",
        price: 1299,
        category: "Desktops",
        image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1527435734823-15456b32252b?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Packed with more juice. The world's best all-in-one computer, supercharged by the M3 chip.",
        rating: 4.8,
        reviews: 950,
    },
    {
        id: 11002,
        name: "Dell OptiPlex All-in-One",
        price: 899,
        category: "Desktops",
        image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800", // Generic Dell Setup
        images: [
            "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Intelligence you can rely on. Seamless collaboration and personalized performance.",
        rating: 4.6,
        reviews: 400,
    },
    {
        id: 11003,
        name: "HP Pavilion Desktop",
        price: 699,
        category: "Desktops",
        image: "https://images.unsplash.com/photo-1588620063102-f46399435b5a?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1588620063102-f46399435b5a?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Proven performance. A reliable desktop PC that passes over 230 tests for durability.",
        rating: 4.5,
        reviews: 650,
    },
    {
        id: 11004,
        name: "Lenovo ThinkCentre Neo",
        price: 749,
        category: "Desktops",
        image: "https://images.unsplash.com/photo-1547082299-bb196bcc749c?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1547082299-bb196bcc749c?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1510511233967-8b5c9a7c0934?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Modern productivity. High-speed performance and eco-friendly design.",
        rating: 4.7,
        reviews: 320,
    },

    // --- Monitors ---
    {
        id: 11501,
        name: "LG UltraGear 27\" Gaming Monitor",
        price: 349,
        category: "Monitors",
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Speed you can feel. 1ms response time and 144Hz refresh rate for competitive gaming.",
        rating: 4.8,
        reviews: 1500,
    },
    {
        id: 11502,
        name: "Dell UltraSharp 27\" 4K",
        price: 599,
        category: "Monitors",
        image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Crafted for productivity. 4K resolution and wide color coverage for professional work.",
        rating: 4.9,
        reviews: 890,
    },

    // --- Cameras ---
    {
        id: 12001,
        name: "Sony Alpha 7 IV",
        price: 2499,
        category: "Cameras",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?auto=format&fit=crop&q=80&w=800"
        ],
        description: "The basic is the best. 33MP full-frame sensor and 4K 60p recording.",
        rating: 4.9,
        reviews: 1200,
    },
    {
        id: 12002,
        name: "Canon EOS R6 Mark II",
        price: 2299,
        category: "Cameras",
        image: "https://images.unsplash.com/photo-1506241537529-eefea1fbe44d?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1506241537529-eefea1fbe44d?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1519638831568-d9897f54ed69?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Master of stills and motion. 24.2 MP and 40 fps electronic shutter.",
        rating: 4.8,
        reviews: 850,
    },
    {
        id: 12003,
        name: "Nikon Z6 II",
        price: 1999,
        category: "Cameras",
        image: "https://images.unsplash.com/photo-1616423664033-2a6cd78f936b?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1616423664033-2a6cd78f936b?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1564466184917-272d3aaa219f?auto=format&fit=crop&q=80&w=800"
        ],
        description: "True multimedia powerhouse. Dual processors and 273-point Hybrid AF.",
        rating: 4.7,
        reviews: 670,
    },
    {
        id: 12004,
        name: "GoPro HERO12 Black",
        price: 399,
        category: "Cameras",
        image: "https://images.unsplash.com/photo-1566416972033-6a9787a26f4e?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1566416972033-6a9787a26f4e?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1596707340632-698f1f7d6a43?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Incredible image quality. HyperSmooth 6.0 and HDR video.",
        rating: 4.8,
        reviews: 3200,
    },

    // --- Appliances (Washing Machines) ---
    {
        id: 13001,
        name: "LG 9Kg Front Load AI DD",
        price: 699,
        category: "Appliances",
        image: "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Intelligent Care with 18% More Fabric Protection. AI Direct Drive™ Motor.",
        rating: 4.7,
        reviews: 850,
    },
    {
        id: 13002,
        name: "Samsung 8Kg EcoBubble",
        price: 549,
        category: "Appliances",
        image: "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Powerful cleaning at low temperatures. EcoBubble™ technology turns detergent into bubbles.",
        rating: 4.6,
        reviews: 1200,
    },
    {
        id: 13003,
        name: "Bosch Series 6 Front Load",
        price: 599,
        category: "Appliances",
        image: "https://images.unsplash.com/photo-1626806749716-641508a3d455?auto=format&fit=crop&q=80&w=800", // Similar vibe
        images: [
            "https://images.unsplash.com/photo-1626806749716-641508a3d455?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Perfect results with minimum water and energy. EcoSilence Drive™ and SpeedPerfect.",
        rating: 4.7,
        reviews: 550,
    },

    // --- Fashion ---
    // --- Fashion: H&M ---
    {
        id: 14001,
        name: "H&M Men's Relaxed Fit Hoodie",
        price: 39,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1556906781-9a412961d28c?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1556906781-9a412961d28c?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1578587017763-9d327a0e246c?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Soft cotton-blend hoodie perfect for layering in all seasons. A wardrobe staple.",
        rating: 4.6,
        reviews: 2100,
    },
    {
        id: 14002,
        name: "H&M Women's Floral Wrap Dress",
        price: 29,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Airy viscose dress with a printed pattern. Ideal for summer outings.",
        rating: 4.5,
        reviews: 1500,
    },

    // --- Fashion: Nike ---
    {
        id: 14003,
        name: "Nike Sportswear Club Fleece",
        price: 55,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1556906781-9a412961d28c?auto=format&fit=crop&q=80&w=800", // Placeholder
        images: [
            "https://images.unsplash.com/photo-1556906781-9a412961d28c?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1578587017763-9d327a0e246c?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Classic comfort. Soft fleece fabric with an adjustable hood.",
        rating: 4.8,
        reviews: 3200,
    },
    {
        id: 14004,
        name: "Nike Pro Women's Leggings",
        price: 45,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Stretchy, supportive fabric that wicks sweat to keep you dry during workouts.",
        rating: 4.7,
        reviews: 1800,
    },

    // --- Fashion: Levi's ---
    {
        id: 14005,
        name: "Levi's 511 Slim Jeans",
        price: 69,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1542272617-08f08630329e?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1542272617-08f08630329e?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800"
        ],
        description: "A modern slim with room to move. The definitive alternative to skinny jeans.",
        rating: 4.6,
        reviews: 2500,
    },
    {
        id: 14006,
        name: "Levi's Women's Trucker Jacket",
        price: 89,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?auto=format&fit=crop&q=80&w=800"
        ],
        description: "The original jean jacket since 1967. A blank canvas for self-expression.",
        rating: 4.7,
        reviews: 950,
    },

    // --- Fashion: Pantaloons ---
    {
        id: 14007,
        name: "Pantaloons Women's Embroidered Kurti",
        price: 25,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1630328220038-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1630328220038-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1583391725988-e4302303ccce?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Add a touch of ethnicity to your wardrobe with this stylish embroidered kurti.",
        rating: 4.4,
        reviews: 400,
    },

    // --- Fashion: Allen Solly ---
    {
        id: 14008,
        name: "Allen Solly Men's Slim Fit Shirt",
        price: 35,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Crisp and sharp. Perfect for office wear or formal events.",
        rating: 4.5,
        reviews: 800,
    },

    // --- Fashion: Max ---
    {
        id: 14009,
        name: "Max Women's Printed A-line Dress",
        price: 19,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Vibrant prints and breathable fabric for maximum comfort.",
        rating: 4.3,
        reviews: 1200,
    },

    // --- Fashion: Puma ---
    {
        id: 14010,
        name: "Puma Men's T7 Track Jacket",
        price: 65,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=800", // Sporty vibe
        images: [
            "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Iconic sporty style from the archives. Durable and stylish.",
        rating: 4.6,
        reviews: 650,
    },

    // --- Fashion: Flying Machine ---
    {
        id: 14011,
        name: "Flying Machine Men's Cool Rider Jeans",
        price: 49,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Rugged and stylish denim for the modern youth.",
        rating: 4.4,
        reviews: 300,
    },

    // --- Fashion: Pepe Jeans ---
    {
        id: 14012,
        name: "Pepe Jeans Men's Checked Shirt",
        price: 45,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1603252109303-27514432f28a?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1603252109303-27514432f28a?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1589465885857-44ed19e81d26?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Classic checked shirt made from premium cotton fabric.",
        rating: 4.5,
        reviews: 420,
    },

    // --- Fashion: Roadster ---
    {
        id: 14013,
        name: "Roadster Men's Bomber Jacket",
        price: 49,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1559551409-dadc959f76b8?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Top-notch casual wear for the road ahead. Sturdy and fashionable.",
        rating: 4.4,
        reviews: 1100,
    },
    {
        id: 202,
        name: "Leather Aviator Watch",
        price: 159,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1533139502658-0198f920d3e8?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Elegant analog watch with a genuine leather strap.",
        rating: 4.7,
        reviews: 112,
    },
    {
        id: 301,
        name: "Summer Floral Dress",
        price: 59,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Breezy floral dress perfect for summer outings.",
        rating: 4.6,
        reviews: 560,
    },
    {
        id: 302,
        name: "Designer Handbag",
        price: 299,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1590874102752-e6381e45ef2b?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Chic leather handbag with ample storage and stylish hardware.",
        rating: 4.9,
        reviews: 230,
    },
    {
        id: 303,
        name: "Men's Traditional Kurta",
        price: 45,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1630328220038-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1630328220038-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800", // Main
            "https://images.unsplash.com/photo-1586227740560-8cf2732c1531?auto=format&fit=crop&q=80&w=800", // Detail
            "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800"  // Lifestyle
        ],
        description: "Stylish and comfortable cotton kurta for festive occasions and casual wear.",
        rating: 4.4,
        reviews: 180,
    },
    {
        id: 304,
        name: "Elegant Silk Saree",
        price: 120,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1610189012906-47833822952c?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1610189012906-47833822952c?auto=format&fit=crop&q=80&w=800", // Full view
            "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800", // Texture/Pallu
            "https://images.unsplash.com/photo-1583391725988-e4302303ccce?auto=format&fit=crop&q=80&w=800"  // Draped
        ],
        description: "Beautifully crafted silk saree with intricate borders, perfect for weddings and parties.",
        rating: 4.8,
        reviews: 320,
    },
    {
        id: 305,
        name: "Casual Sneakers",
        price: 65,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1560769629-975e13f0c470?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1560769629-975e13f0c470?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Trendy and comfortable sneakers for everyday wear.",
        rating: 4.5,
        reviews: 500,
    },
    {
        id: 306,
        name: "Travel Backpack",
        price: 55,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1581605405669-fdaf81168893?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Durable and spacious backpack with laptop compartment, ideal for travel and work.",
        rating: 4.7,
        reviews: 410,
    },

    // --- Kids: Playing Items (Indoor) ---
    {
        id: 15001,
        name: "LEGO Classic Large Creative Brick Box",
        price: 59,
        category: "Kids",
        image: "https://images.unsplash.com/photo-1587654780291-39c940483713?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1587654780291-39c940483713?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Engage your kids in open-ended creativity with this set of 790 colorful pieces.",
        rating: 4.9,
        reviews: 3200,
        bestseller: true,
    },
    {
        id: 15002,
        name: "Barbie Dreamhouse Dollhouse",
        price: 199,
        category: "Kids",
        image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800", // Generic dollhouse vibe
        images: [
            "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800"
        ],
        description: "The ultimate 3-story dollhouse with pool, slide, and elevator.",
        rating: 4.8,
        reviews: 850,
    },

    // --- Kids: Playing Items (Outdoor) ---
    {
        id: 15003,
        name: "RoyalBaby Kids Bike 16\"",
        price: 129,
        category: "Kids",
        image: "https://images.unsplash.com/photo-1595183842323-b6dc02377b28?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1595183842323-b6dc02377b28?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1520333789090-1afc82db536a?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Durable and safe bicycle with training wheels, perfect for beginners.",
        rating: 4.7,
        reviews: 500,
    },
    {
        id: 15004,
        name: "Nivia Pro Football",
        price: 25,
        category: "Kids",
        image: "https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Official size and weight football, stitched for durability.",
        rating: 4.5,
        reviews: 900,
    },

    // --- Kids: Electronic Toys ---
    {
        id: 15005,
        name: "Remote Control Rock Crawler",
        price: 49,
        category: "Kids",
        image: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1536421469767-80559bb6f5e1?auto=format&fit=crop&q=80&w=800"
        ],
        description: "4WD off-road RC car with rechargeable batteries and strong grip tires.",
        rating: 4.6,
        reviews: 420,
    },

    // --- Kids: Study Items ---
    {
        id: 15006,
        name: "Faber-Castell Connector Pens (50)",
        price: 15,
        category: "Kids",
        image: "https://images.unsplash.com/photo-1629738015509-3224e772439a?auto=format&fit=crop&q=80&w=800", // Colorful pencils/pens
        images: [
            "https://images.unsplash.com/photo-1629738015509-3224e772439a?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Vibrant sketch pens that clip together for easy storage and building fun structures.",
        rating: 4.8,
        reviews: 1500,
    },
    {
        id: 15007,
        name: "Skybags Graphic School Backpack",
        price: 35,
        category: "Kids",
        image: "https://images.unsplash.com/photo-1588058365815-c2368583fb22?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1588058365815-c2368583fb22?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Spacious and stylish backpack with multiple compartments and padded straps.",
        rating: 4.6,
        reviews: 780,
    },

    // --- Kids: Educational & Creative ---
    {
        id: 15008,
        name: "Wooden Calculation Shelf (Abacus)",
        price: 20,
        category: "Kids",
        image: "https://images.unsplash.com/photo-1618423236024-34c9c7457723?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1618423236024-34c9c7457723?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Classic educational tool to help children learn counting and basic math.",
        rating: 4.7,
        reviews: 350,
    },
    {
        id: 15009,
        name: "Play-Doh Super Color Pack",
        price: 18,
        category: "Kids",
        image: "https://images.unsplash.com/photo-1522855734298-b80c3f0b2403?auto=format&fit=crop&q=80&w=800", // Modeling clay concept
        images: [
            "https://images.unsplash.com/photo-1522855734298-b80c3f0b2403?auto=format&fit=crop&q=80&w=800"
        ],
        description: "20 cans of Play-Doh compound for endless creative possibilities.",
        rating: 4.9,
        reviews: 2200,
    },

    // --- Kids: Baby & Safety ---
    {
        id: 15010,
        name: "Fisher-Price Musical Lion Walker",
        price: 45,
        category: "Kids",
        image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=800", // Generic toddler toy area
        images: [
            "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Interactive walker with music and lights to encourage physical development.",
        rating: 4.8,
        reviews: 600,
    },
    {
        id: 15011,
        name: "Kids Multi-Sport Helmet",
        price: 25,
        category: "Kids",
        image: "https://images.unsplash.com/photo-1558282377-52923eb42907?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1558282377-52923eb42907?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Adjustable helmet for cycling, skating, and scooters. Safety first.",
        rating: 4.7,
        reviews: 400,
    },

    // --- Appliances ---
    {
        id: 4001,
        name: "LG Smart Washing Machine",
        price: 699,
        category: "Appliances",
        image: "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&q=80&w=800", // Front
            "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&q=80&w=800", // Laundry room context
            "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&q=80&w=800"  // Detail
        ],
        description: "Large capacity front load washer with AI DD™ technology that detects weight and fabric softness to choose the optimal washing motion.",
        rating: 4.6,
        reviews: 450,
    },
    {
        id: 4002,
        name: "Dyson V15 Detect Vacuum",
        price: 749,
        category: "Appliances",
        image: "https://images.unsplash.com/photo-1558317374-a354d5f6d4da?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1558317374-a354d5f6d4da?auto=format&fit=crop&q=80&w=800", // In use
            "https://images.unsplash.com/photo-1527515673510-813d31923299?auto=format&fit=crop&q=80&w=800", // Product shot
            "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=800"  // Attachments
        ],
        description: "The most powerful, intelligent cordless vacuum. A laser reveals microscopic dust, and it automatically adapts suction power.",
        rating: 4.8,
        reviews: 1500,
    },
    {
        id: 4003,
        name: "Mixer Grinder",
        price: 49,
        category: "Appliances",
        image: "https://images.unsplash.com/photo-1585238341267-1cfb9d3b9069?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1585238341267-1cfb9d3b9069?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1626446702460-7a87163c457e?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Powerful 750W mixer grinder with 3 jars for all your kitchen needs.",
        rating: 4.3,
        reviews: 890,
    },
    {
        id: 601,
        name: "Professional Chef Knife",
        price: 89,
        category: "Kitchen",
        image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1581788724222-a2c6a563697e?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1512485694743-9c936063d133?auto=format&fit=crop&q=80&w=800"
        ],
        description: "High-carbon stainless steel knife for precision cutting.",
        rating: 4.8,
        reviews: 540,
    },
    {
        id: 602,
        name: "Espresso Machine",
        price: 499,
        category: "Kitchen",
        image: "https://images.unsplash.com/photo-1517080319694-8788d752f92f?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1517080319694-8788d752f92f?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1520970014086-2208d157c9e2?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Barista-quality espresso machine for your home kitchen.",
        rating: 4.7,
        reviews: 320,
    },

    // --- Beauty ---
    {
        id: 5001,
        name: "Luxury Skincare Set",
        price: 129,
        category: "Beauty",
        image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800", // Group shot
            "https://images.unsplash.com/photo-1571781926291-280553a36603?auto=format&fit=crop&q=80&w=800", // Texture
            "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=800"  // Application
        ],
        description: "A complete 3-step regimen containing a cleanser, toner, and moisturizer to hydrate and rejuvenate your skin.",
        rating: 4.8,
        reviews: 890,
    },
    {
        id: 5003,
        name: "Dyson Airwrap Multi-Styler",
        price: 599,
        category: "Beauty",
        image: "https://images.unsplash.com/photo-1624913751764-77c8673a216d?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1624913751764-77c8673a216d?auto=format&fit=crop&q=80&w=800", // Product
            "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=800", // Styling
            "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=800"  // Result
        ],
        description: "Style your hair with air, not extreme heat. The Dyson Airwrap™ multi-styler harnesses the Coanda effect to curl, shape, and hide flyaways.",
        rating: 4.9,
        reviews: 3400,
        bestseller: true,
    },

    // --- Sports ---
    {
        id: 6001,
        name: "Adjustable Dumbbell Set",
        price: 199,
        category: "Sports",
        image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800", // Main
            "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&q=80&w=800", // In use
            "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800"  // Gym setting
        ],
        description: "Select-a-Weight adjustable dumbbells allow you to switch from 5 to 52.5 lbs with the turn of a dial.",
        rating: 4.7,
        reviews: 1200,
    },
    {
        id: 6003,
        name: "Men's Performance Running Shoes",
        price: 129,
        category: "Sports Fashion",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800", // Side
            "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800", // Top/Front
            "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=800"  // Action
        ],
        description: "Engineered for speed. These running shoes feature responsive cushioning and a breathable mesh upper for maximum comfort.",
        rating: 4.6,
        reviews: 2100,
    },
    {
        id: 6004,
        name: "Pro Cricket Bat",
        price: 150,
        category: "Sports",
        image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1593341646782-e0b495cffd37?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1535637603896-07c179d71103?auto=format&fit=crop&q=80&w=800"
        ],
        description: "English Willow cricket bat designed for power hitters and professional play.",
        rating: 4.8,
        reviews: 250,
    },

    // --- Furniture & Decor ---
    {
        id: 7001,
        name: "Modern Velvet Sofa",
        price: 799,
        category: "Furniture",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800", // Front
            "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&q=80&w=800", // Side/Room
            "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800"  // Detail
        ],
        description: "A statement piece for any living room. This emerald green velvet sofa features a tufted back and gold-finished legs.",
        rating: 4.8,
        reviews: 124,
    },
    {
        id: 501,
        name: "Ceramic Vase Set",
        price: 49,
        category: "Decor",
        image: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Handcrafted ceramic vases in earth tones.",
        rating: 4.7,
        reviews: 150,
    },
    {
        id: 502,
        name: "Abstract Wall Art",
        price: 89,
        category: "Decor",
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1549813069-f95e44d7f498?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Large abstract canvas print to add color to your space.",
        rating: 4.4,
        reviews: 85,
    },
    {
        id: 503,
        name: "Soft Area Rug",
        price: 199,
        category: "Decor",
        image: "https://images.unsplash.com/photo-1575414723300-0d0fb6c60242?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1575414723300-0d0fb6c60242?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1534889156217-d643df14f14a?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Plush area rug in neutral grey, soft underfoot.",
        rating: 4.5,
        reviews: 210,
    },
];

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

    // --- Electronics: Audio & Accessories ---
    {
        id: 101,
        name: "Wireless Noise Cancelling Headphones",
        price: 299,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Premium sound quality with active noise cancellation and 30-hour battery life.",
        rating: 4.9,
        reviews: 2056,
        bestseller: true,
    },
    {
        id: 102,
        name: "Smart Watch Series 7",
        price: 399,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Advanced health monitoring, fitness tracking, and seamless connectivity.",
        rating: 4.7,
        reviews: 850,
    },
    {
        id: 103,
        name: "4K Ultra HD Smart TV",
        price: 699,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1577979749830-f1d742b96791?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Cinematic experience with vibrant colors and smart home integration.",
        rating: 4.6,
        reviews: 432,
    },
    {
        id: 104,
        name: "Professional Camera Kit",
        price: 1299,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=800"
        ],
        description: "DSLR camera with versatile lens kit for professional photography.",
        rating: 4.8,
        reviews: 120,
    },
    {
        id: 105,
        name: "Portable Bluetooth Speaker",
        price: 59,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1543512214-318c77a07298?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Compact and powerful bluetooth speaker with waterproof design and deep bass.",
        rating: 4.5,
        reviews: 1500,
    },

    // --- Fashion ---
    {
        id: 201,
        name: "Classic Denim Jacket",
        price: 89,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Timeless denim jacket with a comfortable fit and durable fabric.",
        rating: 4.5,
        reviews: 340,
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

    // --- Kids ---
    {
        id: 401,
        name: "Educational Building Blocks",
        price: 39,
        category: "Kids",
        image: "https://images.unsplash.com/photo-1587654780291-39c940483713?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1587654780291-39c940483713?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Colorful building blocks to spark creativity and motor skills.",
        rating: 4.8,
        reviews: 450,
        bestseller: true,
    },
    {
        id: 402,
        name: "Plush Teddy Bear",
        price: 25,
        category: "Kids",
        image: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1555445054-8488d0a67692?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1585155770447-2f66e2a397b5?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Soft and cuddly teddy bear, the perfect companion for kids.",
        rating: 4.9,
        reviews: 1200,
    },
    {
        id: 403,
        name: "Remote Control Car",
        price: 49,
        category: "Kids",
        image: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1536421469767-80559bb6f5e1?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1508896694512-1eade558679c?auto=format&fit=crop&q=80&w=800"
        ],
        description: "High-speed remote control car with durable tires.",
        rating: 4.5,
        reviews: 310,
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

import { useState, useMemo } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import StoreNavbar from "@/components/StoreNavbar";
import ProductCard from "@/components/ProductCard";
import CartSidebar from "@/components/CartSidebar";
import { products } from "@/data/products";
import { Filter, ChevronDown } from "lucide-react";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by search query
    if (searchQuery) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    return result;
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>SmartBuy | Online Shopping Site for Mobiles, Electronics, Furniture, Grocery, Lifestyle, Books & More. Best Offers!</title>
        <meta name="description" content="Shop online for mobiles, electronics, furniture, grocery, lifestyle, books & more. Best Offers!" />
      </Head>

      <StoreNavbar onSearch={setSearchQuery} />
      <CartSidebar />

      <main>
        {/* Hero Section - Amazon Style Slider (Static for now) */}
        <section className="relative bg-gray-900 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-40">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-2xl"
            >
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
                Big Savings on<br />
                <span className="text-yellow-400">Top Brands</span>
              </h1>
              <p className="text-xl text-gray-200 mb-8">
                Free delivery on your first order.
              </p>
              <button className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-md font-bold hover:bg-yellow-500 transition-colors shadow-lg">
                Start Shopping
              </button>
            </motion.div>
          </div>
          {/* Gradient overlay at bottom to blend with content */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent"></div>
        </section>

        {/* Filters & Sort */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sticky top-16 z-20 bg-gray-50/95 backdrop-blur-sm border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 sm:pb-0 no-scrollbar">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === category
                    ? "bg-gray-900 text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-6">
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-100 mt-6">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-500 text-lg mb-6">Try adjusting your search or filters to find what you're looking for.</p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

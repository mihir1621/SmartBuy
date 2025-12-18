import { useState } from "react";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import StoreNavbar from "@/components/StoreNavbar";
import ProductCard from "@/components/ProductCard";
import CartSidebar from "@/components/CartSidebar";
import FilterSidebar from "@/components/FilterSidebar";
import { products } from "@/data/products";
import { useProductSystem } from "@/hooks/useProductSystem";
import { Filter, SlidersHorizontal, ChevronDown } from "lucide-react";

export default function Home() {
  // Initialize the Advanced Product System
  const {
    products: filteredProducts,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedBrands,
    setSelectedBrands,
    priceRange,
    setPriceRange,
    selectedGender,
    setSelectedGender,
    minRating,
    setMinRating,
    sortOption,
    setSortOption,
    availableBrands,
    globalMaxPrice
  } = useProductSystem(products);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Categories list for the top pill navigation
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>SmartBuy | Premium Online Shopping</title>
        <meta name="description" content="Shop the best brands in Fashion, Electronics, Home & More." />
      </Head>

      {/* Navbar propagates search query updates to our system */}
      <StoreNavbar onSearch={setSearchQuery} />
      <CartSidebar />

      <main>
        {/* Hero Section */}
        <section className="relative bg-gray-900 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-40">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-2xl"
            >
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
                Big Savings on<br />
                <span className="text-yellow-400">Top Brands</span>
              </h1>
              <p className="text-lg text-gray-200 mb-6">
                Free delivery on your first order.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Category Pills (Top Level Filter) */}
        <section className="sticky top-16 z-20 bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === category
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block lg:col-span-1 sticky top-32 h-fit">
              <FilterSidebar
                selectedCategory={selectedCategory}
                brands={availableBrands}
                selectedBrands={selectedBrands}
                setSelectedBrands={setSelectedBrands}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                globalMaxPrice={globalMaxPrice}
                selectedGender={selectedGender}
                setSelectedGender={setSelectedGender}
                minRating={minRating}
                setMinRating={setMinRating}
                clearAll={() => {
                  setSelectedBrands([]);
                  setPriceRange([0, globalMaxPrice]);
                  setSelectedGender("All");
                  setMinRating(0);
                  setSelectedCategory("All");
                }}
              />
            </aside>

            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4 flex justify-between items-center">
              <button
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium shadow-sm"
              >
                <Filter className="w-4 h-4" /> Filters
              </button>
              <span className="text-sm text-gray-500">
                {filteredProducts.length} Results
              </span>
            </div>

            {/* Mobile Filter Dropdown */}
            <AnimatePresence>
              {isMobileFilterOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="lg:hidden overflow-hidden mb-6 bg-white rounded-xl border border-gray-100 p-4"
                >
                  <FilterSidebar
                    selectedCategory={selectedCategory}
                    brands={availableBrands}
                    selectedBrands={selectedBrands}
                    setSelectedBrands={setSelectedBrands}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    globalMaxPrice={globalMaxPrice}
                    selectedGender={selectedGender}
                    setSelectedGender={setSelectedGender}
                    minRating={minRating}
                    setMinRating={setMinRating}
                    clearAll={() => {
                      setSelectedBrands([]);
                      setPriceRange([0, globalMaxPrice]);
                      setSelectedGender("All");
                      setMinRating(0);
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Product Grid Area */}
            <div className="lg:col-span-3">
              {/* Sorting Bar */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedCategory === "All" ? (searchQuery ? `Results for "${searchQuery}"` : "All Products") : selectedCategory}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 hidden sm:inline">Sort by:</span>
                  <div className="relative">
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-8 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="popularity">Popularity</option>
                      <option value="newest">Newest First</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="rating">Rating</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Grid */}
              {filteredProducts.length > 0 ? (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-500 text-lg mb-6">Try adjusting your filters or search terms.</p>
                  <button
                    onClick={() => {
                      setSelectedCategory("All");
                      setSearchQuery("");
                      setSelectedBrands([]);
                      setPriceRange([0, globalMaxPrice]);
                      setSelectedGender("All");
                    }}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

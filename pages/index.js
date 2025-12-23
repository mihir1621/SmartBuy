import { useState, useEffect } from "react";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import StoreNavbar from "@/components/StoreNavbar";
import ProductCard from "@/components/ProductCard";
import CartSidebar from "@/components/CartSidebar";
import FilterSidebar from "@/components/FilterSidebar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import { products } from "@/data/products";
import { useProductSystem } from "@/hooks/useProductSystem";
import { Filter, SlidersHorizontal, ChevronDown } from "lucide-react";
import BannerCarousel from "@/components/BannerCarousel";

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
    availableGenders,
    globalMaxPrice
  } = useProductSystem(products);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const router = useRouter();

  // Categories list for the top pill navigation
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  // Sync category with URL query
  useEffect(() => {
    if (router.query.category) {
      setSelectedCategory(router.query.category);
    } else {
      setSelectedCategory("All");
    }
  }, [router.query.category, setSelectedCategory]);

  // Group filtered products by category
  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const cat = product.category;
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(product);
    return acc;
  }, {});

  const displayedCategories = Object.keys(groupedProducts).sort(); // Optional: Sort categories alphabetically


  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>SmartBuy | Premium Online Shopping</title>
        <meta name="description" content="Shop the best brands in Fashion, Electronics, Home & More." />
      </Head>

      {/* Navbar propagates search and filter updates to our system */}
      <StoreNavbar
        onSearch={setSearchQuery}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <CartSidebar />

      {/* Promotional Banner Carousel */}
      <BannerCarousel />

      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Desktop Sidebar */}
            {(searchQuery || selectedCategory !== "All") && (
              <aside className="hidden lg:block lg:col-span-1 sticky top-32 h-fit">
                <FilterSidebar
                  selectedCategory={selectedCategory}
                  brands={availableBrands}
                  availableGenders={availableGenders}
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
            )}

            {/* Mobile Filter Toggle */}
            {(searchQuery || selectedCategory !== "All") && (
              <div className="lg:hidden mb-4 flex justify-between items-center">
                <button
                  onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                  className="flex items-center gap-2 bg-gray-900 border border-gray-800 px-4 py-2 rounded-lg text-sm font-medium shadow-sm text-gray-200"
                >
                  <Filter className="w-4 h-4" /> Filters
                </button>
                <span className="text-sm text-gray-400">
                  {filteredProducts.length} Results
                </span>
              </div>
            )}

            {/* Mobile Filter Dropdown */}
            <AnimatePresence>
              {(searchQuery || selectedCategory !== "All") && isMobileFilterOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="lg:hidden overflow-hidden mb-6 bg-gray-900 rounded-xl border border-gray-800 p-4"
                >
                  <FilterSidebar
                    selectedCategory={selectedCategory}
                    brands={availableBrands}
                    availableGenders={availableGenders}
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
            <div className={(searchQuery || selectedCategory !== "All") ? "lg:col-span-3" : "lg:col-span-4"}>
              {/* Sorting Bar */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">
                  {selectedCategory === "All" ? (searchQuery ? `Results for "${searchQuery}"` : "All Products") : selectedCategory}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400 hidden sm:inline">Sort by:</span>
                  <div className="relative">
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="appearance-none bg-gray-900 border border-gray-800 text-gray-300 py-2 pl-4 pr-8 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
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
                <div className="space-y-12">
                  {displayedCategories.map((category) => (
                    <section key={category} className="space-y-4">
                      <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-white relative">
                          {category}
                          <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-blue-500 rounded-full"></span>
                        </h2>
                        <div className="h-px bg-gray-800 flex-grow mt-1"></div>
                      </div>

                      <motion.div
                        layout
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                      >
                        {groupedProducts[category].map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </motion.div>
                    </section>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-gray-900 rounded-xl border border-gray-800">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
                  <p className="text-gray-400 text-lg mb-6">Try adjusting your filters or search terms.</p>
                  <button
                    onClick={() => {
                      setSelectedCategory("All");
                      setSearchQuery("");
                      setSelectedBrands([]);
                      setPriceRange([0, globalMaxPrice]);
                      setSelectedGender("All");
                    }}
                    className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 font-medium transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

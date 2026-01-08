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
import { products as staticProducts } from "@/data/products";
import { useProductSystem } from "@/hooks/useProductSystem";
import { Filter, SlidersHorizontal, ChevronDown, X } from "lucide-react";
import BannerCarousel from "@/components/BannerCarousel";
import { prisma } from "@/lib/prisma";

export async function getServerSideProps() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const serializedProducts = JSON.parse(JSON.stringify(products)).map(p => ({
      ...p,
      description: p.description ? (p.description.length > 150 ? p.description.substring(0, 150) + '...' : p.description) : ''
    }));

    return {
      props: {
        initialProducts: serializedProducts,
      },
    };
  } catch (error) {
    console.error("Database error:", error);
    return {
      props: {
        initialProducts: staticProducts.map(p => ({
          ...p,
          description: p.description ? (p.description.length > 150 ? p.description.substring(0, 150) + '...' : p.description) : ''
        })),
      },
    };
  }
}

export default function Home({ initialProducts }) {
  const productsToUse = initialProducts || staticProducts;
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
  } = useProductSystem(productsToUse);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const router = useRouter();

  // Categories list for the top pill navigation
  const categories = ["All", ...new Set(productsToUse.map((p) => p.category))];

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
            {/* Desktop Sidebar - Always show on product listing */}
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
                sortOption={sortOption}
                setSortOption={setSortOption}
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
                className="flex items-center gap-2 bg-gray-900 border border-gray-800 px-4 py-2 rounded-lg text-sm font-medium shadow-sm text-gray-200"
              >
                <Filter className="w-4 h-4" /> Filters
              </button>
              <span className="text-sm text-gray-400">
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
                    sortOption={sortOption}
                    setSortOption={setSortOption}
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
              <div className="flex justify-between items-center mb-6 gap-4">
                <h2 className="text-lg sm:text-xl font-bold text-white truncate">
                  {selectedCategory === "All" ? (searchQuery ? `Results for "${searchQuery}"` : "All Products") : selectedCategory}
                </h2>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-sm text-gray-400 hidden sm:inline">Sort by:</span>
                  <div className="relative">
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="appearance-none bg-gray-900 border border-gray-800 text-gray-300 py-1.5 sm:py-2 pl-3 sm:pl-4 pr-7 sm:pr-8 rounded-lg text-xs sm:text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="popularity">Popularity</option>
                      <option value="newest">Newest Arrivals</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="rating">Rating</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Active Filter Chips */}
              {(selectedCategory !== "All" || selectedBrands.length > 0 || minRating > 0 || selectedGender !== "All") && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6">
                  {selectedCategory !== "All" && (
                    <button onClick={() => setSelectedCategory("All")} className="flex items-center gap-1.5 sm:gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2.5 sm:px-3 py-1 sm:1.5 rounded-full text-[10px] sm:text-xs font-bold hover:bg-blue-500/20 transition-all">
                      {selectedCategory} <X size={10} className="sm:size-[12px]" />
                    </button>
                  )}
                  {selectedGender !== "All" && (
                    <button onClick={() => setSelectedGender("All")} className="flex items-center gap-1.5 sm:gap-2 bg-gray-800 border border-gray-700 text-gray-300 px-2.5 sm:px-3 py-1 sm:1.5 rounded-full text-[10px] sm:text-xs font-bold hover:bg-gray-700 transition-all">
                      {selectedGender} <X size={10} className="sm:size-[12px]" />
                    </button>
                  )}
                  {selectedBrands.map(brand => (
                    <button key={brand} onClick={() => setSelectedBrands(selectedBrands.filter(b => b !== brand))} className="flex items-center gap-1.5 sm:gap-2 bg-gray-800 border border-gray-700 text-gray-300 px-2.5 sm:px-3 py-1 sm:1.5 rounded-full text-[10px] sm:text-xs font-bold hover:bg-gray-700 transition-all">
                      {brand} <X size={10} className="sm:size-[12px]" />
                    </button>
                  ))}
                  {minRating > 0 && (
                    <button onClick={() => setMinRating(0)} className="flex items-center gap-1.5 sm:gap-2 bg-yellow-400/10 border border-yellow-400/20 text-yellow-500 px-2.5 sm:px-3 py-1 sm:1.5 rounded-full text-[10px] sm:text-xs font-bold hover:bg-yellow-400/20 transition-all">
                      {minRating}+ Stars <X size={10} className="sm:size-[12px]" />
                    </button>
                  )}
                </div>
              )}

              {/* Grid */}
              {filteredProducts.length > 0 ? (
                <div className="space-y-8 sm:space-y-12">
                  {displayedCategories.map((category) => (
                    <section key={category} className="space-y-3 sm:space-y-4">
                      <div className="flex items-center gap-2 sm:gap-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-white relative whitespace-nowrap">
                          {category}
                          <span className="absolute -bottom-1.5 sm:-bottom-2 left-0 w-1/3 h-0.5 sm:h-1 bg-blue-500 rounded-full"></span>
                        </h2>
                        <div className="h-px bg-gray-800 flex-grow mt-1 sm:mt-1"></div>
                      </div>

                      <motion.div
                        layout
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4"
                      >
                        {groupedProducts[category].map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </motion.div>
                    </section>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 sm:py-20 bg-gray-900 rounded-xl border border-gray-800 px-4">
                  <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🔍</div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">No results found</h3>
                  <p className="text-gray-400 text-base sm:text-lg mb-4 sm:mb-6">Try adjusting your filters or search terms.</p>
                  <button
                    onClick={() => {
                      setSelectedCategory("All");
                      setSearchQuery("");
                      setSelectedBrands([]);
                      setPriceRange([0, globalMaxPrice]);
                      setSelectedGender("All");
                    }}
                    className="px-5 sm:px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 font-medium transition-colors text-sm sm:text-base"
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

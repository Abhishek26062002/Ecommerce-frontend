import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, X } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { api } from "../utils/api";

const ProductCardSkeleton = () => (
  <div className="bg-white rounded-lg overflow-hidden shadow-md animate-pulse">
    <div className="w-full h-48 sm:h-56 bg-gray-300 rounded-t-lg"></div>
    <div className="p-3 sm:p-4 space-y-3">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="h-10 bg-gray-300 rounded-lg mt-4"></div>
    </div>
  </div>
);

const CategorySetSkeleton = () => (
  <div className="w-full py-4 rounded-xl border border-gray-300 bg-gray-100 animate-pulse h-20"></div>
);

const Products = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [subCategoryLoading, setSubCategoryLoading] = useState(false);
  const [categoryToFetch, setCategoryToFetch] = useState(null);

  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

useEffect(() => {
  const categoryFromUrl = searchParams.get("category");
  if (!products.length || !categoryFromUrl) return;

  handleCategoryChange(categoryFromUrl);
}, [searchParams, products]);




  const categories = [
    "all",
    "Blouse",
    "Butes",
    "Saree Borders",
    "Kurthi Designs",
    "Kids Designs",
    "Logos",
    "Photo Embroidery",
    "Beads & Sequins",
  ];

  // Helper: sorting only (no category filtering)
  const applySort = (list, sortKey = sortBy) => {
    const sorted = [...list];

    switch (sortKey) {
      case "price-low":
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        break;
    }

    return sorted;
  };

  // Fetch ALL products once
  const fetchProducts = async () => {
    try {
      const data = await api.fetchProductsInfiniteScroll(50, 0);
      const allProducts = data.products || [];
      setProducts(allProducts);
      setFilteredProducts(applySort(allProducts, "newest"));
      setOffset(50);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreProducts = async () => {
    if (!hasMore || loadingMore) return;
    
    setLoadingMore(true);
    try {
      const data = await api.fetchProductsInfiniteScroll(50, offset);
      const newProducts = data.products || [];
      setProducts((prev) => [...prev, ...newProducts]);
      setFilteredProducts((prev) => [...prev, ...newProducts]);
      setOffset((prev) => prev + 50);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error("Error fetching more products:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle search from URL (?search=...)
  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (!products.length) return;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matched = products.filter(
        (product) =>
          product.name?.toLowerCase().includes(q) ||
          product.category?.toLowerCase().includes(q)
      );

      // When searching, ignore category/subcategory mode
      setSelectedCategory("all");
      setSelectedSubCategory(null);
      setSubCategories([]);
      setFilteredProducts(applySort(matched));
    } else {
      // No search → if no category/subcategory selected, show all products
      if (selectedCategory === "all" && !selectedSubCategory) {
        setFilteredProducts(applySort(products));
      }
      // If category/subcategory is active, we keep whatever handlers already set
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, products]);

  // Re-apply sort when sortBy changes
  useEffect(() => {
    setFilteredProducts((prev) => applySort(prev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  useEffect(() => {
    if (!categoryToFetch) return;
    
    if (categoryToFetch === "all") {
      setFilteredProducts(applySort(products, sortBy));
      setLoadingSubCategories(false);
      setCategoryToFetch(null);
      return;
    }

    const fetchSubs = async () => {
      console.log('>>> useEffect: Fetching subcategories for:', categoryToFetch);
      try {
        const response = await api.fetchSubCategories(categoryToFetch);
        console.log('>>> useEffect: Raw API Response:', response);
        
        let subs = [];
        if (Array.isArray(response)) {
          subs = response;
        } else if (response?.data && Array.isArray(response.data)) {
          subs = response.data;
        } else if (response?.sub_category_names && Array.isArray(response.sub_category_names)) {
          subs = response.sub_category_names;
        }
        
        console.log('>>> useEffect: Parsed subcategories:', subs);
        setSubCategories(subs);
      } catch (error) {
        console.error('>>> useEffect: Error:', error);
        setSubCategories([]);
      } finally {
        setLoadingSubCategories(false);
      }
    };

    fetchSubs();
    setCategoryToFetch(null);
  }, [categoryToFetch, products, sortBy]);

  const handleCategoryChange = (category) => {
    console.log('>>> CATEGORY CLICKED:', category);
    setSelectedCategory(category);
    setSelectedSubCategory(null);
    setFilteredProducts([]);
    setLoadingSubCategories(true);
    setCategoryToFetch(category);
  };

  // SUBCATEGORY CLICK
  const handleSubCategoryChange = useCallback(async (sub, category) => {
    console.log('=== START SUBCATEGORY CHANGE ===');
    console.log('sub:', sub);
    console.log('category:', category);
    
    setSelectedSubCategory(sub);
    console.log('setSelectedSubCategory called with:', sub);
    
    setSubCategoryLoading(true);
    console.log('setSubCategoryLoading set to TRUE');
    
    setFilteredProducts([]);
    console.log('setFilteredProducts cleared');

    try {
      console.log('Calling API...');
      const response = await api.fetchProductsBySubCategory(category, sub);
      console.log('API Response received:', response);
      console.log('Response type:', typeof response);
      console.log('Is array?', Array.isArray(response));
      
      let prods = [];
      if (Array.isArray(response)) {
        console.log('Response is array, using directly');
        prods = response;
      } else if (response?.data && Array.isArray(response.data)) {
        console.log('Response.data is array, using that');
        prods = response.data;
      } else if (response?.products && Array.isArray(response.products)) {
        console.log('Response.products is array, using that');
        prods = response.products;
      } else {
        console.log('Response format unknown. Full response:', JSON.stringify(response, null, 2));
        prods = [];
      }
      
      console.log('Final prods count:', prods.length);
      console.log('Final prods:', prods);
      
      console.log('Waiting 800ms before updating state...');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log('Calling setFilteredProducts with:', prods);
      setFilteredProducts(applySort(prods, sortBy));
      console.log('setFilteredProducts called');
    } catch (error) {
      console.error('ERROR in handleSubCategoryChange:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      setFilteredProducts([]);
    } finally {
      console.log('Setting subCategoryLoading to FALSE');
      setSubCategoryLoading(false);
      console.log('=== END SUBCATEGORY CHANGE ===');
    }

    if (window.innerWidth < 768) {
      setTimeout(() => setShowFilters(false), 100);
    }
  }, [sortBy]);

  const handleSortChange = (value) => {
    setSortBy(value);
    if (window.innerWidth < 768) {
      setTimeout(() => setShowFilters(false), 100);
    }
  };



  const isShowingSubCategorySelection =
    selectedCategory !== "all" &&
    !selectedSubCategory &&
    subCategories.length > 0;

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "100px",
      threshold: 0.1
    };

    const observerCallback = (entries) => {
      if (entries[0].isIntersecting && hasMore && !loadingMore && !subCategoryLoading) {
        // fetchMoreProducts();
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sentinel = document.getElementById("infinite-scroll-sentinel");
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [hasMore, loadingMore, subCategoryLoading]);

  console.log('>>> RENDER STATE:', {
    loading,
    loadingSubCategories,
    subCategoryLoading,
    loadingProducts,
    isShowingSubCategorySelection,
    selectedCategory,
    selectedSubCategory,
    subCategoriesLength: subCategories.length,
    filteredProductsLength: filteredProducts.length
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{selectedCategory}</h1>

          <button
            onClick={() => setShowFilters(true)}
            className="md:hidden flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-md active:scale-95 transition-transform"
          >
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filters</span>
          </button>
        </div>

        {/* Mobile Category Navigation */}
        <div className="md:hidden mb-6 -mx-4 px-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                disabled={loadingSubCategories}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all shrink-0 ${
                  selectedCategory === category
                    ? "bg-red-600 text-white border-2 border-red-600"
                    : "bg-white text-gray-900 border-2 border-gray-900"
                } ${loadingSubCategories ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {category === "all" ? "All" : category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="hidden md:block w-full md:w-64 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-300">
              <h3 className="font-semibold text-gray-800 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    disabled={loadingSubCategories}
                    className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === category
                        ? "bg-red-600 text-white"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    } ${loadingSubCategories ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {category === "all" ? "All Products" : category}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-300">
              <h3 className="font-semibold text-gray-800 mb-4">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </aside>

          <div
            className={`md:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
              showFilters
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setShowFilters(false)}
            />

            <div
              className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50
                max-h-[80vh] overflow-y-auto shadow-2xl transition-transform duration-300 ${
                  showFilters ? "translate-y-0" : "translate-y-full"
                }`}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              <div className="p-4 space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 text-sm">
                    Categories
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        disabled={loadingSubCategories}
                        className={`px-3 py-2 rounded-lg text-sm font-medium ${
                          selectedCategory === category
                            ? "bg-red-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 active:bg-gray-200"
                        } ${loadingSubCategories ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {category === "all" ? "All" : category}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 text-sm">
                    Sort By
                  </h3>
                  <div className="space-y-2">
                    {[
                      { value: "newest", label: "Newest First" },
                      { value: "price-low", label: "Price: Low to High" },
                      { value: "price-high", label: "Price: High to Low" },
                      { value: "name", label: "Name: A to Z" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleSortChange(option.value)}
                        className={`block w-full text-left px-4 py-3 rounded-lg text-sm ${
                          sortBy === option.value
                            ? "bg-red-600 text-white"
                            : "bg-gray-100 text-gray-700 active:bg-gray-200"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-medium active:scale-95 transition-transform"
                >
                  View {filteredProducts.length} Products
                </button>
              </div>
            </div>
          </div>

          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {[...Array(6)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : subCategoryLoading ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {[...Array(6)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : isShowingSubCategorySelection ? (
              <>
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <button
                      onClick={() => {
                        setSelectedCategory("all");
                        setSelectedSubCategory(null);
                        setSubCategories([]);
                        setFilteredProducts(applySort(products));
                      }}
                      className="text-red-600 hover:underline"
                    >
                      All
                    </button>
                    <span>/</span>
                    <span className="font-semibold text-gray-900">
                      {selectedCategory}
                    </span>
                  </div>
                  <div className="border-b border-gray-300 mt-2"></div>
                </div>

                <p className="text-gray-600 mb-4">
                  Choose a subcategory in{" "}
                  <span className="font-semibold">{selectedCategory}</span>
                </p>
                {loadingSubCategories ? (
                  <div className="flex flex-col gap-3">
                    {[...Array(4)].map((_, i) => (
                      <CategorySetSkeleton key={i} />
                    ))}
                  </div>
                ) : subCategories.length === 0 ? (
                  <div className="bg-white p-12 rounded-lg shadow-md text-center">
                    <p className="text-gray-500 text-lg">No categories found</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {subCategories.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => handleSubCategoryChange(sub, selectedCategory)}
                        className={`w-full py-4 rounded-xl border text-xl lg:text-4xl font-semibold tracking-wide text-center text-red-600 transition-all ${
                          selectedSubCategory === sub
                            ? "bg-red-600 text-white border-red-600 shadow-md scale-[1.02]"
                            : "bg-white text-gray-900 border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        {selectedCategory} - OSA - {sub.toUpperCase()}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : selectedSubCategory && !subCategoryLoading && filteredProducts.length === 0 ? (
              <div className="bg-white p-12 rounded-lg shadow-md text-center">
                <p className="text-gray-500 text-lg">No products found</p>
              </div>
            ) : (
              <>
                {(selectedCategory !== "all" || selectedSubCategory) && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <button
                        onClick={() => {
                          setSelectedCategory("all");
                          setSelectedSubCategory(null);
                          setSubCategories([]);
                          setFilteredProducts(applySort(products));
                        }}
                        className="text-red-600 hover:underline"
                      >
                        All
                      </button>

                      {selectedCategory !== "all" && (
                        <>
                          <span>/</span>
                          <button
                            onClick={() => {
                              setSelectedSubCategory(null);
                              setSubCategories([]);
                              handleCategoryChange(selectedCategory);
                            }}
                            className="text-red-600 hover:underline"
                          >
                            {selectedCategory}
                          </button>
                        </>
                      )}

                      {selectedSubCategory && (
                        <>
                          <span>/</span>
                          <span className="font-semibold text-gray-900">
                            {selectedSubCategory}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="border-b border-gray-300 mt-2"></div>
                  </div>
                )}

                <p className="text-gray-600 mb-6">
                  Showing {filteredProducts.length} product
                  {filteredProducts.length !== 1 ? "s" : ""}
                  {selectedCategory !== "all" && selectedSubCategory && (
                    <>
                      {" "}
                      in{" "}
                      <span className="font-semibold">
                        {selectedCategory} / {selectedSubCategory}
                      </span>
                    </>
                  )}
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {loadingMore && (
                  <div className="flex justify-center mt-8">
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 w-full">
                      {[...Array(6)].map((_, i) => (
                        <ProductCardSkeleton key={i} />
                      ))}
                    </div>
                  </div>
                )}

                {hasMore && !loadingMore && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={fetchMoreProducts}
                      className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors active:scale-95"
                    >
                      Load More Products
                    </button>
                  </div>
                )}

                {!hasMore && filteredProducts.length > 0 && (
                  <div className="text-center mt-8 py-6">
                    <p className="text-gray-500 text-lg">All products loaded</p>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;

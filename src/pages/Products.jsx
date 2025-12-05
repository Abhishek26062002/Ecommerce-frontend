import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, X } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { api } from "../utils/api";

const Products = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);

  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

useEffect(() => {
  const categoryFromUrl = searchParams.get("category");
  if (!products.length || !categoryFromUrl) return;

  handleCategoryChange(categoryFromUrl); // <-- fetch subcategories
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
        // If you have createdAt, you can sort by it
        // sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return sorted;
  };

  // Fetch ALL products once
  const fetchProducts = async () => {
    try {
      const data = await api.fetchProducts();
      const all = data || [];
      setProducts(all);
      setFilteredProducts(applySort(all, "newest"));
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
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

  // CATEGORY CLICK
  const handleCategoryChange = async (category) => {
    setSelectedCategory(category);
    setSelectedSubCategory(null);
    setSubCategories([]);
    setFilteredProducts([]); // hide products until we know what to show

    if (category === "all") {
      // Just show all products again
      setFilteredProducts(applySort(products, sortBy));
      return;
    }

    try {
      const data = await api.fetchSubCategories(category);
      setSubCategories(data || []); // show subcategories INSTEAD of products
    } catch (err) {
      console.log(err);
      setSubCategories([]);
    }
  };

  // SUBCATEGORY CLICK
  const handleSubCategoryChange = async (sub) => {
    setSelectedSubCategory(sub);

    try {
      const data = await api.fetchProductsBySubCategory(selectedCategory, sub);
      setFilteredProducts(applySort(data || [], sortBy));
      // Optional: hide subcategories after selection
      // setSubCategories([]);
    } catch (err) {
      console.log(err);
      setFilteredProducts([]);
    }

    if (window.innerWidth < 768) {
      setTimeout(() => setShowFilters(false), 100);
    }
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    if (window.innerWidth < 768) {
      setTimeout(() => setShowFilters(false), 100);
    }
  };



  const isShowingSubCategorySelection =
    subCategories.length > 0 &&
    selectedCategory !== "all" &&
    !selectedSubCategory;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{selectedCategory}</h1>

          {/* Mobile filter button */}
          <button
            onClick={() => setShowFilters(true)}
            className="md:hidden flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-md active:scale-95 transition-transform"
          >
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filters</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-full md:w-64 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-300">
              <h3 className="font-semibold text-gray-800 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === category
                        ? "bg-red-600 text-white"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
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

          {/* Mobile Filter Drawer */}
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
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* Filter content */}
              <div className="p-4 space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 text-sm">
                    Categories
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium ${
                          selectedCategory === category
                            ? "bg-red-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 active:bg-gray-200"
                        }`}
                      >
                        {category === "all" ? "All" : category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort By */}
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

              {/* Apply Button */}
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

          {/* MAIN CONTENT */}
          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                loading.....
              </div>
            ) : isShowingSubCategorySelection ? (
              <>
                <p className="text-gray-600 mb-4">
                  Choose a subcategory in{" "}
                  <span className="font-semibold">{selectedCategory}</span>
                </p>
                <div className="flex flex-col gap-3">
  {subCategories.map((sub) => (
    <button
      key={sub}
      onClick={() => handleSubCategoryChange(sub)}
      className={`w-full py-4 rounded-xl border text-xl lg:text-4xl font-semibold tracking-wide text-center text-red-600 transition-all ${
        selectedSubCategory === sub
          ? "bg-red-600 text-white border-red-600 shadow-md scale-[1.02]"
          : "bg-white text-gray-900 border-gray-300 hover:bg-gray-100"
      }`}
    >
     {selectedCategory} - {sub.toUpperCase()}
    </button>
  ))}
</div>

              </>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white p-12 rounded-lg shadow-md text-center">
                <p className="text-gray-500 text-lg">No products found</p>
              </div>
            ) : (
              <>
                {/* Breadcrumbs with bottom line */}
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

                    {/* Bottom line */}
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
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;

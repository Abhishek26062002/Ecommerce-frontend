import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { api } from '../utils/api';

<<<<<<< HEAD
const ProductCardSkeleton = () => (
  <div className="bg-white rounded-lg overflow-hidden shadow-md animate-pulse">
    <div className="w-full h-48 sm:h-56 bg-gray-300 rounded-t-lg"></div>
    <div className="p-3 sm:p-4 space-y-3">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="space-y-2 flex gap-2">
        <div className="h-4 bg-gray-300 rounded w-12"></div>
        <div className="h-4 bg-gray-300 rounded w-12"></div>
      </div>
    </div>
  </div>
);

=======
>>>>>>> 90c42162987c4e3cea6a537cf47863f0739dc0df
const Home = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [topSellers, setTopSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { name: 'Blouse Designs', slug: 'Blouse', icon: '👗' },
    { name: 'Saree Borders', slug: 'Butes', icon: '🎨' },
    { name: 'Kurthi Designs', slug: 'kurthi', icon: '👘' },
    { name: 'Kids Designs', slug: 'kids', icon: '👶' },
    { name: 'Logos', slug: 'logos', icon: '🏷️' },
    { name: 'Photo Embroidery', slug: 'photo', icon: '📸' },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
<<<<<<< HEAD
      const latestProducts = await api.fetchLatestProducts();
      setNewArrivals(Array.isArray(latestProducts) ? latestProducts.slice(0, 4) : []);

      console.log('Latest Products:', latestProducts);
      setTopSellers(Array.isArray(latestProducts) ? latestProducts.slice(0, 4) : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setNewArrivals([]);
      setTopSellers([]);
=======
      const response = await productsAPI.getAll();
      const products = response.data || mockProducts;

      setNewArrivals(products.slice(0, 4));
      setTopSellers(products.slice(4, 8));
    } catch (error) {
      console.error('Error fetching products:', error);
      setNewArrivals(mockProducts.slice(0, 4));
      setTopSellers(mockProducts.slice(4, 8));
>>>>>>> 90c42162987c4e3cea6a537cf47863f0739dc0df
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-red-900 via-red-800 to-red-900 text-white overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-96 h-96 bg-amber-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-amber-300 rounded-full blur-3xl"></div>
        </div>
        
        {/* Golden Flora Animated Overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <div
  className="absolute inset-0 opacity-5"
  style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='5' cy='5' r='1'/%3E%3Ccircle cx='25' cy='5' r='1'/%3E%3Ccircle cx='45' cy='5' r='1'/%3E%3Ccircle cx='5' cy='25' r='1'/%3E%3Ccircle cx='25' cy='25' r='1'/%3E%3Ccircle cx='45' cy='25' r='1'/%3E%3Ccircle cx='5' cy='45' r='1'/%3E%3Ccircle cx='25' cy='45' r='1'/%3E%3Ccircle cx='45' cy='45' r='1'/%3E%3C/g%3E%3C/svg%3E")`
  }}
></div>

          {/* Golden Flora Elements */}
          {/* <div className="absolute top-10 left-5 w-32 h-32 bg-linear-to-br from-amber-300/20 to-amber-500/10 rounded-full blur-sm animate-float-slow"></div> */}
          <div className="absolute top-20 right-10 w-24 h-24 bg-linear-to-br from-amber-200/25 to-amber-400/15 rounded-full blur-sm animate-float-medium"></div>
          {/* <div className="absolute bottom-15 left-15 w-28 h-28 bg-linear-to-br from-amber-300/20 to-amber-500/10 rounded-full blur-sm animate-float-slow delay-1000"></div> */}
          <div className="absolute bottom-25 right-5 w-20 h-20 bg-linear-to-br from-amber-200/25 to-amber-400/15 rounded-full blur-sm animate-float-medium delay-500"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-linear-to-br from-amber-300/15 to-amber-500/5 rounded-full blur-sm animate-pulse-slow"></div>
          
          {/* Leaf Elements */}
          <div className="absolute top-15 left-20 w-8 h-12 bg-linear-to-br from-amber-300/30 to-amber-500/20 rounded-tl-full rounded-br-full animate-sway-slow"></div>
          <div className="absolute top-70 right-20 w-10 h-14 bg-linear-to-br from-amber-200/35 to-amber-400/25 rounded-tl-full rounded-br-full animate-sway-medium reverse"></div>
          <div className="absolute bottom-10 left-30 w-7 h-11 bg-linear-to-br from-amber-300/30 to-amber-500/20 rounded-tl-full rounded-br-full animate-sway-slow delay-2000"></div>
          <div className="absolute top-30 right-25 w-9 h-13 bg-linear-to-br from-amber-200/35 to-amber-400/25 rounded-tl-full rounded-br-full animate-sway-medium reverse delay-1000"></div>
          
          {/* Subtle Floral Pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 20C55 20 60 25 60 30C60 35 55 40 50 40C45 40 40 35 40 30C40 25 45 20 50 20Z' fill='%23d4af37'/%3E%3Cpath d='M30 50C35 50 40 55 40 60C40 65 35 70 30 70C25 70 20 65 20 60C20 55 25 50 30 50Z' fill='%23d4af37'/%3E%3Cpath d='M70 50C75 50 80 55 80 60C80 65 75 70 70 70C65 70 60 65 60 60C60 55 65 50 70 50Z' fill='%23d4af37'/%3E%3Cpath d='M50 80C55 80 60 85 60 90C60 95 55 100 50 100C45 100 40 95 40 90C40 85 45 80 50 80Z' fill='%23d4af37'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
<div className="max-w-4xl">
  <h1 className="text-5xl md:text-7xl mb-6 leading-tight">
    Exquisite Digital
    <span className="block text-transparent bg-clip-text bg-linear-to-r from-amber-200 via-amber-300 to-amber-400 min-h-fit leading-normal">
      Embroidery Designs
    </span>
  </h1>
  
  <p className="text-xl md:text-2xl mb-4 text-red-100 font-light tracking-wide">
    Power • Precision • Performance
  </p>
  
  <p className="text-lg mb-10 text-red-100/90 max-w-2xl leading-relaxed">
    Discover our curated collection of high-quality embroidery designs, 
    crafted with meticulous attention to detail for all your creative endeavors.
  </p>
  
  <a
    href="/products"
    className="inline-flex items-center space-x-3 bg-white text-red-900 px-8 py-4 rounded-full font-semibold hover:bg-amber-50 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
  >
    <span>Explore Collection</span>
    <svg className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
    </svg>
  </a>
</div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <svg
            viewBox="0 0 1440 130"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
<path
  d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V131H0V131Z"
  fill="#fafaf9"
/>
          </svg>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <div className="w-24 h-1 bg-linear-to-r from-amber-400 to-amber-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/products?category=${category.slug}`}
                className="group bg-white p-8 rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-2 text-center border border-gray-100 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-br from-amber-50 to-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-red-900 transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-linear-to-br from-amber-400 to-amber-600 rounded-xl">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-gray-900">New Arrivals</h2>
                <p className="text-gray-600 mt-1">Fresh designs just added</p>
              </div>
            </div>
            <Link
              to="/products"
              className="hidden md:flex items-center space-x-2 text-red-800 hover:text-red-900 font-semibold group"
            >
              <span>View All</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
<<<<<<< HEAD
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {[1, 2, 3, 4].map((i) => (
                <ProductCardSkeleton key={i} />
=======
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-100 rounded-2xl h-96 animate-pulse" />
>>>>>>> 90c42162987c4e3cea6a537cf47863f0739dc0df
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Top Sellers Section */}
      <section className="py-20 bg-linear-to-b from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-linear-to-br from-red-600 to-red-800 rounded-xl">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-gray-900">Top Sellers</h2>
                <p className="text-gray-600 mt-1">Most loved by our community</p>
              </div>
            </div>
            <Link
              to="/products"
              className="hidden md:flex items-center space-x-2 text-red-800 hover:text-red-900 font-semibold group"
            >
              <span>View All</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
<<<<<<< HEAD
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {[1, 2, 3, 4].map((i) => (
                <ProductCardSkeleton key={i} />
=======
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-100 rounded-2xl h-96 animate-pulse" />
>>>>>>> 90c42162987c4e3cea6a537cf47863f0739dc0df
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {topSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Add custom animations to your global CSS */}
<<<<<<< HEAD
      <style>{`
=======
      <style jsx>{`
>>>>>>> 90c42162987c4e3cea6a537cf47863f0739dc0df
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.1); }
        }
        @keyframes sway-slow {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes sway-medium {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 6s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 12s ease-in-out infinite; }
        .animate-sway-slow { animation: sway-slow 15s ease-in-out infinite; }
        .animate-sway-medium { animation: sway-medium 12s ease-in-out infinite; }
        .reverse { animation-direction: reverse; }
      `}</style>
    </div>
  );
};

<<<<<<< HEAD
=======
const mockProducts = [
  { 
    id: 1, 
    name: 'Floral Blouse Design', 
    category: 'Blouse Designs', 
    price: 299, 
    images_urls: ['https://res.cloudinary.com/ddvhysyk4/image/upload/v1761849278/Screenshot_2025-10-31_000109_md0wnt.png'], 
    formats: ['DST', 'JEF'] 
  },
  { 
    id: 2, 
    name: 'Traditional Saree Border', 
    category: 'Saree Borders', 
    price: 399, 
    images_urls: ['https://res.cloudinary.com/ddvhysyk4/image/upload/v1761849278/Screenshot_2025-10-30_235433_grlxrx.png'], 
    formats: ['DST', 'JEF'] 
  },
  { 
    id: 3, 
    name: 'Modern Kurthi Pattern', 
    category: 'Kurthi Designs', 
    price: 349, 
    images_urls: ['https://res.cloudinary.com/ddvhysyk4/image/upload/v1761849279/Screenshot_2025-10-31_000130_sjl1cq.png'], 
    formats: ['DST', 'JEF'] 
  },
  { 
    id: 4, 
    name: 'Kids Cartoon Design', 
    category: 'Kids Designs', 
    price: 249, 
    images_urls: ['https://res.cloudinary.com/ddvhysyk4/image/upload/v1761849279/Screenshot_2025-10-30_235828_lk01hu.png'], 
    formats: ['DST', 'JEF'] 
  },
  { 
    id: 5, 
    name: 'Company Logo Design', 
    category: 'Logos', 
    price: 499, 
    images_urls: ['https://res.cloudinary.com/ddvhysyk4/image/upload/v1761849280/Screenshot_2025-10-30_235629_a4uzwl.png'], 
    formats: ['DST', 'JEF'] 
  },
  
  { 
    id: 25, 
    name: 'Back Neck Design', 
    category: 'Blouse Designs', 
    price: 339, 
    images_urls: ['https://res.cloudinary.com/dktx1ebxg/image/upload/v1761849876/Screenshot_2025-10-31_000658_mgeryn.png'], 
    formats: ['DST', 'JEF'] 
  },
  { 
    id: 26, 
    name: 'Traditional Border', 
    category: 'Saree Borders', 
    price: 399, 
    images_urls: ['https://res.cloudinary.com/dktx1ebxg/image/upload/v1761849876/Screenshot_2025-10-31_001024_juu14f.png'], 
    formats: ['DST', 'JEF'] 
  },
  { 
    id: 27, 
    name: 'Modern Kurthi', 
    category: 'Kurthi Designs', 
    price: 369, 
    images_urls: ['https://res.cloudinary.com/dktx1ebxg/image/upload/v1761849876/Screenshot_2025-10-31_001105_sbkcfx.png'], 
    formats: ['DST', 'JEF'] 
  },
  { 
    id: 28, 
    name: 'Educational Kids Design', 
    category: 'Kids Designs', 
    price: 259, 
    images_urls: ['https://res.cloudinary.com/dktx1ebxg/image/upload/v1761849876/Screenshot_2025-10-31_001038_f9k9of.png'], 
    formats: ['DST', 'JEF'] 
  },
  { 
    id: 29, 
    name: 'Professional Logo', 
    category: 'Logos', 
    price: 519, 
    images_urls: ['https://res.cloudinary.com/dktx1ebxg/image/upload/v1761849876/Screenshot_2025-10-31_000912_dyw8tc.png'], 
    formats: ['DST', 'JEF'] 
  },
  { 
    id: 30, 
    name: 'Sequins Special Design', 
    category: 'Beads & Sequins', 
    price: 429, 
    images_urls: ['https://res.cloudinary.com/ddvhysyk4/image/upload/v1761849278/Screenshot_2025-10-31_000109_md0wnt.png'], 
    formats: ['DST', 'JEF'] 
  }
];

>>>>>>> 90c42162987c4e3cea6a537cf47863f0739dc0df
export default Home;
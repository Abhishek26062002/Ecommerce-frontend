import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  User,
  Menu,
  X,
  Search,
  Package,
} from "lucide-react";
import { useState, useEffect } from "react";
import useCartStore from "../store/useCartStore";
import useWishlistStore from "../store/useWishlistStore";
import useAuthStore from "../store/useAuthStore";

const Header = ({ openLogin }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const cartItemCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery("");
      setSidebarOpen(false);
    }
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
<<<<<<< HEAD
    { to: "/machinery", label: "Machinery" },
=======
>>>>>>> 90c42162987c4e3cea6a537cf47863f0739dc0df
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
    { to: "/orders", label: "Orders" },
  ];

  // Dynamic classes based on scroll and page
  const headerClasses =
    isHomePage && !scrolled
      ? "bg-transparent border-transparent shadow-none"
      : "bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50";

  const textClasses = isHomePage && !scrolled ? "text-white" : "text-gray-700";
  const textHoverClasses =
    isHomePage && !scrolled ? "hover:text-yellow-300" : "hover:text-red-600";
  const logoClasses =
    isHomePage && !scrolled ? "text-yellow-400" : "text-red-600";
  const logoSecondaryClasses =
    isHomePage && !scrolled ? "text-white" : "text-gray-800";
  const hoverBgClasses = isHomePage && !scrolled ? "" : "";
  const searchBgClasses =
    isHomePage && !scrolled
      ? "bg-transparent border-white/40 text-white placeholder-white/60 focus:bg-transparent "
      : "bg-white/50 border-gray-200 hover:bg-white/80";

  return (
    <>
      <header
        className={`${headerClasses} ${
          isHomePage && !scrolled ? "absolute" : "sticky"
        } top-0 left-0 right-0 z-50 transition-all duration-300`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div
                className={`text-2xl font-bold ${logoClasses}  transition-transform duration-200`}
              >
                OSA
              </div>
              <div
                className={`text-xl font-semibold ${logoSecondaryClasses} transition-colors duration-300`}
              >
                Embroidery
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                const activeClasses =
                  isActive && isHomePage && !scrolled
                    ? "text-yellow-400"
                    : isActive
                    ? "text-red-600"
                    : "";

                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={(e) => {
                      if (!isAuthenticated && link.to === "/orders") {
                        e.preventDefault();
                        openLogin();
                      }
                    }}
                    className={`px-4 py-2 ${
                      activeClasses || textClasses
                    } ${textHoverClasses} ${hoverBgClasses} rounded-lg transition-all duration-200 font-medium relative group`}
                  >
                    {link.label}
                    <span
                      className={`absolute bottom-0 left-0 w-0 h-0.5 ${
                        isHomePage && !scrolled ? "bg-yellow-400" : "bg-red-600"
                      } group-hover:w-full transition-all duration-300`}
                    ></span>
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search designs..."
                  className={`pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 ${
                    isHomePage && !scrolled
                      ? "focus:ring-yellow-400/50 focus:border-yellow-400"
                      : "focus:ring-red-500/50 focus:border-red-500"
                  } w-64 ${searchBgClasses} backdrop-blur-sm transition-all duration-200`}
                />
                <Search
                  className={`absolute left-3 top-2.5 h-5 w-5 ${
                    isHomePage && !scrolled ? "text-white/70" : "text-gray-400"
                  } transition-colors duration-300`}
                />
              </form>

              <Link
                to="/wishlist"
                className={`relative ${textClasses} ${textHoverClasses} transition-all duration-200 p-2 ${hoverBgClasses} rounded-full group`}
              >
                <Heart className="h-6 w-6 group-hover:scale-110 transition-transform" />
                {wishlistCount > 0 && (
                  <span
                    className={`absolute -top-1 -right-1 ${
                      isHomePage && !scrolled
                        ? "bg-linear-to-r from-yellow-400 to-yellow-500"
                        : "bg-linear-to-r from-red-500 to-red-600"
                    } text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow-lg`}
                  >
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className={`relative ${textClasses} ${textHoverClasses} transition-all duration-200 p-2 ${hoverBgClasses} rounded-full group`}
              >
                <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform" />
                {cartItemCount > 0 && (
                  <span
                    className={`absolute -top-1 -right-1 ${
                      isHomePage && !scrolled
                        ? "bg-linear-to-r from-yellow-400 to-yellow-500"
                        : "bg-linear-to-r from-red-500 to-red-600"
                    } text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow-lg`}
                  >
                    {cartItemCount}
                  </span>
                )}
              </Link>

              <Link
                onClick={(e) => {
                  if (!isAuthenticated) {
                    e.preventDefault();
                    openLogin();
                  }
                }}
                to={isAuthenticated ? "/account" : "#"}
                className={`${textClasses} ${textHoverClasses} transition-all duration-200 p-2 ${hoverBgClasses} rounded-full group`}
              >
                <User className="h-6 w-6 group-hover:scale-110 transition-transform" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`lg:hidden ${textClasses} ${textHoverClasses} focus:outline-none p-2 ${hoverBgClasses} rounded-lg transition-all`}
            >
              {sidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-white/95 backdrop-blur-xl shadow-2xl transform ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-out z-50 lg:hidden border-l border-gray-200/50`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Sidebar Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200/50 bg-linear-to-r from-red-50/50 to-transparent">
            <div className="flex items-center space-x-2">
              <div className="text-xl font-bold text-red-600">OSA</div>
              <div className="text-lg font-semibold text-gray-800">Menu</div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-700 hover:text-red-600 focus:outline-none p-2 hover:bg-red-50 rounded-lg transition-all"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Sidebar Content - Scrollable */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="p-6 space-y-6">
              {/* Search */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search designs..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 bg-white/70 backdrop-blur-sm transition-all"
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </form>

              {/* Navigation Links */}
              <div className="space-y-2">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.to;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={(e) => {
                        setSidebarOpen(false);
                        if (!isAuthenticated && link.to === "/orders") {
                          e.preventDefault();
                          openLogin();
                        }
                      }}
                      className={`flex items-center space-x-3 ${
                        isActive ? "text-red-600 bg-red-50/70" : "text-gray-700"
                      } hover:text-red-600 hover:bg-red-50/70 transition-all font-medium py-3 px-4 rounded-xl group`}
                    >
                      {link.icon && (
                        <link.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      )}
                      <span className="text-base">{link.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="border-t border-gray-200/50 pt-6 space-y-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3">
                  Quick Actions
                </div>

                <Link
                  to="/wishlist"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center justify-between text-gray-700 hover:text-red-600 hover:bg-red-50/70 transition-all py-3 px-4 rounded-xl group"
                >
                  <div className="flex items-center space-x-3">
                    <Heart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Wishlist</span>
                  </div>
                  {wishlistCount > 0 && (
                    <span className="bg-linear-to-r from-red-500 to-red-600 text-white text-xs rounded-full px-2.5 py-1 font-semibold">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/cart"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center justify-between text-gray-700 hover:text-red-600 hover:bg-red-50/70 transition-all py-3 px-4 rounded-xl group"
                >
                  <div className="flex items-center space-x-3">
                    <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Cart</span>
                  </div>
                  {cartItemCount > 0 && (
                    <span className="bg-linear-to-r from-red-500 to-red-600 text-white text-xs rounded-full px-2.5 py-1 font-semibold">
                      {cartItemCount}
                    </span>
                  )}
                </Link>

                <Link
                  onClick={(e) => {
                    setSidebarOpen(false);

                    if (!isAuthenticated) {
                      e.preventDefault();
                      openLogin();
                    }
                  }}
                  to={isAuthenticated ? "/account" : "#"}
                  className="flex items-center space-x-3 text-gray-700 hover:text-red-600 hover:bg-red-50/70 transition-all py-3 px-4 rounded-xl group"
                >
                  <User className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">
                    {isAuthenticated ? "Account" : "Sign In"}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Header;

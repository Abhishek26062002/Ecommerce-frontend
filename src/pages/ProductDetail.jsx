import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Download, ArrowLeft } from 'lucide-react';
import ProductGallery from '../components/ProductGallery';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import useWishlistStore from '../store/useWishlistStore';
import { api } from '../utils/api';
import { formatPrice, showToast } from '../utils/helpers';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const addToCart = useCartStore(state => state.addItem);
  const addToWishlist = useWishlistStore(state => state.addItem);
  const removeFromWishlist = useWishlistStore(state => state.removeItem);
  const isInWishlist = useWishlistStore(state => state.isInWishlist(id));
  const [showPopup, setShowPopup] = useState(false);
const [selectedFormat, setSelectedFormat] = useState("");
const cartItems = useCartStore(state => state.items);
const isInCart = cartItems.some(item => item.id === product?.id);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const clearCart = useCartStore(state => state.clearCart);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const addItemToStore = useCartStore(state => state.addItem);

  console.log(isInWishlist);

  const  features = [
    'High-quality digitization',
    'Multiple color variations',
    'Suitable for various fabrics',
    'Tested on commercial machines',
  ];

  useEffect(() => {
    fetchProduct();
  }, [id]);
  const fetchProduct = async () => {
    try {
      const data = await api.fetchProductById(id);
      setProduct(data || []);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    // For guest users, fallback to existing add-to-cart behavior
    if (!isAuthenticated) {
      addToCart(product);
      showToast('Added to cart!', 'success');
      return;
    }

    // If user is authenticated, send single item to backend
    (async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('Missing user id');

        const payloadItem = {
          product_id: product.id,
          name: product.name,
          machine_type: selectedFormat || product.machine_type || null,
          unit_price: parseFloat(product.discount_price ?? product.price ?? 0),
          quantity: 1,
        };

        await api.addCartItems(userId, [payloadItem]);

        // Clear local guest cart after successful push
        clearCart();
        try { localStorage.removeItem('osa-cart-storage'); } catch(e) { /* ignore */ }

        // Fetch server cart and populate local store
        try {
          const serverData = await api.fetchCartItems(userId);
          const serverItems = Object.values(serverData || {});
          if (serverItems.length > 0) {
            // replace local cart with server items
            clearCart();
            for (const it of serverItems) {
              const productObj = {
                id: it.product_id,
                name: it.name,
                price: it.price ?? it.unit_price,
                discount_price: it.unit_price ?? it.price,
                machine_type: it.machine_type,
                selectedFormat: it.selected_format,
                image: it.image || (it.images_urls?.[0]) || null,
                images_urls: it.images_urls || [],
                cartItemId: it.id,
              };
              addItemToStore(productObj);
              updateQuantity(it.product_id, it.quantity, it.selected_format);
            }
          }
        } catch (err) {
          console.error('Error fetching server cart after add:', err);
        }

        showToast('Added to cart!', 'success');
      } catch (err) {
        console.error('Error adding item to server cart:', err);
        showToast('Failed to add to cart', 'error');
      }
    })();
  };

  const handleToggleWishlist = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
      showToast('Removed from wishlist', 'success');
    } else {
      addToWishlist(product);
      showToast('Added to wishlist!', 'success');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-200 rounded-lg h-96 animate-pulse" />
            <div className="space-y-4">
              <div className="bg-gray-200 rounded h-8 animate-pulse" />
              <div className="bg-gray-200 rounded h-24 animate-pulse" />
              <div className="bg-gray-200 rounded h-12 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xl text-gray-600">Product not found</p>
          <Link to="/products" className="text-red-600 hover:underline mt-4 inline-block">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/products"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-red-600 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Products</span>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProductGallery images={product.images_urls || [product.image]} />

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>

            {product.category && (
              <p className="text-gray-600 mb-4">
                Category: <span className="font-semibold">{product.category}</span>
              </p>
            )}

            <div className="flex items-center gap-2">
  {product.discount_price ? (
    <>
      <span className="text-2xl md:text-5xl font-bold text-red-600">
        {formatPrice(product.discount_price)}
      </span>

      <span className="text-lg md:text-xl line-through text-gray-500">
        {formatPrice(product.price)}
      </span>
    </>
  ) : (
    <span className="text-2xl md:text-5xl font-bold text-red-600">
      {formatPrice(product.price)}
    </span>
  )}
</div>

            {product.description && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
            )}

            {product?.machine_type && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Available Formats</h3>
                <div className="flex flex-wrap gap-2">
                  {product.machine_type && (
  <div>
    {product.machine_type === "Both" ? (
      <>
        <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium">
          DST
        </span>
        <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium">
          JEF
        </span>
      </>
    ) : (
      <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium">
        {product.machine_type}
      </span>
    )}
  </div>
)}
                </div>
              </div>
            )}
            <div className='flex flex-col-reverse lg:flex-col '>
<div>
            {features && features.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Features</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}</div>

            <div className="flex space-x-4 mb-6">
              <button
  onClick={() => {
    if (isInCart) {
      window.location.href = "/cart";
      return;
    }
    setShowPopup(true);
  }}
  className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
>
  <ShoppingCart className="h-5 w-5" />
  <span className="font-semibold">{isInCart ? "View Cart" : "Add to Cart"}</span>
</button>


              <button
                onClick={handleToggleWishlist}
                className={`px-6 py-3 rounded-lg border-2 transition-colors ${
                  isInWishlist
                    ? 'border-red-600 bg-red-50 text-red-600'
                    : 'border-gray-300 hover:border-red-600 hover:bg-red-50'
                }`}
              >
                <Heart
                  className={`h-6 w-6 ${isInWishlist ? 'fill-red-600' : ''}`}
                />
              </button>
            </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <Download className="h-4 w-4" />
                <span>Instant digital download after purchase</span>
              </div>
              <p className="text-xs text-gray-500">
                Compatible with most commercial embroidery machines
              </p>
            </div>
          </div>
        </div>
      </div>
      {showPopup && (
  <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl w-full max-w-xs md:max-w-sm shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Select Machine Format</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        {product.machine_type === "Both" ? (
          <>
            <button
              className={`px-4 py-2 border rounded-lg ${
                selectedFormat === "DST"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setSelectedFormat("DST")}
            >
              DST
            </button>

            <button
              className={`px-4 py-2 border rounded-lg ${
                selectedFormat === "JEF"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setSelectedFormat("JEF")}
            >
              JEF
            </button>
          </>
        ) : (
            <button
              className={`px-4 py-2 border rounded-lg ${
                selectedFormat === product.machine_type
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setSelectedFormat(product.machine_type)}
            >
              {product.machine_type}
            </button>
        )}
      </div>

      <div className="flex gap-3">
        <button
          className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg"
          onClick={() => setShowPopup(false)}
        >
          Cancel
        </button>

        <div className="flex-1">
          <button
            disabled={!selectedFormat}
            className={`w-full py-2 rounded-lg font-semibold ${
              selectedFormat
                ? "bg-red-600 text-white"
                : "bg-red-300 text-gray-100 cursor-not-allowed"
            }`}
            onClick={() => {
              handleAddToCart();
              setShowPopup(false);
            }}
          >
            Add to Cart
          </button>
        </div>

        {/* Removed 'Add Both Formats' per request */}
      </div>
    </div>
  </div>
)}

    </div>
  );
};



export default ProductDetail;

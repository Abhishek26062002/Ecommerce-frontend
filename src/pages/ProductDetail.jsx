import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const navigate = useNavigate();

  const addToCart = useCartStore(state => state.addItem);
  const addToWishlist = useWishlistStore(state => state.addItem);
  const removeFromWishlist = useWishlistStore(state => state.removeItem);
  const isInWishlist = useWishlistStore(state => state.isInWishlist(id));
  const [showPopup, setShowPopup] = useState(false);
const [selected_format, setselected_format] = useState("");
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
      console.log('Product data:', data);
      console.log('Machine type:', data?.machine_type);
      console.log('Is array?', Array.isArray(data?.machine_type));
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
      setIsAddingToCart(true);
      setTimeout(() => {
        const productObj = {
                id: product.id,
                name: product.name,
                price: product.price ?? product.unit_price,
                discount_price: product.discount_price,
                machine_type: product.machine_type,
                selected_format: selected_format || null,
                image: product.image || (product.images_urls?.[0]) || null,
                images_urls: product.images_urls || [],
              };
        addToCart(productObj);
        showToast('Added to cart!', 'success');
        setIsAddingToCart(false);
      }, 800);
      return;
    }

    // If user is authenticated, send single item to backend
    (async () => {
      setIsAddingToCart(true);
      try {
        const userId = localStorage.getItem('osa-userId');
        if (!userId) throw new Error('Missing user id');

        const payloadItem = {
          product_id: product.id,
          name: product.name,
          selected_format: selected_format || null,
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
                selected_format: selected_format || null,
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
      } finally {
        setIsAddingToCart(false);
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
                {console.log('Rendering machine_type:', product.machine_type, 'Is array:', Array.isArray(product.machine_type))}
                <div className="flex flex-wrap gap-2">
                  {product.machine_type.map((format) => (
                    <span key={format} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium uppercase">
                      {format}
                    </span>
                  ))}
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
      navigate("/cart");
      return;
    }
    setShowPopup(true);
  }}
  className={`flex-1  cursor-pointer transition-colors flex items-center justify-center space-x-2 ${isInCart ? 'bg-white text-red-600 border-2 rounded-2xl border-red-600' : ' bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700'}`}
>
  <ShoppingCart className="h-5 w-5" />
  <span className="font-semibold">{isInCart ? "View Cart" : "Add to Cart"}</span>
</button>


              <button
                onClick={handleToggleWishlist}
                className={`px-6 py-3 cursor-pointer rounded-lg border-2 transition-colors ${
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
        {product.machine_type.map((format) => (
          <button
            key={format}
            className={`px-4 py-2 border rounded-lg cursor-pointer ${
              selected_format === format
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setselected_format(format)}
          >
            {format.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          className="flex-1 bg-gray-200  cursor-pointer text-gray-700 py-2 rounded-lg disabled:opacity-50"
          onClick={() => setShowPopup(false)}
          disabled={isAddingToCart}
        >
          Cancel
        </button>

        <div className="flex-1">
          <button
            disabled={!selected_format || isAddingToCart}
            className={`w-full py-2 rounded-lg font-semibold ${
              selected_format && !isAddingToCart
                ? "bg-red-600 text-white cursor-pointer"
                : "bg-red-300 text-gray-100 cursor-not-allowed"
            }`}
            onClick={() => {
              handleAddToCart();
              setShowPopup(false);
            }}
          >
            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>

        {/* Removed 'Add Both Formats' per request */}
      </div>
    </div>
    </div>
  )}

      {isAddingToCart && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="flex flex-col items-center">
            <div className="relative w-16 h-16">
              <svg className="animate-spin h-16 w-16 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="mt-4 text-white font-semibold">Adding to cart...</p>
          </div>
        </div>
      )}

    </div>
  );
};



export default ProductDetail;
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, CreditCard, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import CartItem from '../components/CartItem';
import CheckoutModal from '../components/CheckoutModal';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import { api } from '../utils/api';
import { formatPrice, showToast } from '../utils/helpers';

const Cart = ({ openLogin }) => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart, addItem, updateQuantity } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const total = getTotal();

  // Sync cart with server after login
  useEffect(() => {
    const fetchServerCart = async () => {
      if (!isAuthenticated) return;

      const userId = localStorage.getItem('osa-userId');
      if (!userId) return;

      try {
        const serverData = await api.fetchCartItems(userId);
        console.log('Fetched server cart data:', serverData);
        const serverItems = Object.values(serverData || {});

        if (serverItems.length > 0) {
          // Replace local cart with server items
          clearCart();
          for (const it of serverItems) {
            const productObj = {
              id: it.product_id,
              name: it.name,
              price: it.price ?? it.unit_price,
              discount_price: it.unit_price && it.unit_price < it.price ? it.unit_price : it.price,
              machine_type: it.machine_type,
              selected_format: it.selected_format,
              images_urls: it.images_urls,
              cartItemId: it.id,
            };

            addItem(productObj);
            updateQuantity(it.product_id, it.quantity, it.machine_type);
          }
        }
      } catch (err) {
        console.error('Error fetching server cart:', err);
      }
    };

    fetchServerCart();
  }, [isAuthenticated, addItem, updateQuantity, clearCart]);

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    setShowCheckout(true);
  };

  const handlePaymentSuccess = async (orderId) => {
    try {
      // Clear local cart
      clearCart();
      
      // Clear server cart
      const userId = localStorage.getItem('osa-userId');
      if (userId) {
        // You may want to add a clearCart API endpoint
        localStorage.removeItem('osa-cart-storage');
      }

      showToast('Order placed successfully!', 'success');
      
      // Redirect to orders page
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (err) {
      console.error('Error handling payment success:', err);
      showToast('Order placed but there was an issue. Please check your orders.', 'warning');
    }
  };

  if (!items.length) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some products to get started</p>
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col items-start gap-2 md:flex-row md:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
          <Link to="/products" className="text-red-600 hover:text-red-700 flex items-center space-x-2">
            <ArrowLeft className="h-5 w-5" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItem key={`${item.id}-${item.selected_format?? item.machine_type ?? 'none'}`} item={item} />
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg border border-gray-200 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.reduce((sum, i) => sum + i.quantity, 0)} items)</span>
                  <span className="font-semibold">{formatPrice(total)}</span>
                </div>

                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-800">
                  <span>Total</span>
                  <span className="text-red-600">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="w-full cursor-pointer bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2 mb-3 font-semibold"
              >
                <CreditCard className="h-5 w-5" />
                <span>Proceed to Checkout</span>
              </button>

              <p className="text-xs text-gray-500 text-center">
                Secure payment powered by Razorpay
              </p>

              <div className="mt-6 pt-6 border-t text-sm text-gray-600">
                <p className="mb-2 font-semibold">What happens next?</p>
                <ul className="space-y-1 text-xs">
                  <li>✓ Secure payment via Razorpay</li>
                  <li>✓ Instant order confirmation</li>
                  <li>✓ Instant download after payment</li>
                  <li>✓ Unlimited re-downloads</li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        items={items}
        total={total}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Login Required</h2>
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full transition"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-6">
                Please log in to proceed with checkout and complete your purchase.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowLoginPrompt(false);
                     openLogin();
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Go to Login
                </button>

                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                Don't have an account? You can sign up during login.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

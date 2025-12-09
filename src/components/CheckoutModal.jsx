import { useState } from 'react';
import { X, Loader } from 'lucide-react';
import { formatPrice, showToast } from '../utils/helpers';
import { api } from '../utils/api';

const CheckoutModal = ({ isOpen, onClose, items, total, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      showToast('Please enter your name', 'error');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      showToast('Please enter a valid email', 'error');
      return false;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      showToast('Please enter a valid phone number', 'error');
      return false;
    }
    return true;
  };

  const handleCheckout = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        showToast('Please login to proceed', 'error');
        setLoading(false);
        return;
      }

      // Create order on backend (backend handles Razorpay)
      const orderResponse = await api.createOrder(userId, items, formData);
      console.log('Order created:', orderResponse);

      // Backend returns payment link - redirect to it
      if (orderResponse.payment_link) {
        // Store order ID before redirecting
        sessionStorage.setItem('orderId', orderResponse.order_id);
        sessionStorage.setItem('orderTotal', total);
        
        // Redirect to Razorpay payment link created by backend
        window.location.href = orderResponse.payment_link;
      } else {
        showToast('Error: No payment link received from server', 'error');
        setLoading(false);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      showToast(err.message || 'Failed to initiate checkout', 'error');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-800">Checkout</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 max-h-40 overflow-y-auto">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm text-gray-600">
                  <span>
                    {item.name} x {item.quantity}
                    {item.selectedFormat && <span className="ml-1">({item.selectedFormat})</span>}
                  </span>
                  <span className="font-medium">
                    {formatPrice((item.discount_price ?? item.price) * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2 flex justify-between font-bold text-gray-800">
                <span>Total:</span>
                <span className="text-red-600">{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          {/* Customer Details Form */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Billing Details</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="9876543210"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Security Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>🔒 Secure Payment:</strong> Your payment is processed securely by Razorpay on our secure server.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6 space-y-3 sticky bottom-0 bg-white">
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
          >
            {loading && <Loader className="h-5 w-5 animate-spin" />}
            {loading ? 'Processing...' : `Pay ${formatPrice(total)}`}
          </button>

          <button
            onClick={onClose}
            disabled={loading}
            className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <p className="text-xs text-gray-500 text-center">
            By proceeding, you agree to our Terms & Conditions
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;

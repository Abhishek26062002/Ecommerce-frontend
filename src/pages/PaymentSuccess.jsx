import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import { api } from '../utils/api';
import { showToast } from '../utils/helpers';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Get payment details from URL parameters (from Razorpay redirect)
        const paymentId = searchParams.get('razorpay_payment_id');
        const paymentLinkId = searchParams.get('razorpay_payment_link_id');
        const paymentStatus = searchParams.get('razorpay_payment_link_status');
        const signature = searchParams.get('razorpay_signature');

        // Get order ID from sessionStorage (set before checkout)
        let orderId = sessionStorage.getItem('orderId');

        console.log('Payment Success Parameters:', {
          paymentId,
          paymentLinkId,
          paymentStatus,
          orderId
        });

        if (!orderId && !paymentId) {
          showToast('Payment information not found', 'error');
          setTimeout(() => navigate('/cart'), 2000);
          return;
        }

        // If no orderId but we have payment info, try to verify payment with backend
        if (!orderId && paymentId) {
          try {
            // Call backend to verify payment and get order details
            const verifyResponse = await api.verifyPaymentByPaymentId(
              paymentId,
              paymentStatus
            );
            
            if (verifyResponse.success || verifyResponse.order_id) {
              orderId = verifyResponse.order_id;
              sessionStorage.setItem('orderId', orderId);
            }
          } catch (err) {
            console.error('Payment verification error:', err);
            // Continue anyway, show what we have
          }
        }

        setOrderId(orderId || paymentId);

        // Clear cart
        clearCart();
        localStorage.removeItem('osa-cart-storage');

        // Clear session storage
        sessionStorage.removeItem('orderId');
        sessionStorage.removeItem('orderTotal');

        setLoading(false);

        // Redirect to orders page after 3 seconds
        setTimeout(() => {
          navigate('/orders');
        }, 3000);
      } catch (err) {
        console.error('Payment processing error:', err);
        showToast('Error processing payment', 'error');
        setLoading(false);
        setTimeout(() => navigate('/cart'), 2000);
      }
    };

    processPayment();
  }, [navigate, searchParams, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Payment</h2>
          <p className="text-gray-600">Please wait while we confirm your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-800 mb-2">
            <strong>Order ID:</strong> {orderId}
          </p>
          <p className="text-xs text-green-700">
            Your order has been confirmed. A confirmation email has been sent to your email address.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <h3 className="font-semibold text-gray-800">What's Next?</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ Order confirmation email sent</li>
            <li>✓ Your designs are ready to download</li>
            <li>✓ Download anytime, unlimited times</li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <p className="text-xs text-blue-800">
            <strong>💡 Tip:</strong> Check your orders page to download your digital designs instantly.
          </p>
        </div>

        <button
          onClick={() => navigate('/orders')}
          className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold mb-2"
        >
          View My Orders
        </button>

        <button
          onClick={() => navigate('/products')}
          className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
        >
          Continue Shopping
        </button>

        <p className="text-xs text-gray-500 mt-4">
          Redirecting to orders page in a few seconds...
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;

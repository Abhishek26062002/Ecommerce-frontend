import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { useEffect } from 'react';
import { showToast } from '../utils/helpers';

const PaymentFailed = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const errorMessage = searchParams.get('error') || 'Payment processing failed. Please try again.';
    showToast(errorMessage, 'error');
  }, [searchParams]);

  const handleRetry = () => {
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center">
        <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Failed</h1>

        <p className="text-gray-600 mb-6">
          {searchParams.get('error') || 'Your payment could not be processed. Your cart items are still saved.'}
        </p>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-800">
            <strong>Don't worry!</strong> Your cart items are still saved. You can try again anytime.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <h3 className="font-semibold text-gray-800">Common Reasons:</h3>
          <ul className="text-sm text-gray-600 space-y-2 text-left">
            <li>• Insufficient funds in your account</li>
            <li>• Incorrect card/payment details</li>
            <li>• Network connectivity issue</li>
            <li>• Payment gateway timeout</li>
          </ul>
        </div>

        <button
          onClick={handleRetry}
          className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold mb-2"
        >
          Return to Cart & Retry
        </button>

        <button
          onClick={() => navigate('/products')}
          className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
        >
          Continue Shopping
        </button>

        <div className="mt-6 pt-6 border-t">
          <p className="text-xs text-gray-500 mb-2">
            <strong>Need help?</strong>
          </p>
          <p className="text-xs text-gray-600">
            Contact us at support@osaembroidery.com or call +91 XXXXXXXXXX
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;

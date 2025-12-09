import { X, Plus, Minus, MessageCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import useMachineryBasketStore from '../store/useMachineryBasketStore';
import { generateMachineryWhatsAppMessage, showToast } from '../utils/helpers';

const MachineryBasketSidebar = () => {
  const location = useLocation();
  const isOnMachineryPage = location.pathname === '/machinery';
  
  const {
    items,
    sidebarOpen,
    toggleSidebar,
    updateQuantity,
    removeItem,
    clearBasket,
    getTotalPrice,
  } = useMachineryBasketStore();

  const handleOrderOnWhatsApp = () => {
    if (items.length === 0) {
      showToast('Please add items to your basket first', 'info');
      return;
    }

    const message = generateMachineryWhatsAppMessage(items);
    const phoneNumber = '918985648864'; // Contact number from Contact.jsx
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappLink, '_blank');
    showToast('Opening WhatsApp...', 'success');
  };

  return (
    <>
      {/* Backdrop - Click to close */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Machinery Basket</h2>
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="p-6 text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-600 font-medium mb-2">Your basket is empty</p>
            <p className="text-sm text-gray-500">
              Add machinery items to get started
            </p>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="p-6 space-y-4">
              {items.map((item) => {
                const price = item.discounted_price || item.price;
                const subtotal = price * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200"
                  >
                    {/* Item Header */}
                    <div className="flex gap-3">
                      {item.images && item.images.length > 0 && (
                        <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-red-600 font-bold">₹{price}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 hover:bg-red-100 rounded transition-colors text-gray-600 hover:text-red-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Quantity Control */}
                    <div className="flex items-center gap-2 bg-white rounded-lg w-fit border border-gray-300 p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Minus className="w-4 h-4 text-gray-700" />
                      </button>
                      <span className="w-8 text-center font-semibold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Plus className="w-4 h-4 text-gray-700" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="flex justify-between text-sm border-t border-gray-200 pt-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-bold text-gray-800">₹{subtotal}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary & Actions */}
            <div className="sticky bottom-0 border-t border-gray-200 bg-white p-6 space-y-4">
              {/* Total */}
              <div className="space-y-2 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Items</span>
                  <span>{items.length}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-red-600">
                  <span>Total</span>
                  <span>₹{getTotalPrice()}</span>
                </div>
              </div>

              {/* Buttons */}
              <button
                onClick={handleOrderOnWhatsApp}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                Order on WhatsApp
              </button>

              <button
                onClick={clearBasket}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition-colors"
              >
                Clear Basket
              </button>

              <p className="text-xs text-gray-500 text-center">
                You will be redirected to WhatsApp to complete your order
              </p>
            </div>
          </>
        )}
      </div>

      {/* Floating Basket Button (Bottom Right - Only on Machinery Page) */}
      {isOnMachineryPage && items.length > 0 && !sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white rounded-full p-4 shadow-2xl transition-all z-40 flex items-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="bg-white text-red-600 font-bold rounded-full w-6 h-6 flex items-center justify-center text-sm">
            {items.length}
          </span>
        </button>
      )}
    </>
  );
};

export default MachineryBasketSidebar;

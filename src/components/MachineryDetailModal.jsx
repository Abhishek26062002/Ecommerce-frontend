import { useState } from 'react';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import MachineryImageGallery from './MachineryImageGallery';
import useMachineryBasketStore from '../store/useMachineryBasketStore';
import { showToast } from '../utils/helpers';

const MachineryDetailModal = ({ machinery, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const { addItem, toggleSidebar } = useMachineryBasketStore();

  if (!isOpen) return null;

  const handleAddToBasket = () => {
    addItem({
      id: machinery.machine_id || machinery.id,
      name: machinery.name,
      price: machinery.price,
      discounted_price: machinery.discount_price,
      images: machinery.images_urls || machinery.images || [],
      quantity,
    });
    showToast(`${machinery.name} added to basket!`, 'success');
    toggleSidebar();
    onClose();
  };

  const images = machinery.images_urls || machinery.images || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop - Click to close */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-auto overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">{machinery.name}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image Gallery */}
              <div>
                <MachineryImageGallery images={images} />
              </div>

              {/* Details */}
              <div className="flex flex-col">
                {/* Product Info */}
                <div className="space-y-6">
                  {/* Price */}
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-bold text-red-600">
                        ₹{machinery.discount_price || machinery.price}
                      </span>
                      {machinery.discount_price && (
                        <span className="text-xl text-gray-400 line-through">
                          ₹{machinery.price}
                        </span>
                      )}
                    </div>
                    {machinery.discount_price && (
                      <p className="text-sm text-green-600 font-semibold">
                        Save {Math.round(((machinery.price - machinery.discount_price) / machinery.price) * 100)}%
                      </p>
                    )}
                  </div>

                  {/* Quantity & Action - Moved to top */}
                  <div className="space-y-3 p-4 bg-red-50 rounded-lg border border-red-200">
                    <label className="block text-sm font-semibold text-gray-800">
                      Quantity
                    </label>
                    <div className="flex items-center gap-3 bg-white rounded-lg w-fit border border-gray-300 p-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Minus className="w-5 h-5 text-gray-700" />
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          setQuantity(Math.max(1, val));
                        }}
                        className="w-16 text-center font-semibold bg-transparent outline-none"
                      />
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Plus className="w-5 h-5 text-gray-700" />
                      </button>
                    </div>

                    <button
                      onClick={handleAddToBasket}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Floating Basket
                    </button>
                  </div>

                  {/* Description */}
                  {machinery.description && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-800">Description</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {machinery.description}
                      </p>
                    </div>
                  )}

                  {/* Product Details */}
                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800 text-sm">Product Details</h3>
                    <div className="space-y-2 text-sm">
                      {machinery.brand && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Brand</span>
                          <span className="font-medium text-gray-800">{machinery.brand}</span>
                        </div>
                      )}
                      {machinery.machine_type && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type</span>
                          <span className="font-medium text-gray-800">{machinery.machine_type}</span>
                        </div>
                      )}
                      {machinery.size && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Size</span>
                          <span className="font-medium text-gray-800">{machinery.size}</span>
                        </div>
                      )}
                      {machinery.color && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Color</span>
                          <span className="font-medium text-gray-800">{machinery.color}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm text-blue-900 font-medium">
                      In Stock {machinery.stock_count && `- ${machinery.stock_count} units available`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineryDetailModal;

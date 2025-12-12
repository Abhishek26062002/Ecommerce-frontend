import { X, ShoppingCart, CheckCircle } from 'lucide-react';
import useMachineryBasketStore from '../store/useMachineryBasketStore';
import { formatPrice, showToast } from '../utils/helpers';

const EmbroideryMachineDetailModal = ({ machine, onClose }) => {
  const addItem = useMachineryBasketStore((state) => state.addItem);

  const handleAddToBasket = () => {
    addItem({
      id: machine.machine_id,
      name: machine.name,
      model: machine.model,
      brand: machine.brand,
      price: machine.price,
      discounted_price: machine.discount_price,
      images: machine.images_urls || [],
      quantity: 1,
    });
    showToast(`${machine.name} added to basket!`, 'success');
    onClose();
  };

  const hasDiscount = machine.discount_price && machine.discount_price < machine.price;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-gray-900">{machine.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Image Gallery */}
          <div className="mb-6">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
              <img
                src={machine.images_urls?.[0] || 'https://via.placeholder.com/600'}
                alt={machine.name}
                className="w-full h-full object-cover"
              />
              {hasDiscount && (
                <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-lg">
                  Save {Math.round(((machine.price - machine.discount_price) / machine.price) * 100)}%
                </div>
              )}
            </div>
            {machine.images_urls?.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {machine.images_urls.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`${machine.name} ${idx + 1}`}
                    className="h-20 w-20 object-cover rounded border-2 border-gray-200 hover:border-red-600 cursor-pointer transition"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
            <div>
              <p className="text-gray-600 text-sm">Brand</p>
              <p className="text-lg font-semibold text-gray-900">{machine.brand}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Model</p>
              <p className="text-lg font-semibold text-gray-900">{machine.model}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Type</p>
              <p className="text-lg font-semibold text-gray-900">{machine.machine_type}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Stock</p>
              <p className={`text-lg font-semibold ${machine.stock_count > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {machine.stock_count > 0 ? `${machine.stock_count} available` : 'Out of stock'}
              </p>
            </div>
          </div>

          {/* Technical Specs */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Specifications</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Needle Count</p>
                <p className="text-2xl font-bold text-red-600">{machine.needle_count}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Max SPM</p>
                <p className="text-2xl font-bold text-red-600">{machine.max_spm}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Embroidery Area</p>
                <p className="text-lg font-bold text-red-600">{machine.max_embroidery_area}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Heads</p>
                <p className="text-2xl font-bold text-red-600">{machine.head_count || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
            <div className="grid grid-cols-2 gap-3">
              {machine.usb && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-800 font-medium">USB Connection</span>
                </div>
              )}
              {machine.wifi && (
                <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-800 font-medium">WiFi Enabled</span>
                </div>
              )}
              {machine.auto_thread_trimmer && (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-800 font-medium">Auto Thread Trimmer</span>
                </div>
              )}
              {machine.auto_color_change && (
                <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-orange-600" />
                  <span className="text-gray-800 font-medium">Auto Color Change</span>
                </div>
              )}
              {machine.thread_break_detection && (
                <div className="flex items-center gap-2 p-3 bg-pink-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-pink-600" />
                  <span className="text-gray-800 font-medium">Thread Break Detection</span>
                </div>
              )}
            </div>
          </div>

          {/* File Formats */}
          {machine.file_formats && machine.file_formats.length > 0 && (
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Supported File Formats</h3>
              <div className="flex flex-wrap gap-2">
                {machine.file_formats.map((format) => (
                  <span
                    key={format}
                    className="px-4 py-2 bg-gray-100 text-gray-800 font-semibold rounded-lg text-sm"
                  >
                    {format}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {machine.description && (
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{machine.description}</p>
            </div>
          )}

          {/* Pricing */}
          <div className="mb-6">
            <div className="bg-linear-to-r from-red-50 to-red-50 p-6 rounded-lg">
              <p className="text-gray-600 text-sm mb-2">Price</p>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-red-600">
                  {formatPrice(hasDiscount ? machine.discount_price : machine.price)}
                </span>
                {hasDiscount && (
                  <span className="text-xl line-through text-gray-500">
                    {formatPrice(machine.price)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToBasket}
              disabled={machine.stock_count === 0}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Basket
            </button>
            <button
              onClick={onClose}
              className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmbroideryMachineDetailModal;

import { useState } from 'react';
import { ShoppingCart, Info } from 'lucide-react';
import useMachineryBasketStore from '../store/useMachineryBasketStore';
import { formatPrice, showToast } from '../utils/helpers';
import EmbroideryMachineDetailModal from './EmbroideryMachineDetailModal';

const EmbroideryMachineCard = ({ machine }) => {
  const [showDetails, setShowDetails] = useState(false);
  const addItem = useMachineryBasketStore((state) => state.addItem);

  const handleAddToBasket = (e) => {
    e.stopPropagation();
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
  };

  const hasDiscount = machine.discount_price && machine.discount_price < machine.price;

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-300 overflow-hidden transition-all duration-300 flex flex-col h-full">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100 cursor-pointer" onClick={() => setShowDetails(true)}>
          <img
            src={machine.images_urls?.[0] || 'https://via.placeholder.com/400'}
            alt={machine.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
          {hasDiscount && (
            <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Save {Math.round(((machine.price - machine.discount_price) / machine.price) * 100)}%
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Brand */}
          <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">
            {machine.brand}
          </p>

          {/* Name */}
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {machine.name}
          </h3>

          {/* Model */}
          <p className="text-sm text-gray-600 mb-3">
            Model: {machine.model}
          </p>

          {/* Key Features */}
          <div className="bg-gray-50 rounded-lg p-3 mb-3 text-sm space-y-1">
            <div className="flex justify-between text-gray-700">
              <span>Needles:</span>
              <span className="font-semibold">{machine.needle_count}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Max SPM:</span>
              <span className="font-semibold">{machine.max_spm}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Area:</span>
              <span className="font-semibold">{machine.max_embroidery_area}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Type:</span>
              <span className="font-semibold text-xs">{machine.machine_type}</span>
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-3">
            {machine.usb && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">USB</span>
            )}
            {machine.wifi && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">WiFi</span>
            )}
            {machine.auto_thread_trimmer && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Auto Trimmer</span>
            )}
            {machine.auto_color_change && (
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">Auto Color</span>
            )}
            {machine.thread_break_detection && (
              <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">Thread Detection</span>
            )}
          </div>

          {/* Stock Status */}
          <div className="mb-3">
            {machine.stock_count > 0 ? (
              <p className="text-xs font-medium text-green-600">
                ✓ {machine.stock_count} in stock
              </p>
            ) : (
              <p className="text-xs font-medium text-red-600">
                Out of stock
              </p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-4 mt-auto">
            {hasDiscount ? (
              <>
                <span className="text-2xl font-bold text-red-600">
                  {formatPrice(machine.discount_price)}
                </span>
                <span className="text-lg line-through text-gray-500">
                  {formatPrice(machine.price)}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-red-600">
                {formatPrice(machine.price)}
              </span>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleAddToBasket}
              disabled={machine.stock_count === 0}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              Add
            </button>
            <button
              onClick={() => setShowDetails(true)}
              className="flex-1 border-2 border-red-600 text-red-600 hover:bg-red-50 font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Info className="h-4 w-4" />
              Details
            </button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && (
        <EmbroideryMachineDetailModal
          machine={machine}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
};

export default EmbroideryMachineCard;

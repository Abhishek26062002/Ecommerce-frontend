import { useState } from 'react';
import MachineryDetailModal from './MachineryDetailModal';

const MachineryCard = ({ machinery }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle both images and images_urls from API
  const imageList = machinery.images_urls || machinery.images || [];
  const image = imageList.length > 0 
    ? imageList[0] 
    : 'https://via.placeholder.com/300x300?text=No+Image';

  return (
    <>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200">
        {/* Image Container */}
        <div 
          className="relative h-64 bg-gray-200 overflow-hidden cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <img
            src={image}
            alt={machinery.name}
            className="w-full h-full object-cover"
          />

          {/* Badge */}
          {machinery.discount_price && machinery.discount_price < machinery.price && (
            <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
              SALE
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Name */}
          <h3 className="font-bold text-gray-800 line-clamp-2">
            {machinery.name}
          </h3>

          {/* Description */}
          {machinery.short_description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {machinery.short_description}
            </p>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-red-600">
              ₹{machinery.discount_price || machinery.price}
            </span>
            {machinery.discount_price && (
              <span className="text-sm text-gray-400 line-through">
                ₹{machinery.price}
              </span>
            )}
          </div>

          {/* Quick Action Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
          >
            View Details
          </button>
        </div>
      </div>

      {/* Modal */}
      <MachineryDetailModal
        machinery={machinery}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default MachineryCard;

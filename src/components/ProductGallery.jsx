import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductGallery = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">No image available</span>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
        <div className="relative w-full h-full overflow-hidden">
  {/* Auto background from image */}
  <img
    src={images[currentIndex]}
    alt=""
    className="absolute inset-0 w-full h-full object-contain p-8 blur-xl scale-125 opacity-70"
  />

  {/* Main image */}
  <img
    src={images[currentIndex]}
    alt={`Product image ${currentIndex + 1}`}
    className="relative w-full h-full object-contain p-8"
  />
</div>


        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg lg:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronLeft className="h-6 w-6 text-gray-800" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg lg:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronRight className="h-6 w-6 text-gray-800" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex ? 'w-8 bg-gray-600' : 'w-2 bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex ? 'border-red-600' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="relative w-full h-full overflow-hidden rounded-lg">
  {/* Auto background */}
  <img
    src={image}
    alt=""
    className="absolute inset-0 w-full h-full object-cover blur-md scale-125 opacity-70"
  />

  {/* Thumbnail image */}
  <img
    src={image}
    alt={`Thumbnail ${index + 1}`}
    className="relative w-full h-full object-contain p-4"
  />
</div>

            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;

import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import useWishlistStore from '../store/useWishlistStore';
import { formatPrice, showToast } from '../utils/helpers';

const ProductCard = ({ product }) => {
  const addToWishlist = useWishlistStore(state => state.addItem);
  const removeFromWishlist = useWishlistStore(state => state.removeItem);
  const isInWishlist = useWishlistStore(state => state.isInWishlist(product.id));

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    if (isInWishlist) {
      removeFromWishlist(product.id);
      showToast('Removed from wishlist', 'success');
    } else {
      addToWishlist(product);
      showToast('Added to wishlist!', 'success');
    }
  };

  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-xl border border-gray-300 overflow-hidden transition-all duration-300 hover:-translate-y-1">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.images_urls[0] || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors z-10"
          >
            <Heart
              className={`h-5 w-5 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
            />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2">
  {product.discount_price ? (
    <>
      <span className="text-xl md:text-3xl font-bold text-red-600">
        {formatPrice(product.discount_price)}
      </span>

      <span className="text-md md:text-lg line-through text-gray-500">
        {formatPrice(product.price)}
      </span>
    </>
  ) : (
    <span className="text-xl md:text-3xl font-bold text-red-600">
      {formatPrice(product.price)}
    </span>
  )}
</div>

          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
            {product.name}
          </h3>

          {product.category && (
            <p className="text-sm text-gray-500 mb-2">{product.category}</p>
          )}

            
          {product.machine_type && (
  <div className="mt-3 flex flex-wrap gap-2">
    {product.machine_type === "Both" ? (
      <>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
          DST
        </span>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
          JEF
        </span>
      </>
    ) : (
      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
        {product.machine_type}
      </span>
    )}
  </div>
)}

        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

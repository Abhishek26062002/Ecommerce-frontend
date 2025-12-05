import { Trash2, Plus, Minus } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import { api } from '../utils/api';
import { formatPrice, showToast } from '../utils/helpers';

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem, setItemFormat, clearCart, addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const handleRemove = async () => {
    console.log('handleRemove called:', { isAuthenticated, productId: item.id, selectedFormat: item.selectedFormat });
    
    // For authenticated users, remove from backend and refresh cart
    if (isAuthenticated && item.id) {
      try {
        console.log('Removing from backend with productId:', item.id, 'format:', item.selectedFormat);
        await api.removeCartItem(item.id, item.selectedFormat);
        
        // Fetch updated server cart
        const userId = localStorage.getItem('userId');
        if (userId) {
          const serverData = await api.fetchCartItems(userId);
          const serverItems = Object.values(serverData || {});
          
          clearCart();
          for (const it of serverItems) {
            const productObj = {
              id: it.product_id,
              name: it.name,
              price: it.price ?? it.unit_price,
              discount_price: it.unit_price ?? it.price,
              machine_type: it.machine_type,
              selectedFormat: it.selected_format,
              image: it.image || (it.images_urls?.[0]) || null,
              images_urls: it.images_urls || [],
              cartItemId: it.id,
            };
            addItem(productObj);
            updateQuantity(it.product_id, it.quantity, it.selected_format);
          }
        }
        showToast('Item removed', 'success');
      } catch (err) {
        console.error('Error removing item:', err);
        showToast('Failed to remove item', 'error');
      }
    } else {
      // For guest users, remove from local store
      console.log('Removing from local store');
      removeItem(item.id, item.selectedFormat);
    }
  };

  const handleFormatChange = async (newFormat) => {
    console.log('handleFormatChange called:', { isAuthenticated, productId: item.id, newFormat });
    
    if (isAuthenticated && item.id) {
      try {
        console.log('Updating cart item format:', item.id, 'to', newFormat);
        await api.updateCartItem(item.id, null, newFormat);
        
        // Fetch updated server cart
        const userId = localStorage.getItem('userId');
        if (userId) {
          const serverData = await api.fetchCartItems(userId);
          const serverItems = Object.values(serverData || {});
          
          clearCart();
          for (const it of serverItems) {
            const productObj = {
              id: it.product_id,
              name: it.name,
              price: it.price ?? it.unit_price,
              discount_price: it.unit_price ?? it.price,
              machine_type: it.machine_type,
              selectedFormat: it.selected_format,
              image: it.image || (it.images_urls?.[0]) || null,
              images_urls: it.images_urls || [],
              cartItemId: it.id,
            };
            addItem(productObj);
            updateQuantity(it.product_id, it.quantity, it.selected_format);
          }
        }
        showToast('Format updated', 'success');
      } catch (err) {
        console.error('Error updating format:', err);
        showToast('Failed to update format', 'error');
      }
    } else {
      // For guest users, use local store format change
      setItemFormat(item.id, newFormat, item.selectedFormat);
    }
  };

  return (
    <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm">
      <img
        src={item.images_urls?.[0] || item.image || 'https://via.placeholder.com/100'}
        alt={item.name}
        className="w-20 h-20 object-cover rounded"
      />

      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{item.name}</h3>
        {item.category && <p className="text-sm text-gray-500">{item.category}</p>}
        <p className="text-red-600 font-bold mt-1">{formatPrice(item.discount_price ?? item.price)}</p>
        <div className="mt-2">
          <label className="text-xs text-gray-500 mr-2">Format:</label>
          <select
            value={item.selectedFormat ?? ''}
            onChange={(e) => handleFormatChange(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            {item.machine_type === 'Both' ? (
              <>
                <option value="DST">DST</option>
                <option value="JEF">JEF</option>
              </>
            ) : (
              <option value={item.machine_type}>{item.machine_type}</option>
            )}
          </select>
        </div>
      </div>

      <div className="text-right">
        <p className="font-bold text-gray-800">
          {formatPrice((item.discount_price ?? item.price) * item.quantity)}
        </p>
        <button
          onClick={handleRemove}
          className="text-red-600 hover:text-red-700 mt-2 flex items-center space-x-1"
        >
          <Trash2 className="h-4 w-4" />
          <span className="text-sm">Remove</span>
        </button>
      </div>
    </div>
  );
};

export default CartItem;

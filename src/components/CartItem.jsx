import { useState } from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import { api } from '../utils/api';
import { formatPrice, showToast } from '../utils/helpers';

const CartItem = ({ item }) => {
  console.log('CartItem render:', item);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdatingFormat, setIsUpdatingFormat] = useState(false);
  const { updateQuantity, removeItem, setItemFormat, clearCart, addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const handleRemove = async () => {
    console.log('handleRemove called:', { isAuthenticated, productId: item.id, selected_format: item.selected_format });
    setIsRemoving(true);
    
    // For authenticated users, remove from backend and refresh cart
    if (isAuthenticated && item.id) {
      try {
        console.log('Removing from backend with productId:', item.id, 'format:', item.selected_format);
        await api.removeCartItem(item.id, item.selected_format);
        
        // Fetch updated server cart
        const userId = localStorage.getItem('osa-userId');
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
              selected_format: it.selected_format,
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
      } finally {
        setIsRemoving(false);
      }
    } else {
      // For guest users, remove from local store
      console.log('Removing from local store');
      removeItem(item.id, item.selected_format);
      setIsRemoving(false);
    }
  };

  const handleFormatChange = async (newFormat) => {
    console.log('handleFormatChange called:', { isAuthenticated, productId: item.id, newFormat });
    setIsUpdatingFormat(true);
    
    if (isAuthenticated && item.id) {
      try {
        console.log('Updating cart item format:', item.id, 'to', newFormat);
        await api.updateCartItem(item.id, null, newFormat);
        
        // Fetch updated server cart
        const userId = localStorage.getItem('osa-userId');
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
              selected_format: it.selected_format,
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
      } finally {
        setIsUpdatingFormat(false);
      }
    } else {
      // For guest users, use local store format change
      setItemFormat(item.id, newFormat, item.selected_format);
      setIsUpdatingFormat(false);
    }
  };

  return (
    <div className="flex items-center space-x-4 bg-white p-4 rounded-lg border border-gray-200">
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
            value={item.selected_format ?? ''}
            onChange={(e) => handleFormatChange(e.target.value)}
            className="border rounded px-2 py-1 text-sm cursor-pointer"
          >
            {item.machine_type?.map((type) => (
              <option key={type} value={type}>{type.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="text-right">
        <p className="font-bold text-gray-800">
          {formatPrice(item.discount_price ?? item.price)}
        </p>
        <button
          onClick={handleRemove}
          disabled={isRemoving}
          className="text-red-600 hover:text-red-700 cursor-pointer mt-2 flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="h-4 w-4" />
          <span className="text-sm">{isRemoving ? 'Removing...' : 'Remove'}</span>
        </button>
      </div>

      {isRemoving && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="flex flex-col items-center">
            <div className="relative w-16 h-16">
              <svg className="animate-spin h-16 w-16 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="mt-4 text-white font-semibold">Removing from cart...</p>
          </div>
        </div>
      )}

      {isUpdatingFormat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="flex flex-col items-center">
            <div className="relative w-16 h-16">
              <svg className="animate-spin h-16 w-16 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="mt-4 text-white font-semibold">Updating format...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItem;

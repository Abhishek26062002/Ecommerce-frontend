import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const items = get().items;
        const existingItem = items.find(
          (item) => item.id === product.id && (item.selected_format ?? null) === (product.selected_format ?? null)
        );

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === product.id && (item.selected_format ?? null) === (product.selected_format ?? null)
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] });
        }
      },

      removeItem: (productId, selected_format) => {
        if (selected_format) {
          set({
            items: get().items.filter(
              (item) => !(item.id === productId && (item.selected_format ?? null) === selected_format)
            ),
          });
        } else {
          set({ items: get().items.filter((item) => item.id !== productId) });
        }
      },

      updateQuantity: (productId, quantity, selected_format) => {
        if (quantity <= 0) {
          get().removeItem(productId, selected_format);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === productId && (selected_format ? (item.selected_format ?? null) === selected_format : true)
              ? { ...item, quantity }
              : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.discount_price ?? item.price ?? 0;
          return total + price * item.quantity;
        }, 0);
      },

      // Change a cart item's selected_format.
      // If another item with the same productId and newFormat exists, merge quantities and remove the source.
      setItemFormat: (productId, newFormat, currentFormat) => {
        const items = get().items;
        // find source item (match currentFormat if provided, otherwise any matching id)
        const srcIndex = items.findIndex((item) =>
          item.id === productId && (currentFormat ? (item.selected_format ?? null) === currentFormat : true)
        );
        if (srcIndex === -1) return;
        const srcItem = items[srcIndex];
        if ((srcItem.selected_format ?? null) === newFormat) return; // nothing to do

        const targetIndex = items.findIndex(
          (item) => item.id === productId && (item.selected_format ?? null) === newFormat
        );

        if (targetIndex !== -1) {
          // merge quantities into existing target and remove source
          const newItems = items
            .map((item, i) => {
              if (i === targetIndex) {
                return { ...item, quantity: item.quantity + srcItem.quantity };
              }
              return item;
            })
            .filter((_, i) => i !== srcIndex);
          set({ items: newItems });
        } else {
          // update the source item's selected_format
          const newItems = items.map((item, i) => (i === srcIndex ? { ...item, selected_format: newFormat } : item));
          set({ items: newItems });
        }
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      // Format items for backend sync: { id, name, machine_type, unit_price, quantity }
      // quantity is sent as 1 per product-format as requested by backend shape
      getFormattedItems: () => {
        return get().items.map((item) => ({
          product_id: item.id,
          selected_format : item.selected_format ?? null,
          unit_price: parseFloat(item.discount_price ?? item.price ?? 0),
          quantity: 1,
        }));
      },
    }),
    {
      name: 'osa-cart-storage',
    }
  )
);

export default useCartStore;

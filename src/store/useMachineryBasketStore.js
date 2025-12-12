import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useMachineryBasketStore = create(
  persist(
    (set, get) => ({
      items: [],
      sidebarOpen: false,

      addItem: (machinery) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === machinery.id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === machinery.id
                ? { ...item, quantity: item.quantity + (machinery.quantity || 1) }
                : item
            ),
          });
        } else {
          set({
            items: [...items, { ...machinery, quantity: machinery.quantity || 1 }],
          });
        }
      },

      updateQuantity: (machineryId, quantity) => {
        if (quantity <= 0) {
          set({
            items: get().items.filter((item) => item.id !== machineryId),
          });
        } else {
          set({
            items: get().items.map((item) =>
              item.id === machineryId ? { ...item, quantity } : item
            ),
          });
        }
      },

      removeItem: (machineryId) => {
        set({
          items: get().items.filter((item) => item.id !== machineryId),
        });
      },

      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((sum, item) => {
          const price = item.discounted_price || item.price || 0;
          return sum + price * item.quantity;
        }, 0);
      },

      toggleSidebar: () => {
        set({ sidebarOpen: !get().sidebarOpen });
      },

      clearBasket: () => {
        set({ items: [], sidebarOpen: false });
      },

      getItemCount: () => {
        return get().items.length;
      },
    }),
    {
      name: 'osa-machinery-basket-storage',
    }
  )
);

export default useMachineryBasketStore;

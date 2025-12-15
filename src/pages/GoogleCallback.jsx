import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import useCartStore from "../store/useCartStore";       // cart store
import { showToast } from "../utils/helpers";
import { api } from "../utils/api";                     // API wrapper

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);

  const getFormattedItems = useCartStore((state) => state.getFormattedItems);
  const clearCart = useCartStore((state) => state.clearCart);
  const addToCart = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  useEffect(() => {
    const processCallback = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");
      const name = params.get("name");
      const email = params.get("email");
      const id = params.get("id"); // user_id

      if (token && email) {
        if (id) {
          localStorage.setItem("osa-userId", id);
        }

        login({ name, email }, token);
        showToast("Logged in successfully", "success");

        // ---- SYNC CART ITEMS IF EXISTS (push local -> backend) ----
        try {
          const formattedItems = getFormattedItems();
          console.log({ id, formattedItems });
          if (formattedItems.length > 0) {
            await api.addCartItems(id, formattedItems);
            // clear local guest cart after successful push
            clearCart();
            try { localStorage.removeItem('osa-cart-storage'); } catch(e) { /* ignore */ }
          }

          // ---- PULL backend cart and populate local cart ----
          try {
            const serverData = await api.fetchCartItems(id);
            // serverData expected as object keyed by cart item id
            const serverItems = Object.values(serverData || {});
            if (serverItems.length > 0) {
              // replace local cart with server items
              clearCart();
              try { localStorage.removeItem('osa-cart-storage'); } catch(e) { /* ignore */ }
              for (const it of serverItems) {
                // it has: product_id, name, machine_type, quantity, unit_price, etc.
                const productObj = {
                  id: it.product_id,
                  name: it.name,
                  price: it.price ?? it.unit_price,
                  discount_price: it.unit_price ?? it.price,
                  machine_type: it.machine_type,
                  selected_format: it.selected_format,
                };

                // add once then set correct quantity
                addToCart(productObj);
                // updateQuantity expects (productId, quantity, selected_format)
                updateQuantity(it.product_id, it.quantity, it.selected_format);
              }
            }
          } catch (err) {
            console.error("Error fetching server cart:", err);
          }
        } catch (error) {
          console.error("Error syncing cart:", error);
        }

        const redirectPath = localStorage.getItem("redirectPath") || "/";
        localStorage.removeItem("redirectPath");
        navigate(redirectPath, { replace: true });
      } else {
        showToast("Google login failed", "error");
        navigate("/login");
      }
    };

    processCallback();
  }, [location, login, navigate, getFormattedItems, clearCart]);

  return <p className="text-center mt-32">Signing you in...</p>;
};

export default GoogleCallback;


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.osaembroidery.com';

export const api = {
  async fetchProducts() {
    const response = await fetch(`${API_BASE_URL}/products/get_all_products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  async fetchProductById(id) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  },

  async fetchProductsByCategory(category) {
    const response = await fetch(`${API_BASE_URL}/products/category/${category}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  async fetchSubCategories(category) {
    const response = await fetch(`${API_BASE_URL}/products/get_sub_category_names/${category}`);
    if (!response.ok) throw new Error('Failed to fetch subcategories');
    return response.json();
  },

  async fetchProductsBySubCategory(category, subCategory) {
    const response = await fetch(`${API_BASE_URL}/products/category_wise/${category}/${subCategory}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  async fetchLatestProducts() {
    const response = await fetch(`${API_BASE_URL}/products/latest_products`);
    if (!response.ok) throw new Error('Failed to fetch latest products');
    return response.json();
  },

  async fetchProductsInfiniteScroll(limit = 50, offset = 0) {
    const response = await fetch(`${API_BASE_URL}/products/get_all_products_infinite_scroll?limit=${limit}&offset=${offset}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();
    console.log(data);
    return data;
  },

  async generateR2Urls(productId, expiry = 3600) {
    const response = await fetch(`${API_BASE_URL}/products/generate-r2-url/${productId}?expiry=${expiry}`);
    if (!response.ok) throw new Error('Failed to generate download URLs');
    return response.json();
  },

  async addCartItems(userId, items) {

console.log({user_id : userId, items});
    const response = await fetch(`${API_BASE_URL}/cart/${userId}/add_items`, {
      
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: userId,
        items
      })
    });

    if (!response.ok) throw new Error("Failed to sync cart items");
    return response.json();
  },

  async fetchCartItems(userId) {
    const response = await fetch(`${API_BASE_URL}/cart/items/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch cart items');
    return response.json();
  },

  async removeCartItem(itemId) {
    console.log("hi")
    const response = await fetch(`${API_BASE_URL}/cart/remove_item/${itemId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error("Failed to remove cart item");
    return response.status === 204 ? { success: true } : response.json();
  },

  async updateCartItem(productId, quantity = null, machineType = null) {
    console.log('Calling updateCartItem:', { productId, quantity, machineType });
    const params = new URLSearchParams();
    if (quantity !== null) params.append('quantity', quantity);
    if (machineType !== null) params.append('machine_type', machineType);
    
    const response = await fetch(`${API_BASE_URL}/cart/update_item/${productId}?${params.toString()}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error("Failed to update cart item");
    return response.json();
  },

  async createOrder(userId, items, paymentDetails) {
    const response = await fetch(`${API_BASE_URL}/orders/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: userId,
        items: items.map(item => ({
          product_id: item.id,
          machine_type: item.selected_format,
          qty: item.quantity,
          unit_price: item.discount_price ?? item.price
        })),
        payment_link_request: {
          customer_details: {
            name: paymentDetails.name,
            email: paymentDetails.email,
            phone: paymentDetails.phone
          },
          currency: "INR"
        }
      })
    });

    if (!response.ok) throw new Error("Failed to create order");
    return response.json();
  },

  async verifyPayment(orderId, paymentId, signature) {
    const response = await fetch(`${API_BASE_URL}/orders/verify-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        order_id: orderId,
        payment_id: paymentId,
        signature: signature
      })
    });

    if (!response.ok) throw new Error("Failed to verify payment");
    return response.json();
  },

  async verifyPaymentByPaymentId(paymentId, paymentStatus) {
    const response = await fetch(`${API_BASE_URL}/orders/verify-payment-by-id`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        payment_id: paymentId,
        payment_status: paymentStatus
      })
    });

    if (!response.ok) throw new Error("Failed to verify payment");
    return response.json();
  },

  async getOrders(userId) {
    console.log('Fetching orders for user:', userId);
    const response = await fetch(`${API_BASE_URL}/orders/get_orders/${userId}`);
    
    if (!response.ok) throw new Error("Failed to fetch orders");
    
    const data = await response.json();
    console.log('Full orders data:', data);
    
    return data;
  },

  async getOrderHistory(userId) {
    console.log('Fetching order history for user:', userId);
    const response = await fetch(`${API_BASE_URL}/orders/order_history/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) throw new Error("Failed to fetch order history");
    
    const data = await response.json();
    console.log('Order history response:', data);
    
    return data;
  },

  async getProductDownloadUrl(paymentId, productId, fileType) {
    console.log('Getting download URL for payment:', paymentId, 'product ID:', productId, 'file type:', fileType);
    const response = await fetch(`${API_BASE_URL}/products/product_download_urls/${paymentId}/${productId}/${fileType}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || `Failed to get ${fileType.toUpperCase()} download URL`);
    }
    
    const data = await response.json();
    console.log('Download URL response:', data);
    
    return data;
  },

  async fetchMachinery() {
    const response = await fetch(`${API_BASE_URL}/machines/get_all_machines`);
    if (!response.ok) throw new Error('Failed to fetch machinery');
    return response.json();
  },

   async fetchEmbroideryMachines() {
    const response = await fetch(`${API_BASE_URL}/embriodery_machines/get_machines`);
    if (!response.ok) throw new Error('Failed to fetch embroidery machines');
    const data = await response.json();
    console.log('Fetching embroidery machines data', data);
    return data;
  },

};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

export const showToast = (message, type = 'success') => {
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300 ${
<<<<<<< HEAD
    type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
=======
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
>>>>>>> 90c42162987c4e3cea6a537cf47863f0739dc0df
  } text-white`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 3000);
};
<<<<<<< HEAD

export const generateMachineryWhatsAppMessage = (items) => {
  const companyName = 'OSA Embroidery';
  const timestamp = new Date().toLocaleDateString('en-IN');
  
  // Header
  let message = `*${companyName} - Machinery Order Request*\n`;
  message += `📅 Date: ${timestamp}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n\n`;

  // Items
  message += `*Order Items:*\n`;
  items.forEach((item, index) => {
    const price = item.discounted_price || item.price;
    const subtotal = price * item.quantity;
    message += `${index + 1}. ${item.name}\n`;
    message += `   Quantity: ${item.quantity}\n`;
    message += `   Price: ₹${price} × ${item.quantity} = ₹${subtotal}\n\n`;
  });

  // Total
  const total = items.reduce((sum, item) => {
    const price = item.discounted_price || item.price;
    return sum + price * item.quantity;
  }, 0);

  message += `━━━━━━━━━━━━━━━━━━━━\n`;
  message += `*Total Amount: ₹${total}*\n\n`;

  // Request details
  message += `*Please Provide:*\n`;
  message += `• Delivery Address\n`;
  message += `• Contact Number\n`;
  message += `• Preferred Delivery Date\n\n`;

  // Footer
  message += `*Thank you for choosing OSA Embroidery!*\n`;
  message += `We will get back to you shortly with quotation and delivery details.`;

  return message;
};

=======
>>>>>>> 90c42162987c4e3cea6a537cf47863f0739dc0df

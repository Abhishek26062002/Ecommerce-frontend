const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '+918985648864';

export const buildWhatsAppLink = (cart) => {
  const number = WHATSAPP_NUMBER.replace(/[^0-9]/g, '');

  const lines = cart.map(
    item => `• ${item.name} (ID:${item.id}) – ₹${item.price} x ${item.quantity} = ₹${item.price * item.quantity}`
  ).join('%0A');

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const text = `Hi! I would like to order from OSA Embroidery:%0A%0A${lines}%0A%0ATotal: ₹${total}%0A%0APlease confirm availability and delivery details.`;

  return `https://wa.me/${number}?text=${text}`;
};

export const openWhatsApp = (cart) => {
  const link = buildWhatsAppLink(cart);
  window.open(link, '_blank');
};

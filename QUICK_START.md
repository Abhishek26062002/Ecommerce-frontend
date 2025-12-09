# 🚀 Quick Reference - Payment Implementation

## Frontend Status: ✅ COMPLETE

Everything needed on the frontend is ready to use.

## Backend Status: ⚠️ ACTION REQUIRED

You need to implement 2 endpoints in your FastAPI backend.

---

## What Happens When User Clicks "Pay Now"

```
1. CheckoutModal collects: name, email, phone
2. Frontend calls: POST /orders/create-order
   
   Expected Request Body:
   {
     "user_id": "user_id",
     "order_id": "ORD-timestamp",
     "items": [
       {
         "product_id": "...",
         "machine_type": "DST/JEF",
         "qty": 1,
         "unit_price": 399
       }
     ],
     "payment_link_request": {
       "amount": 39900,  // in paise
       "customer_details": {
         "name": "...",
         "email": "...",
         "phone": "..."
       },
       "currency": "INR"
     }
   }

3. Backend should:
   - Create order in DB (status="pending")
   - Create Razorpay payment link
   - Return payment link to frontend

   Expected Response:
   {
     "order_id": "ORD-xxx",
     "status": "created",
     "payment_link": "https://rzp.io/i/abc123",
     "amount": 39900
   }

4. Frontend redirects to payment_link

5. User pays on Razorpay

6. Razorpay redirects back to: /payment-success?razorpay_payment_id=pay_xxx&razorpay_payment_link_status=paid

7. Frontend calls: POST /orders/verify-payment-by-id
   
   Expected Request Body:
   {
     "payment_id": "pay_xxx",
     "payment_status": "paid"
   }

8. Backend should:
   - Verify payment with Razorpay
   - Update order status="paid"
   - Return order details

   Expected Response:
   {
     "success": true,
     "status": "paid",
     "order_id": "ORD-xxx"
   }

9. Frontend clears cart and shows success page
```

---

## Minimal Backend Implementation

### Python/FastAPI

```python
import razorpay

@router.post("/orders/create-order")
async def create_order(payload: dict):
    # 1. Create order in DB
    order = Order(
        id=payload["order_id"],
        user_id=payload["user_id"],
        total_amount=payload["payment_link_request"]["amount"] / 100,
        status="pending"
    )
    db.add(order)
    db.commit()
    
    # 2. Create Razorpay payment link
    client = razorpay.Client(auth=(KEY_ID, KEY_SECRET))
    link = client.payment_link.create(
        amount=int(payload["payment_link_request"]["amount"]),
        currency="INR",
        notes={"order_id": order.id, "user_id": payload["user_id"]}
    )
    
    # 3. Return payment link
    return {
        "order_id": order.id,
        "status": "created",
        "payment_link": link["short_url"],
        "amount": int(payload["payment_link_request"]["amount"])
    }


@router.post("/orders/verify-payment-by-id")
async def verify_payment(payload: dict):
    payment_id = payload["payment_id"]
    
    # 1. Get payment details from Razorpay
    client = razorpay.Client(auth=(KEY_ID, KEY_SECRET))
    payment = client.payment.fetch(payment_id)
    
    # 2. Get order ID from notes
    order_id = payment["notes"].get("order_id")
    
    # 3. Update order status
    order = db.get(Order, order_id)
    order.status = "paid"
    db.commit()
    
    # 4. Return success
    return {
        "success": True,
        "status": "paid",
        "order_id": order_id
    }
```

---

## Frontend Methods Available

**In Cart.jsx:**
```javascript
// User clicks checkout
handleCheckoutClick()
  ↓
// Opens modal
setShowCheckout(true)
  ↓
// On payment success
handlePaymentSuccess(orderId)
  ↓
// Clears cart and redirects
clearCart()
navigate('/orders')
```

**In CheckoutModal.jsx:**
```javascript
// Form submission
handleCheckout()
  ↓
// Creates order
api.createOrder(userId, items, formData)
  ↓
// Redirects to payment
window.location.href = paymentLink
```

**In PaymentSuccess.jsx:**
```javascript
// Verifies payment
api.verifyPaymentByPaymentId(paymentId, status)
  ↓
// Clears cart
clearCart()
localStorage.removeItem('osa-cart-storage')
  ↓
// Redirects to orders
navigate('/orders')
```

---

## Files Changed/Created

**Modified:**
- ✏️ `src/pages/Cart.jsx` - Added checkout button
- ✏️ `src/utils/api.js` - Added payment methods
- ✏️ `src/App.jsx` - Added payment routes

**Created:**
- 📄 `src/components/CheckoutModal.jsx` - Checkout form
- 📄 `src/pages/PaymentSuccess.jsx` - Success page
- 📄 `src/pages/PaymentFailed.jsx` - Failure page
- 📄 `BACKEND_PAYMENT_SETUP.md` - Backend guide

---

## Test Card (Razorpay Sandbox)

```
Number:  4111 1111 1111 1111
Expiry:  12/25
CVV:     123
OTP:     123456
```

---

## Production Checklist

- [ ] Backend endpoints implemented
- [ ] Razorpay account created
- [ ] API keys configured in .env
- [ ] Test payment successful
- [ ] Order marked as "paid" in database
- [ ] Cart clears after payment
- [ ] Success page shows
- [ ] Email sent to customer
- [ ] Orders page working
- [ ] Mobile testing done
- [ ] Razorpay KYC complete
- [ ] Switch to live keys
- [ ] First real transaction tested

---

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Payment link not working | Check Razorpay keys |
| Order not marked as paid | Implement verify endpoint |
| Cart not clearing | Call `clearCart()` in PaymentSuccess |
| Success page blank | Check `/payment-success` route exists |
| Session lost after redirect | Store in sessionStorage, not just state |

---

## That's It! 🎉

Just implement the 2 backend endpoints and you're done.

For detailed backend code, see: `BACKEND_PAYMENT_SETUP.md`

# 🎨 Visual Payment Flow Guide

## Simple Visual Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER JOURNEY                              │
└─────────────────────────────────────────────────────────────────┘

STEP 1: CHECKOUT
┌──────────────────┐
│  Shopping Cart   │
│                  │
│ [Proceed →]      │  ← Click this
└──────────────────┘
         ↓

STEP 2: ENTER DETAILS
┌──────────────────────────────┐
│  Checkout Modal              │
│                              │
│  Name: John Doe              │
│  Email: john@example.com     │
│  Phone: 9876543210           │
│                              │
│  [Pay $399] →                │  ← Click this
└──────────────────────────────┘
         ↓

STEP 3: RAZORPAY PAYMENT
┌──────────────────────────────┐
│  Razorpay Payment Form       │
│                              │
│  💳 Card Details             │
│  📱 UPI ID                   │
│  🏦 Net Banking              │
│                              │
│  [Pay Now] →                 │  ← Click this
└──────────────────────────────┘
         ↓

STEP 4: PAYMENT PROCESSING
    Razorpay servers process payment
         ↓
    ✅ PAYMENT SUCCESS
         ↓

STEP 5: REDIRECT BACK
┌──────────────────────────────┐
│  /payment-success page       │
│                              │
│  ✅ Payment Successful!      │
│  Order ID: ORD-123456        │
│                              │
│  [View Orders] →             │
└──────────────────────────────┘
         ↓

STEP 6: DOWNLOAD DESIGNS
┌──────────────────────────────┐
│  My Orders Page              │
│                              │
│  Order: ORD-123456           │
│  Status: Paid ✅             │
│                              │
│  [Download] → Design files   │
└──────────────────────────────┘
```

---

## Technical Flow

```
FRONTEND                   BACKEND                  RAZORPAY
   │                         │                         │
   │──POST /create-order───→│                          │
   │  (order data)          │                          │
   │                        │──POST /payment/link──→  │
   │                        │  (create link)          │
   │                        │                 (returns link)
   │                        │                         │
   │←──payment_link────────│                          │
   │                        │                          │
   └────Redirect to link─────────────────────────→   │
   │                        │                         │
   │                        │              (User pays)
   │                        │                         │
   │←────Redirect to success page────────────────────┤
   │  (?razorpay_payment_id=pay_xxx)
   │
   │──POST /verify-payment─→│
   │  (payment_id)          │
   │                        │──GET /payment/fetch──→  │
   │                        │  (verify payment)       │
   │                        │               (returns payment data)
   │                        │
   │                        │──UPDATE order status──┐ │
   │                        │  to "paid"            │ │
   │                        │←─────────────────────┘ │
   │                        │                        │
   │←──success response────│                        │
   │
   ├─Clear cart
   ├─Show success
   └─Redirect to /orders
```

---

## What Happens at Each Stage

### Stage 1: Cart Page
```
✅ User has items in cart
✅ User clicks "Proceed to Checkout"
→ CheckoutModal opens
```

### Stage 2: Form Entry
```
✅ Modal shows order summary
✅ Form fields for name, email, phone
✅ User enters details
✅ Form validates input
✅ User clicks "Pay Now"
→ Order sent to backend
```

### Stage 3: Backend Processing
```
✅ Backend receives order
✅ Creates order in database (status="pending")
✅ Creates Razorpay payment link
✅ Returns payment link to frontend
→ Frontend redirects to payment
```

### Stage 4: Razorpay Payment
```
✅ User sees Razorpay payment form
✅ User enters card/UPI details
✅ User completes verification
✅ Razorpay processes payment
✅ Payment successful
→ Razorpay redirects to success URL
```

### Stage 5: Success Page
```
✅ PaymentSuccess component loads
✅ Extracts payment ID from URL
✅ Calls backend verify endpoint
⏳ WAITING FOR BACKEND: Verify payment
⏳ WAITING FOR BACKEND: Update order status
→ After verification: clear cart & show success
```

### Stage 6: Order Confirmation
```
⏳ WAITING FOR BACKEND to:
   - Verify payment
   - Update order status
   - Allow frontend to show success
→ User redirects to orders page
```

### Stage 7: Downloads
```
✅ User sees paid order
✅ User can download designs
✅ Flow complete
```

---

## Current Status: You Are Here 👈

```
┌──────────────────────────────────────────────────────────┐
│ Cart    → Form    → Razorpay → Success → Verify → Orders│
│  ✅     ✅       ✅         ✅      ⏳      ⏳       │
│                                      ↑                    │
│                                 YOU ARE HERE             │
│                                 (waiting for backend)    │
└──────────────────────────────────────────────────────────┘
```

✅ = Completed
⏳ = Waiting for backend
❌ = Not started

---

## Data Flow Diagram

```
USER SUBMITS ORDER
    ↓
Frontend creates object:
{
  user_id: "user_123",
  order_id: "ORD-1234",
  items: [
    {product_id, machine_type, qty, unit_price}
  ],
  payment_link_request: {
    amount: 39900,
    customer_details: {name, email, phone},
    currency: "INR"
  }
}
    ↓
POST /orders/create-order
    ↓
BACKEND receives order
    ↓
Database stores order (status="pending")
Database stores order items
    ↓
Razorpay creates payment link
    ↓
Backend returns:
{
  order_id: "ORD-1234",
  payment_link: "https://rzp.io/i/abc123",
  status: "created"
}
    ↓
Frontend redirects:
window.location.href = payment_link
    ↓
USER ON RAZORPAY FORM
    ↓
USER PAYS MONEY
    ↓
RAZORPAY SUCCEEDS
    ↓
Razorpay redirects:
https://yourapp.com/payment-success?
  razorpay_payment_id=pay_xxx
  &razorpay_payment_link_status=paid
    ↓
FRONTEND RECEIVES URL
    ↓
Extracts payment_id from URL
    ↓
POST /orders/verify-payment-by-id
{
  payment_id: "pay_xxx",
  payment_status: "paid"
}
    ↓
⏳ BACKEND SHOULD:
    1. Fetch payment from Razorpay
    2. Verify it's paid
    3. Find order_id from notes
    4. Update order status="paid"
    5. Return success
    ↓
⏳ FRONTEND THEN:
    1. Clears cart
    2. Shows success page
    3. Redirects to /orders
    ↓
✅ USER SEES ORDERS
    ↓
✅ USER DOWNLOADS
```

---

## Component Relationship

```
App.jsx
├── Cart.jsx
│   └── CheckoutModal.jsx ← Modal here
│       └── api.createOrder()
│
├── PaymentSuccess.jsx (when redirected from Razorpay) ← Here
│   └── api.verifyPaymentByPaymentId()
│
└── PaymentFailed.jsx (if payment fails)
```

---

## Database State Changes

```
BEFORE CHECKOUT:
No orders for user

AFTER FORM SUBMITTED:
Order created:
{
  id: "ORD-1234",
  user_id: "user_123",
  status: "pending",        ← Still pending
  total_amount: 399,
  razorpay_payment_id: null ← Not paid yet
}

AFTER PAYMENT:
⏳ Need backend to update:
{
  id: "ORD-1234",
  user_id: "user_123",
  status: "paid",           ← Changed to paid
  total_amount: 399,
  razorpay_payment_id: "pay_Rm4HPme1EwPKxn" ← Added payment ID
}
```

---

## What Each Component Does

### CheckoutModal.jsx
```javascript
handleCheckout() {
  1. Validate form
  2. Call api.createOrder()
  3. Get payment_link from backend
  4. Store orderId in sessionStorage
  5. Redirect: window.location.href = paymentLink
}
```

### PaymentSuccess.jsx
```javascript
useEffect() {
  1. Extract payment_id from URL
  2. Get order_id from sessionStorage
  3. Call api.verifyPaymentByPaymentId(paymentId)
  4. Wait for backend verification
  5. If success: clearCart() & navigate('/orders')
  6. If error: navigate('/cart')
}
```

### Backend Endpoint (verify-payment-by-id)
```python
verify_payment_by_id(payment_id) {
  1. Fetch payment from Razorpay
  2. Extract order_id from payment.notes
  3. Verify payment.status == "captured"
  4. Update order.status = "paid"
  5. Commit to database
  6. Return {success: true, order_id: ...}
}
```

---

## You Are Here 📍

```
START
  ↓
Click Checkout ✅
  ↓
Fill Form ✅
  ↓
Create Order ✅
  ↓
Redirect to Razorpay ✅
  ↓
Pay on Razorpay ✅
  ↓
Razorpay Redirects ✅
  ↓
PaymentSuccess Page Loads ✅
  ↓
← YOU ARE HERE - FRONTEND WAITING FOR BACKEND
  ↓
  ⏳ Verify with Backend (NOT IMPLEMENTED YET)
  ↓
  ⏳ Clear Cart (WAITING FOR BACKEND)
  ↓
  ⏳ Show Success (WAITING FOR BACKEND)
  ↓
  ⏳ Redirect to Orders (WAITING FOR BACKEND)
  ↓
END
```

---

## Summary

1. ✅ **Frontend**: 100% Done & Working
2. ⏳ **Razorpay**: Working (confirmed by redirect)
3. ❌ **Backend Endpoint**: Missing (needs implementation)

**Next Step**: Implement `/orders/verify-payment-by-id` endpoint

See: **BACKEND_PAYMENT_SETUP.md**

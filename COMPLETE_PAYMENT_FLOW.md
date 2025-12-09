# Payment Flow - Complete Implementation Guide

## Current Status ✅

Payment integration is fully implemented with Razorpay payment links. Here's the complete flow:

## Step-by-Step Payment Flow

### 1. User Initiates Checkout
```
Cart Page → "Proceed to Checkout" button
  ↓
CheckoutModal opens with:
  - Order summary
  - Customer details form (name, email, phone)
  - "Pay Now" button
```

### 2. User Submits Order
```
CheckoutModal form validation
  ↓
Sends POST to /orders/create-order with:
{
  "user_id": "user_123",
  "order_id": "ORD-1234567890",
  "items": [...],
  "payment_link_request": {
    "amount": 39900,  // in paise
    "customer_details": { "name": "...", "email": "...", "phone": "..." },
    "currency": "INR"
  }
}
```

### 3. Backend Creates Payment Link
```
Backend creates Razorpay payment link
  ↓
Returns to frontend:
{
  "order_id": "ORD-1234567890",
  "status": "created",
  "payment_link": "https://rzp.io/i/abc123xyz"
}
```

### 4. Frontend Redirects to Payment
```
Frontend stores order ID in sessionStorage
  ↓
window.location.href = paymentLink
  ↓
User redirected to Razorpay payment form
  ↓
User enters payment details and submits
```

### 5. Razorpay Processes Payment
```
Razorpay server processes payment
  ↓
If SUCCESSFUL:
  Razorpay redirects to: /payment-success?razorpay_payment_id=...&razorpay_payment_link_status=paid
  
If FAILED/CANCELLED:
  User sees options to retry or go back
```

### 6. Frontend Handles Success
```
PaymentSuccess component receives URL params
  ↓
Extracts payment ID and status from URL
  ↓
Gets order ID from sessionStorage
  ↓
Clears cart from localStorage
  ↓
Shows success confirmation with order ID
  ↓
Auto-redirects to /orders page after 3 seconds
```

### 7. Order is Marked as Paid
```
Order status updated in database: "pending" → "paid"
User can download designs immediately
Email confirmation sent to customer
```

## API Flow Diagram

```
FRONTEND                          BACKEND                         RAZORPAY
   │                               │                               │
   ├─ POST /orders/create-order ──→│                               │
   │  (order & customer details)    │                               │
   │                                ├─ Create order in DB          │
   │                                ├─ Create payment link ───────→│
   │                                │                  (gets payment_link)
   │  ← {payment_link} ─────────────┤                               │
   │                                │                               │
   ├─ Redirect to payment_link ─────────────────────────────────→ Razorpay Form
   │                                │                               │
   │                                │                          (User pays)
   │                                │                               │
   │← Redirect to /payment-success + params ─────────────────────┤
   │ (with razorpay_payment_id, status=paid)                       │
   │                                │                               │
   ├─ Extract payment_id & order_id │                               │
   │                                │                               │
   └─ POST /orders/verify-payment-by-id ──→ │ Update order status  │
      (verify & get order ID)              │ to "paid"             │
      ← {success, order_id} ────────────────┤                       │
   │                                │                               │
   ├─ Clear cart                    │                               │
   ├─ Show success page             │                               │
   └─ Redirect to /orders           │                               │
```

## Key Components

### 1. CheckoutModal.jsx
- Form validation
- Order creation
- Stores order ID in session
- Redirects to payment link

### 2. PaymentSuccess.jsx
- Receives Razorpay redirect parameters
- Verifies payment with backend
- Clears cart
- Shows confirmation
- Auto-redirects to orders

### 3. PaymentFailed.jsx
- Shows failure message
- Allows retry (cart items saved)
- Support contact info

### 4. Cart.jsx
- Shows checkout button
- Opens CheckoutModal on click

## URL Parameters Received from Razorpay

```
https://localhost:5173/payment-success?
  razorpay_payment_id=pay_Rm4HPme1EwPKxn
  &razorpay_payment_link_id=plink_Rm4Grx5MYkNqS2
  &razorpay_payment_link_reference_id=
  &razorpay_payment_link_status=paid
  &razorpay_signature=9bfb908ed449be854e0b311882c4786767ff1db95bbafbc3c16a08f711bf6430
```

- `razorpay_payment_id` - Payment transaction ID (used to verify)
- `razorpay_payment_link_status` - Status: "paid", "expired", "cancelled"
- `razorpay_signature` - For signature verification (optional)

## Backend Endpoints Required

### 1. POST /orders/create-order
Creates order and generates Razorpay payment link

**Request:**
```json
{
  "user_id": "user_123",
  "order_id": "ORD-1234567890",
  "items": [
    {
      "product_id": "prod_1",
      "machine_type": "DST",
      "qty": 1,
      "unit_price": 399
    }
  ],
  "payment_link_request": {
    "amount": 39900,
    "customer_details": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210"
    },
    "currency": "INR"
  }
}
```

**Response:**
```json
{
  "order_id": "ORD-1234567890",
  "status": "created",
  "payment_link": "https://rzp.io/i/abc123xyz",
  "amount": 39900
}
```

### 2. POST /orders/verify-payment-by-id
Verifies payment and retrieves order ID

**Request:**
```json
{
  "payment_id": "pay_Rm4HPme1EwPKxn",
  "payment_status": "paid"
}
```

**Response:**
```json
{
  "success": true,
  "status": "paid",
  "order_id": "ORD-1234567890"
}
```

## Testing the Flow

### Step 1: Test Razorpay Setup
```bash
curl -X POST http://localhost:8000/orders/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "order_id": "TEST-001",
    "items": [{"product_id": "test_prod", "machine_type": "DST", "qty": 1, "unit_price": 100}],
    "payment_link_request": {
      "amount": 10000,
      "customer_details": {"name": "Test User", "email": "test@example.com", "phone": "9876543210"},
      "currency": "INR"
    }
  }'
```

Expected response:
```json
{
  "order_id": "TEST-001",
  "status": "created",
  "payment_link": "https://rzp.io/i/xxxxx"
}
```

### Step 2: Test Payment in Browser
1. Copy the `payment_link` from response
2. Open it in browser
3. Use Razorpay test credentials:
   - Card: 4111 1111 1111 1111
   - Expiry: Any future date (e.g., 12/25)
   - CVV: Any 3 digits (e.g., 123)
   - OTP: 123456

### Step 3: Verify Success Page
After payment, you should be redirected to:
```
/payment-success?razorpay_payment_id=pay_xxxx&razorpay_payment_link_status=paid...
```

Success page should:
- Show order confirmation
- Display order ID
- Clear cart
- Auto-redirect to /orders

## Important Notes

✅ **Order ID Storage:**
- Stored in `sessionStorage` before redirecting to payment
- Retrieved on success page
- Used to mark order as paid in database

✅ **Cart Clearing:**
- Clears Zustand store
- Clears localStorage ("osa-cart-storage")
- User needs to re-add items if payment fails

✅ **Email Notifications:**
- Configure in Razorpay dashboard
- Automatic email sent on successful payment
- Can add custom email logic in backend

✅ **Mobile Responsive:**
- Razorpay payment form works on all devices
- PaymentSuccess page is mobile friendly

✅ **Security:**
- Payment link expires after 15 minutes (configurable)
- Razorpay handles all payment security
- Backend verifies payment status from Razorpay

## Troubleshooting

### Issue: Order ID not found on success page
**Solution:** Ensure `sessionStorage.setItem('orderId', ...)` is called before redirect

### Issue: Payment link not working
**Solution:** Check Razorpay credentials (Key ID, Key Secret)

### Issue: Cart not clearing
**Solution:** Verify both `clearCart()` and `localStorage.removeItem()` are called

### Issue: Redirect loop
**Solution:** Check that payment_link URL is valid and accessible

---

**All components are ready to use!** Just ensure your backend has the required endpoints configured.

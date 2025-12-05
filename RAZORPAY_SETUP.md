# Razorpay Payment Integration Setup Guide

This guide will help you set up Razorpay payment processing in the OSA Client application.

## Prerequisites

- Razorpay account (sign up at https://razorpay.com)
- FastAPI backend with order endpoints configured
- React client application running

## Step 1: Get Razorpay Credentials

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Navigate to Settings → API Keys
3. Copy your **Key ID** (public key)
4. Keep your **Key Secret** secure on the backend

## Step 2: Configure Frontend Environment

1. Copy `.env.example` to `.env.local` in the `OSA_CLIENT` folder:
   ```bash
   cp .env.example .env.local
   ```

2. Update the `.env.local` file with your Razorpay Key ID:
   ```
   VITE_RAZORPAY_KEY_ID=rzp_test_1234567890abcd
   VITE_API_BASE_URL=https://your-api-url.com
   ```

## Step 3: Backend Configuration

Your FastAPI backend needs the following endpoints:

### Create Order Endpoint
**POST** `/orders`
```json
Request:
{
  "user_id": "user_123",
  "order_id": "ORD-1234567890",
  "items": [
    {
      "product_id": "prod_123",
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

Response:
{
  "order_id": "ORD-1234567890",
  "status": "created",
  "amount": 39900
}
```

### Verify Payment Endpoint
**POST** `/orders/verify-payment`
```json
Request:
{
  "order_id": "ORD-1234567890",
  "payment_id": "pay_1234567890abcd",
  "signature": "razorpay_signature_here"
}

Response:
{
  "success": true,
  "status": "paid",
  "order_id": "ORD-1234567890"
}
```

## Step 4: Backend Razorpay Integration

Install Razorpay Python SDK:
```bash
pip install razorpay
```

Example FastAPI implementation:

```python
import razorpay
from fastapi import APIRouter

razorpay_client = razorpay.Client(
    auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
)

@router.post("/orders/verify-payment")
async def verify_payment(payload: dict, db: AsyncSession = Depends(get_db)):
    try:
        # Verify payment signature
        is_valid = razorpay_client.utility.verify_payment_signature({
            'razorpay_order_id': payload['order_id'],
            'razorpay_payment_id': payload['payment_id'],
            'razorpay_signature': payload['signature']
        })
        
        if is_valid:
            # Update order status to paid
            order = await db.get(Order, payload['order_id'])
            order.status = 'paid'
            await db.commit()
            return {"success": True, "status": "paid"}
        else:
            return {"success": False, "status": "failed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

## Step 5: Frontend Flow

The payment flow works as follows:

1. **User clicks "Proceed to Checkout"** → CheckoutModal opens
2. **User fills billing details** → Name, Email, Phone
3. **User confirms order** → Creates order on backend, loads Razorpay
4. **Razorpay payment gateway opens** → User enters card/UPI details
5. **Payment completes** → Verification on backend
6. **Cart cleared & order confirmed** → Redirect to orders page

## Step 6: Testing

### Test Credentials (Razorpay Sandbox)
- **Card Number**: 4111 1111 1111 1111
- **Expiry**: Any future date (e.g., 12/25)
- **CVV**: Any 3 digits (e.g., 123)
- **OTP**: 123456

### Test Payment Links
- Use Key ID in test mode: `rzp_test_*`
- Test payments will not charge your account

## Step 7: Going Live

1. Complete KYC on Razorpay
2. Switch from test keys to live keys in dashboard
3. Update `.env.local` with live Key ID
4. Update backend with live Key Secret
5. Change test credentials to live ones

## File Structure

```
OSA_CLIENT/
├── src/
│   ├── components/
│   │   └── CheckoutModal.jsx       # Checkout form & payment
│   ├── pages/
│   │   └── Cart.jsx                 # Updated with checkout button
│   ├── utils/
│   │   └── api.js                   # Order & payment APIs
│   └── store/
│       └── useCartStore.js          # Cart state management
├── .env.example                      # Environment variables template
└── .env.local                        # Your actual keys (git ignored)
```

## Troubleshooting

### "Razorpay is not defined"
- Ensure Razorpay script is loaded: `https://checkout.razorpay.com/v1/checkout.js`
- Check browser console for script loading errors

### Payment verification fails
- Verify payment signature on backend with correct credentials
- Check order ID matches payment order ID
- Ensure Key Secret is correct

### Order not created
- Check backend `/orders` endpoint is working
- Verify payload format matches schema
- Check database connection

### Recurring Issues?
Contact Razorpay support: support@razorpay.com

---

## Additional Resources

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay Integration Guide](https://razorpay.com/docs/payment-gateway/web-standard/integration-steps/)
- [Test Credentials](https://razorpay.com/docs/testing/)

# Payment Integration - Backend Configuration

## Frontend Payment Flow

1. User clicks "Proceed to Checkout" in cart
2. CheckoutModal opens with order summary and billing details
3. User submits form → calls `POST /orders/create-order` endpoint
4. Backend creates Razorpay payment link and returns it
5. Frontend redirects to payment link: `window.location.href = paymentLink`
6. User completes payment on Razorpay
7. Razorpay redirects back to success/failure page

## Razorpay Redirect URL Parameters

After payment, Razorpay redirects to `/payment-success` with these parameters:

```
https://localhost:5173/payment-success?
  razorpay_payment_id=pay_Rm4HPme1EwPKxn
  &razorpay_payment_link_id=plink_Rm4Grx5MYkNqS2
  &razorpay_payment_link_reference_id=
  &razorpay_payment_link_status=paid
  &razorpay_signature=9bfb908ed449be854e0b311882c4786767ff1db95bbafbc3c16a08f711bf6430
```

The frontend extracts:
- `razorpay_payment_id` - Payment transaction ID
- `razorpay_payment_link_status` - Status of payment (paid/expired/cancelled)
- Gets order ID from sessionStorage (set before checkout)

### 2. Backend Endpoint for Payment Verification by Payment ID

Add this new endpoint to handle verification when order ID is not in session:

```python
@router.post("/orders/verify-payment-by-id")
async def verify_payment_by_id(payload: dict, db: AsyncSession = Depends(get_db)):
    """
    Verify payment using just the payment ID.
    This is called when redirected from Razorpay without order ID.
    """
    try:
        payment_id = payload.get("payment_id")
        payment_status = payload.get("payment_status")
        
        # Fetch payment from Razorpay to get order details
        payment_details = razorpay_client.payment.fetch(payment_id)
        
        # Get the notes which should contain order_id
        notes = payment_details.get('notes', {})
        order_id = notes.get('order_id')
        
        if not order_id:
            # Try to find order by payment ID
            order = await db.execute(
                select(Order).where(Order.razorpay_payment_id == payment_id)
            )
            order = order.scalar_one_or_none()
            
            if not order:
                return {
                    "success": False,
                    "message": "Order not found for this payment"
                }
            order_id = order.id
        
        # Update order status if payment is successful
        if payment_status == 'paid' or payment_details.get('status') == 'captured':
            order = await db.get(Order, order_id)
            if order:
                order.status = 'paid'
                order.razorpay_payment_id = payment_id
                await db.commit()
            
            return {
                "success": True,
                "status": "paid",
                "order_id": order_id
            }
        else:
            return {
                "success": False,
                "status": payment_status,
                "message": "Payment not successful"
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### 1. Update Order Creation Endpoint

When creating a Razorpay payment link, add these redirect URLs:

```python
from razorpay import Client as RazorpayClient

razorpay_client = RazorpayClient(
    auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
)

@router.post("/orders/create-order")
async def create_order(payload: OrderCreateSchema, db: AsyncSession = Depends(get_db)):
    try:
        # Create order in database
        new_order = Order(
            id=payload.order_id,
            user_id=payload.user_id,
            total_amount=payload.payment_link_request.amount / 100,  # Convert from paise
            status="pending"
        )
        db.add(new_order)
        await db.commit()
        
        # Add order items
        for item in payload.items:
            order_item = OrderItem(
                order_id=new_order.id,
                product_id=item.product_id,
                machine_type=item.machine_type,
                quantity=item.qty,
                price=item.unit_price
            )
            db.add(order_item)
        await db.commit()
        
        # Create Razorpay payment link
        payment_link_response = razorpay_client.payment_link.create(
            amount=int(payload.payment_link_request.amount),  # Amount in paise
            currency=payload.payment_link_request.currency,
            accept_partial=False,
            first_min_partial_amount=0,
            description="OSA Embroidery Designs",
            customer_notify=1,
            notify={
                "sms": True,
                "email": True
            },
            reminder_enable=True,
            notes={
                "order_id": new_order.id,
                "user_id": payload.user_id
            },
            callback_url="https://yourdomain.com/payment-success",  # Optional webhook
            callback_method="get",
            upi_link=False,
            whatsapp_link=False
        )
        
        # Return payment link
        return {
            "order_id": new_order.id,
            "status": "created",
            "payment_link": payment_link_response["short_url"],
            "amount": int(payload.payment_link_request.amount)
        }
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
```

### 2. Update Payment Verification Endpoint

After user completes payment, Razorpay will include order and payment details:

```python
@router.post("/orders/verify-payment")
async def verify_payment(payload: PaymentVerificationSchema, db: AsyncSession = Depends(get_db)):
    try:
        # Verify payment with Razorpay
        payment_details = razorpay_client.payment.fetch(payload.payment_id)
        
        if payment_details.get('status') == 'captured':
            # Update order status
            order = await db.get(Order, payload.order_id)
            if order:
                order.status = 'paid'
                order.razorpay_payment_id = payload.payment_id
                await db.commit()
                
            return {
                "success": True,
                "status": "paid",
                "order_id": payload.order_id,
                "message": "Payment verified successfully"
            }
        else:
            return {
                "success": False,
                "status": "failed",
                "message": "Payment not captured"
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### 3. Frontend Redirect Flow

Frontend will automatically redirect to:
- **Success**: `/payment-success?order_id=ORD-123&razorpay_payment_id=pay_123`
- **Failure**: `/payment-failed?error=Payment+cancelled`

### 4. Razorpay Settings

In Razorpay dashboard, configure:
1. Settings → Webhooks → Add webhook for payment events
2. Configure success/failure pages (optional, handled by frontend)
3. Enable SMS & Email notifications

### 5. Environment Variables

Add to backend `.env`:
```
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
FRONTEND_SUCCESS_URL=https://yourdomain.com/payment-success
FRONTEND_FAILURE_URL=https://yourdomain.com/payment-failed
```

## Testing

1. **Create Order Test**:
   ```bash
   curl -X POST http://localhost:8000/orders/create-order \
     -H "Content-Type: application/json" \
     -d '{
       "user_id": "user_123",
       "order_id": "ORD-123",
       "items": [{"product_id": "prod_1", "machine_type": "DST", "qty": 1, "unit_price": 399}],
       "payment_link_request": {
         "amount": 39900,
         "customer_details": {"name": "Test", "email": "test@example.com", "phone": "9876543210"},
         "currency": "INR"
       }
     }'
   ```

2. **Expected Response**:
   ```json
   {
     "order_id": "ORD-123",
     "status": "created",
     "payment_link": "https://rzp.io/i/abc123xyz",
     "amount": 39900
   }
   ```

3. **Frontend Flow**:
   - Copy payment_link URL
   - Open in browser
   - Complete payment with test credentials
   - Gets redirected to `/payment-success` page

## Payment Link Format

Your Razorpay payment link should be something like:
```
https://rzp.io/i/abc123xyz
```

And after payment completion, Razorpay will show these status pages automatically.

## Important Notes

- **Amount is in paise**: 100 paise = 1 rupee
- **Payment Link expiry**: Default 15 minutes, configurable
- **No additional code needed**: Razorpay handles payment form UI
- **Mobile responsive**: Works on all devices
- **Multiple payment methods**: Card, UPI, Wallet, NetBanking, etc.

---

For more info, visit: https://razorpay.com/docs/api/payment-links/

# Backend Implementation - Payment Verification

Based on the URL redirect from Razorpay, here's how to implement the backend verification:

## Important: Store Order ID in Razorpay Notes

When creating the Razorpay payment link, include the order ID in the notes field. This allows the backend to retrieve the order even if session is lost:

```python
# In your order creation endpoint
payment_link_response = razorpay_client.payment_link.create(
    amount=int(amount_in_paise),
    currency="INR",
    description="OSA Embroidery Designs",
    customer_notify=1,
    notes={
        "order_id": order.id,      # <-- Include this
        "user_id": payload.user_id  # <-- And this
    },
    # ... other parameters
)
```

## Implement Backend Verification Endpoint

When Razorpay redirects to `/payment-success`, the frontend extracts the payment ID and calls this endpoint:

### Backend Code (FastAPI)

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.orders import Order
import razorpay

router = APIRouter(prefix="/orders", tags=["orders"])

razorpay_client = razorpay.Client(
    auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
)

@router.post("/orders/verify-payment-by-id")
async def verify_payment_by_id(payload: dict, db: AsyncSession = Depends(get_db)):
    """
    Verify payment using payment ID returned by Razorpay.
    
    This endpoint is called when user is redirected from Razorpay payment success page.
    
    Request:
    {
        "payment_id": "pay_Rm4HPme1EwPKxn",
        "payment_status": "paid"
    }
    """
    try:
        payment_id = payload.get("payment_id")
        payment_status = payload.get("payment_status")
        
        if not payment_id:
            raise HTTPException(status_code=400, detail="Payment ID is required")
        
        # Fetch payment details from Razorpay
        payment_details = razorpay_client.payment.fetch(payment_id)
        
        print(f"Payment details: {payment_details}")
        
        # Extract order ID from payment notes
        notes = payment_details.get('notes', {})
        order_id = notes.get('order_id')
        user_id = notes.get('user_id')
        
        if not order_id:
            # Fallback: Try to find order by payment ID
            stmt = select(Order).where(Order.razorpay_payment_id == payment_id)
            result = await db.execute(stmt)
            order = result.scalar_one_or_none()
            
            if not order:
                return {
                    "success": False,
                    "message": "Order not found for this payment",
                    "payment_id": payment_id
                }
            order_id = order.id
        
        # Verify payment status
        if payment_status == "paid" or payment_details.get('status') == 'captured':
            # Get the order
            order = await db.get(Order, order_id)
            
            if order:
                # Update order status to paid
                order.status = "paid"
                order.razorpay_payment_id = payment_id
                
                # Add any other fields like payment date
                from datetime import datetime
                order.payment_date = datetime.utcnow()
                
                await db.commit()
                await db.refresh(order)
                
                print(f"Order {order_id} marked as paid")
                
                return {
                    "success": True,
                    "status": "paid",
                    "order_id": order_id,
                    "message": "Payment verified successfully"
                }
            else:
                return {
                    "success": False,
                    "message": f"Order {order_id} not found"
                }
        else:
            # Payment is not in captured state
            print(f"Payment {payment_id} status: {payment_details.get('status')}")
            
            return {
                "success": False,
                "status": payment_details.get('status'),
                "message": f"Payment status is {payment_details.get('status')}, expected 'captured'"
            }
        
    except Exception as e:
        print(f"Error verifying payment: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error verifying payment: {str(e)}")
```

## Update Order Model

Make sure your Order model has these fields:

```python
from sqlalchemy import Column, String, Float, DateTime, Enum as SQLEnum
from datetime import datetime
import enum

class OrderStatus(str, enum.Enum):
    pending = "pending"
    paid = "paid"
    shipped = "shipped"
    delivered = "delivered"
    cancelled = "cancelled"

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(String, primary_key=True)
    user_id = Column(String, nullable=False, index=True)
    total_amount = Column(Float, nullable=False)
    status = Column(SQLEnum(OrderStatus), default=OrderStatus.pending)
    razorpay_payment_id = Column(String, unique=True, nullable=True, index=True)
    payment_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

## Complete Order Creation Endpoint

Here's the complete implementation for creating orders:

```python
@router.post("/orders/create-order")
async def create_order(payload: OrderCreateSchema, db: AsyncSession = Depends(get_db)):
    """
    Create order and generate Razorpay payment link.
    """
    try:
        # Create order in database
        total_amount = payload.payment_link_request.amount / 100  # Convert from paise
        
        new_order = Order(
            id=payload.order_id,
            user_id=payload.user_id,
            total_amount=total_amount,
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
            description="OSA Embroidery Digital Designs",
            customer_notify=1,
            notify={
                "sms": True,
                "email": True
            },
            reminder_enable=True,
            notes={
                "order_id": new_order.id,
                "user_id": payload.user_id,
                "product_count": len(payload.items)
            },
            callback_url="https://yourdomain.com/api/webhooks/payment",  # Optional
            callback_method="get",
            # Redirect URLs (optional - Razorpay handles this automatically)
            # upi_link=False,
            # whatsapp_link=False
        )
        
        print(f"Created payment link: {payment_link_response.get('short_url')}")
        
        # Return payment link
        return {
            "order_id": new_order.id,
            "status": "created",
            "payment_link": payment_link_response.get("short_url"),
            "amount": int(payload.payment_link_request.amount)
        }
        
    except Exception as e:
        await db.rollback()
        print(f"Error creating order: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
```

## Optional: Add Webhook for Payment Updates

For production, you can add a webhook endpoint that Razorpay calls:

```python
@router.post("/webhooks/payment")
async def payment_webhook(event: dict, db: AsyncSession = Depends(get_db)):
    """
    Webhook endpoint that Razorpay calls to notify about payment events.
    """
    try:
        event_type = event.get('event')
        payload = event.get('payload', {})
        
        if event_type == 'payment_link.paid':
            # Payment link was paid
            payment_link_id = payload.get('payment_link', {}).get('id')
            order_id = payload.get('payment_link', {}).get('notes', {}).get('order_id')
            payment_id = payload.get('payment', {}).get('id')
            
            # Update order
            order = await db.get(Order, order_id)
            if order:
                order.status = "paid"
                order.razorpay_payment_id = payment_id
                order.payment_date = datetime.utcnow()
                await db.commit()
        
        return {"success": True}
        
    except Exception as e:
        print(f"Webhook error: {str(e)}")
        return {"success": False, "error": str(e)}
```

## Testing

Test the flow with these steps:

1. **Create an order:**
```bash
curl -X POST http://localhost:8000/orders/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_123",
    "order_id": "ORD-TEST-001",
    "items": [{"product_id": "prod_1", "machine_type": "DST", "qty": 1, "unit_price": 100}],
    "payment_link_request": {
      "amount": 10000,
      "customer_details": {"name": "Test", "email": "test@example.com", "phone": "9876543210"},
      "currency": "INR"
    }
  }'
```

2. **Open the payment_link URL in browser**

3. **Use test card:** 4111 1111 1111 1111 (any expiry, any CVV)

4. **After payment, the frontend will call verify endpoint:**
```bash
curl -X POST http://localhost:8000/orders/verify-payment-by-id \
  -H "Content-Type: application/json" \
  -d '{
    "payment_id": "pay_xxxxx",
    "payment_status": "paid"
  }'
```

5. **Verify order status in database:**
```sql
SELECT * FROM orders WHERE id = 'ORD-TEST-001';
-- Should show: status = 'paid', razorpay_payment_id = 'pay_xxxxx'
```

---

You're all set! The payment flow is complete end-to-end.

# Stripe Payment Integration for Parkside Hotel

This documentation explains how to use the Stripe payment integration in your hotel booking system.

## 🔧 Setup

### Environment Variables

Make sure these environment variables are set in your `.env` file:

```env
STRIPE_SECRET_KEY=sk_test_51RbKUlQqkfVa6n4f...
STRIPE_PUBLISHABLE_KEY=pk_test_51RbKUlQqkfVa6n4f...
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### Get Your Stripe Keys

1. Go to your [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Publishable key** and **Secret key** (use test keys for development)
3. For webhooks, go to Webhooks section and get your webhook secret

## 📋 Available API Endpoints

### Base URL: `/api/stripe`

### 1. Test Connection

**GET** `/test`

- Tests if Stripe is properly configured
- No parameters required

### 2. Create Payment Intent

**POST** `/create-payment-intent`

**Request Body:**

```json
{
  "amount": 299.99,
  "currency": "usd",
  "bookingId": "booking_123",
  "guestEmail": "guest@example.com",
  "guestName": "John Doe",
  "roomType": "Deluxe Suite",
  "checkIn": "2024-12-25",
  "checkOut": "2024-12-27",
  "numberOfGuests": 2,
  "numberOfNights": 2
}
```

**Response:**

```json
{
  "success": true,
  "clientSecret": "pi_1234567890_secret_xyz",
  "paymentIntentId": "pi_1234567890",
  "paymentRecordId": "67890abcdef"
}
```

### 3. Confirm Payment

**POST** `/confirm-payment`

**Request Body:**

```json
{
  "paymentIntentId": "pi_1234567890"
}
```

### 4. Create Refund

**POST** `/create-refund`

**Request Body:**

```json
{
  "paymentIntentId": "pi_1234567890",
  "amount": 150.0,
  "reason": "requested_by_customer"
}
```

### 5. Get Payment History

**GET** `/payment-history?customerEmail=guest@example.com&limit=10`

**Query Parameters:**

- `customerEmail` (optional): Filter by customer email
- `bookingId` (optional): Filter by booking ID
- `limit` (optional, default: 10): Number of payments to return

### 6. Get Publishable Key

**GET** `/publishable-key`

- Returns the Stripe publishable key for frontend use

### 7. Webhook Handler

**POST** `/webhook`

- Handles Stripe webhook events
- Updates payment status in database automatically

## 🗄️ Database Schema

The system automatically creates a `Payment` collection with this structure:

```javascript
{
  stripePaymentIntentId: "pi_1234567890",
  bookingId: "booking_123",
  guestEmail: "guest@example.com",
  guestName: "John Doe",
  amount: 299.99,
  currency: "usd",
  status: "succeeded", // pending, processing, succeeded, failed, canceled, refunded
  paymentMethod: "card", // card, paypal, crypto
  bookingDetails: {
    roomType: "Deluxe Suite",
    checkIn: "2024-12-25T00:00:00.000Z",
    checkOut: "2024-12-27T00:00:00.000Z",
    numberOfGuests: 2,
    numberOfNights: 2
  },
  refunds: [
    {
      stripeRefundId: "re_1234567890",
      amount: 100.00,
      reason: "requested_by_customer",
      status: "succeeded",
      refundedAt: "2024-12-20T10:30:00.000Z"
    }
  ],
  webhookEvents: [
    {
      eventType: "payment_intent.succeeded",
      eventId: "evt_1234567890",
      receivedAt: "2024-12-20T10:00:00.000Z",
      processed: true
    }
  ],
  paymentDate: "2024-12-20T10:00:00.000Z",
  createdAt: "2024-12-20T10:00:00.000Z",
  updatedAt: "2024-12-20T10:30:00.000Z"
}
```

## 🔄 Payment Flow

### Frontend Integration Steps:

1. **Create Payment Intent:**

   ```javascript
   const response = await fetch('/api/stripe/create-payment-intent', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       amount: 299.99,
       bookingId: 'booking_123',
       guestEmail: 'guest@example.com',
       guestName: 'John Doe',
       roomType: 'Deluxe Suite',
     }),
   });
   const { clientSecret } = await response.json();
   ```

2. **Confirm Payment with Stripe Elements:**

   ```javascript
   const { error } = await stripe.confirmCardPayment(clientSecret, {
     payment_method: {
       card: cardElement,
       billing_details: {
         name: 'John Doe',
         email: 'guest@example.com',
       },
     },
   });
   ```

3. **Handle Success/Error:**
   ```javascript
   if (error) {
     // Handle payment error
     console.error('Payment failed:', error.message);
   } else {
     // Payment succeeded
     // Confirm on backend
     await fetch('/api/stripe/confirm-payment', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
     });
   }
   ```

## 🔔 Webhook Events

The system automatically handles these Stripe webhook events:

- `payment_intent.succeeded` - Updates payment status to 'succeeded'
- `payment_intent.payment_failed` - Updates payment status to 'failed'
- `payment_intent.canceled` - Updates payment status to 'canceled'
- `refund.created` - Adds refund information and updates status

### Setting Up Webhooks:

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Create a new webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select these events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
   - `refund.created`
4. Copy the webhook secret to your `.env` file

## 🧪 Testing

### Test the Integration:

1. **Test Stripe Connection:**

   ```bash
   curl http://localhost:4000/api/stripe/test
   ```

2. **Test Payment Creation:**

   ```bash
   curl -X POST http://localhost:4000/api/stripe/create-payment-intent \
   -H "Content-Type: application/json" \
   -d '{
     "amount": 100.00,
     "bookingId": "test_booking_123",
     "guestEmail": "test@example.com",
     "guestName": "Test User",
     "roomType": "Standard Room"
   }'
   ```

3. **Use Stripe Test Cards:**
   - Success: `4242424242424242`
   - Declined: `4000000000000002`
   - 3D Secure: `4000002760003184`

## 🔐 Security Best Practices

✅ **DO:**

- Use HTTPS in production
- Validate all input on the server
- Use Stripe's client-side libraries for card data
- Handle webhooks to ensure payment status consistency
- Store only necessary payment metadata

❌ **DON'T:**

- Store card numbers or CVV codes
- Trust payment status from frontend only
- Skip webhook signature verification
- Expose secret keys in frontend code

## 🚀 Next Steps

1. **Test the integration** with the provided endpoints
2. **Set up webhooks** for automatic status updates
3. **Integrate with your booking system** to update booking status
4. **Add PayPal integration** following similar patterns
5. **Add USDT/crypto payments** using a crypto payment processor

## 📞 Support

If you encounter issues:

1. Check the server logs for errors
2. Verify your Stripe keys are correct
3. Test with Stripe's test cards
4. Check webhook delivery in Stripe Dashboard

## 🔗 Useful Links

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Test Cards](https://stripe.com/docs/testing#cards)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe Dashboard](https://dashboard.stripe.com/)

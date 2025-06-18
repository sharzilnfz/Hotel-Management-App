import dotenv from 'dotenv';
import Stripe from 'stripe';
import Payment from '../../models/payments/Payment.js';

dotenv.config();

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create a payment intent for hotel booking
export const createPaymentIntent = async (req, res) => {
  try {
    const {
      amount,
      currency = 'usd',
      bookingId,
      guestEmail,
      guestName,
      roomType,
      checkIn,
      checkOut,
      numberOfGuests,
      numberOfNights,
    } = req.body;

    // Validate required fields
    if (!amount || !bookingId || !guestEmail || !guestName) {
      return res.status(400).json({
        success: false,
        message: 'Amount, booking ID, guest email, and guest name are required',
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency.toLowerCase(),
      metadata: {
        bookingId,
        guestEmail,
        guestName,
        roomType: roomType || '',
        checkIn: checkIn || '',
        checkOut: checkOut || '',
      },
      receipt_email: guestEmail,
      description: `Hotel booking payment for ${guestName} - Room: ${
        roomType || 'N/A'
      }`,
    });

    // Save payment record to database
    const payment = new Payment({
      stripePaymentIntentId: paymentIntent.id,
      bookingId,
      guestEmail,
      guestName,
      amount,
      currency: currency.toLowerCase(),
      status: 'pending',
      paymentMethod: 'card',
      bookingDetails: {
        roomType,
        checkIn: checkIn ? new Date(checkIn) : null,
        checkOut: checkOut ? new Date(checkOut) : null,
        numberOfGuests,
        numberOfNights,
      },
      metadata: {
        stripeClientSecret: paymentIntent.client_secret,
      },
    });

    await payment.save();

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      paymentRecordId: payment._id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Confirm payment and update booking status
export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment intent ID is required',
      });
    } // Retrieve payment intent to check status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Update payment record in database
    const payment = await Payment.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntentId },
      {
        status: paymentIntent.status,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (paymentIntent.status === 'succeeded') {
      res.status(200).json({
        success: true,
        message: 'Payment confirmed successfully',
        payment: {
          id: paymentIntent.id,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          metadata: paymentIntent.metadata,
          bookingId: payment?.bookingId,
          guestEmail: payment?.guestEmail,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: `Payment not successful. Status: ${paymentIntent.status}`,
      });
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get payment history for a customer
export const getPaymentHistory = async (req, res) => {
  try {
    const { customerEmail, limit = 10, bookingId } = req.query;

    // Build query
    let query = {};
    if (customerEmail) {
      query.guestEmail = customerEmail;
    }
    if (bookingId) {
      query.bookingId = bookingId;
    }

    // Get payments from our database
    const payments = await Payment.find(query)
      .sort({ paymentDate: -1 })
      .limit(parseInt(limit))
      .lean();

    const formattedPayments = payments.map((payment) => ({
      id: payment.stripePaymentIntentId,
      paymentRecordId: payment._id,
      bookingId: payment.bookingId,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      paymentMethod: payment.paymentMethod,
      guestName: payment.guestName,
      guestEmail: payment.guestEmail,
      bookingDetails: payment.bookingDetails,
      paymentDate: payment.paymentDate,
      refunds: payment.refunds || [],
      hasRefunds: payment.refunds && payment.refunds.length > 0,
    }));

    res.status(200).json({
      success: true,
      payments: formattedPayments,
      total: payments.length,
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Stripe publishable key for frontend
export const getPublishableKey = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve publishable key',
    });
  }
};

// Test endpoint to verify Stripe configuration
export const testStripeConnection = async (req, res) => {
  try {
    // Try to retrieve account information to test connection
    const account = await stripe.accounts.retrieve();

    res.status(200).json({
      success: true,
      message: 'Stripe connection successful',
      account: {
        id: account.id,
        country: account.country,
        defaultCurrency: account.default_currency,
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled,
      },
    });
  } catch (error) {
    console.error('Stripe connection test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Stripe connection failed',
      error: error.message,
    });
  }
};

// Delete a connected Stripe account
export const deleteConnectedAccount = async (req, res) => {
  const { accountId } = req.params;

  if (!accountId) {
    return res.status(400).json({ message: 'Account ID is required' });
  }

  try {
    const deletedAccount = await stripe.accounts.del(accountId);

    res.status(200).json({
      success: true,
      message: `Connected account deleted successfully`,
      data: { id: deletedAccount.id },
    });
  } catch (error) {
    console.error(`Failed to delete connected account: ${error.message}`);
    res.status(400).json({
      success: false,
      message: `Failed to delete connected account: ${error.message}`,
    });
  }
};

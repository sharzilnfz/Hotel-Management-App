import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    // Stripe payment information
    stripePaymentIntentId: {
      type: String,
      required: true,
      unique: true,
    },

    // Booking reference
    bookingId: {
      type: String,
      required: true,
    },

    // Customer information
    guestEmail: {
      type: String,
      required: true,
    },

    guestName: {
      type: String,
      required: true,
    },

    // Payment details
    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      required: true,
      default: 'usd',
    },

    // Payment status
    status: {
      type: String,
      enum: [
        'pending',
        'processing',
        'succeeded',
        'failed',
        'canceled',
        'refunded',
        'partially_refunded',
      ],
      default: 'pending',
    },

    // Payment method
    paymentMethod: {
      type: String,
      enum: ['card', 'paypal', 'crypto'],
      required: true,
    },

    // Booking details (metadata)
    bookingDetails: {
      roomType: String,
      checkIn: Date,
      checkOut: Date,
      numberOfGuests: Number,
      numberOfNights: Number,
    },

    // Additional metadata
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Timestamps
    paymentDate: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ guestEmail: 1 });
paymentSchema.index({ stripePaymentIntentId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ paymentDate: -1 });

// Update the updatedAt field before saving
paymentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;

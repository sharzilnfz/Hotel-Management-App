import mongoose from 'mongoose';

const guestSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Please provide a valid email address',
      },
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    nationality: {
      type: String,
      trim: true,
      default: '',
    },
    idNumber: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: false }
);

const selectedExtraSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  { _id: false }
);

const roomBookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      trim: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Room ID is required'],
    },
    roomName: {
      type: String,
      required: [true, 'Room name is required'],
      trim: true,
    },
    roomType: {
      type: String,
      required: [true, 'Room type is required'],
      trim: true,
    },
    primaryGuest: {
      type: guestSchema,
      required: [true, 'Primary guest information is required'],
    },
    additionalGuests: [guestSchema],
    checkInDate: {
      type: Date,
      required: [true, 'Check-in date is required'],
    },
    checkOutDate: {
      type: Date,
      required: [true, 'Check-out date is required'],
      validate: {
        validator: function (v) {
          return v > this.checkInDate;
        },
        message: 'Check-out date must be after check-in date',
      },
    },
    numberOfNights: {
      type: Number,
      required: true,
      min: 1,
    },
    numberOfGuests: {
      type: Number,
      required: [true, 'Number of guests is required'],
      min: 1,
    },
    roomQuantity: {
      type: Number,
      required: [true, 'Room quantity is required'],
      min: 1,
      default: 1,
    },
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: 0,
    },
    selectedExtras: [selectedExtraSchema],
    extrasTotal: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountApplied: {
      code: {
        type: String,
        default: '',
      },
      type: {
        type: String,
        enum: ['percentage', 'fixed'],
        default: 'percentage',
      },
      value: {
        type: Number,
        default: 0,
        min: 0,
      },
      amount: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    taxes: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['pay_now', 'pay_at_hotel', 'partial'],
      required: [true, 'Payment method is required'],
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'partial', 'failed', 'refunded'],
      default: 'pending',
    },
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'checked_in',
        'checked_out',
        'cancelled',
        'no_show',
      ],
      default: 'pending',
    },
    specialRequests: {
      type: String,
      trim: true,
      default: '',
    },
    isRefundable: {
      type: Boolean,
      default: true,
    },
    refundPolicy: {
      type: String,
      default: '',
    },
    cancellationPolicy: {
      type: String,
      default: 'flexible',
    },
    breakfastIncluded: {
      type: Boolean,
      default: false,
    },
    checkInTime: {
      type: String,
      default: '15:00',
    },
    checkOutTime: {
      type: String,
      default: '11:00',
    },
    source: {
      type: String,
      enum: ['website', 'app', 'phone', 'walk_in', 'admin'],
      default: 'website',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    paymentTransactionId: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for full guest name
roomBookingSchema.virtual('primaryGuestFullName').get(function () {
  if (
    this.primaryGuest &&
    this.primaryGuest.firstName &&
    this.primaryGuest.lastName
  ) {
    return `${this.primaryGuest.firstName} ${this.primaryGuest.lastName}`;
  }
  return 'Unknown Guest';
});

// Virtual for total guests count
roomBookingSchema.virtual('totalGuests').get(function () {
  return this.additionalGuests.length + 1; // +1 for primary guest
});

// Virtual for booking duration
roomBookingSchema.virtual('bookingDuration').get(function () {
  if (this.checkInDate && this.checkOutDate) {
    const diffTime = Math.abs(this.checkOutDate - this.checkInDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  return 0;
});

// Pre-save middleware to calculate numberOfNights
roomBookingSchema.pre('save', function (next) {
  if (this.checkInDate && this.checkOutDate) {
    const diffTime = Math.abs(this.checkOutDate - this.checkInDate);
    this.numberOfNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  next();
});

// Generate booking ID before saving new document
roomBookingSchema.pre('save', function (next) {
  if (!this.isNew) {
    return next();
  }

  // Only generate booking ID for new documents
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');

  // Get the count of documents
  this.constructor
    .countDocuments()
    .then((count) => {
      const sequenceNumber = String(count + 1).padStart(4, '0');
      this.bookingId = `RB-${year}${month}-${sequenceNumber}`;
      next();
    })
    .catch((err) => {
      next(err);
    });
});

// Index for better query performance
roomBookingSchema.index({ bookingId: 1 });
roomBookingSchema.index({ roomId: 1 });
roomBookingSchema.index({ 'primaryGuest.email': 1 });
roomBookingSchema.index({ checkInDate: 1, checkOutDate: 1 });
roomBookingSchema.index({ status: 1 });
roomBookingSchema.index({ createdAt: -1 });

const RoomBooking = mongoose.model('RoomBooking', roomBookingSchema);

export default RoomBooking;

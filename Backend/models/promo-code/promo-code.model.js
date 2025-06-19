import mongoose from 'mongoose';

const promoCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Code is required'],
    unique: true,
    trim: true,
    minlength: 3,
    uppercase: true,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: [true, 'Discount type is required'],
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: [0, 'Discount value must be positive'],
  },
  // Backward compatibility fields
  discount: {
    type: String,
    required: [true, 'Discount value is required'],
  },
  type: {
    type: String,
    enum: ['Percentage', 'Fixed'],
    required: [true, 'Discount type is required'],
  },
  validFrom: {
    type: Date,
    required: [true, 'Valid from date is required'],
  },
  validUntil: {
    type: Date,
    required: [true, 'Valid until date is required'],
  },
  // Backward compatibility field
  validTo: {
    type: Date,
    required: [true, 'Valid to date is required'],
  },
  validFromTime: {
    type: String,
    required: [true, 'Valid from time is required'],
    default: '00:00',
  },
  validToTime: {
    type: String,
    required: [true, 'Valid to time is required'],
    default: '23:59',
  },
  usageLimit: {
    type: Number,
    default: null,
    min: [0, 'Usage limit must be non-negative'],
  },
  usedCount: {
    type: Number,
    default: 0,
    min: [0, 'Used count must be non-negative'],
  },
  // Backward compatibility field
  usageCount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Active', 'Expired', 'Scheduled', 'Inactive'],
    default: 'Active',
  },
  capacity: {
    type: String,
    default: null,
  },
  applicableServices: {
    type: [String],
    required: [true, 'At least one applicable service is required'],
  },
  minPurchase: {
    type: String,
    default: null,
  },
  maxDiscountCap: {
    type: String,
    default: null,
  },
  newCustomersOnly: {
    type: Boolean,
    default: false,
  },
  maxUsesPerCustomer: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save middleware to sync fields and update timestamps
promoCodeSchema.pre('save', function (next) {
  this.updatedAt = Date.now();

  // Sync new and old field names for backward compatibility
  if (this.discountType && !this.type) {
    this.type = this.discountType === 'percentage' ? 'Percentage' : 'Fixed';
  }
  if (this.type && !this.discountType) {
    this.discountType = this.type === 'Percentage' ? 'percentage' : 'fixed';
  }

  if (this.validUntil && !this.validTo) {
    this.validTo = this.validUntil;
  }
  if (this.validTo && !this.validUntil) {
    this.validUntil = this.validTo;
  }

  if (this.usedCount !== undefined && this.usageCount === undefined) {
    this.usageCount = this.usedCount;
  }
  if (this.usageCount !== undefined && this.usedCount === undefined) {
    this.usedCount = this.usageCount;
  }

  // Ensure code is uppercase
  if (this.code) {
    this.code = this.code.toUpperCase();
  }

  next();
});

// Instance method to check if promo code is valid
promoCodeSchema.methods.isValid = function () {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

  // Check status
  if (this.status !== 'Active') {
    return { valid: false, reason: 'Promo code is not active' };
  }

  // Check date range
  if (now < this.validFrom || now > this.validUntil) {
    return { valid: false, reason: 'Promo code has expired or not yet valid' };
  }

  // Check time range
  if (currentTime < this.validFromTime || currentTime > this.validToTime) {
    return { valid: false, reason: 'Promo code is not valid at this time' };
  }

  // Check usage limit
  if (this.usageLimit && this.usedCount >= this.usageLimit) {
    return { valid: false, reason: 'Promo code usage limit reached' };
  }

  return { valid: true };
};

// Instance method to calculate discount
promoCodeSchema.methods.calculateDiscount = function (originalAmount) {
  if (this.discountType === 'percentage') {
    let discountAmount = (originalAmount * this.discountValue) / 100;

    // Apply max discount cap if set
    if (this.maxDiscountCap) {
      const maxCap = parseFloat(this.maxDiscountCap.replace('$', ''));
      discountAmount = Math.min(discountAmount, maxCap);
    }

    return discountAmount;
  } else {
    // Fixed discount
    return Math.min(this.discountValue, originalAmount);
  }
};

const PromoCode = mongoose.model('PromoCode', promoCodeSchema);

export default PromoCode;

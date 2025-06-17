import mongoose from 'mongoose';

const promoCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Code is required'],
        unique: true,
        trim: true,
        minlength: 3
    },
    discount: {
        type: String,
        required: [true, 'Discount value is required']
    },
    type: {
        type: String,
        enum: ['Percentage', 'Fixed'],
        required: [true, 'Discount type is required']
    },
    validFrom: {
        type: Date,
        required: [true, 'Valid from date is required']
    },
    validTo: {
        type: Date,
        required: [true, 'Valid to date is required']
    },
    validFromTime: {
        type: String,
        required: [true, 'Valid from time is required'],
        default: '00:00'
    },
    validToTime: {
        type: String,
        required: [true, 'Valid to time is required'],
        default: '23:59'
    },
    status: {
        type: String,
        enum: ['Active', 'Expired', 'Scheduled'],
        default: 'Active'
    },
    usageCount: {
        type: Number,
        default: 0
    },
    capacity: {
        type: String,
        default: null
    },
    applicableServices: {
        type: [String],
        required: [true, 'At least one applicable service is required']
    },
    minPurchase: {
        type: String,
        default: null
    },
    maxDiscountCap: {
        type: String,
        default: null
    },
    newCustomersOnly: {
        type: Boolean,
        default: false
    },
    maxUsesPerCustomer: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
promoCodeSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const PromoCode = mongoose.model('PromoCode', promoCodeSchema);

export default PromoCode; 
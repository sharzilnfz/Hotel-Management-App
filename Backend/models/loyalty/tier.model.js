import mongoose from 'mongoose';

const loyaltyTierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tier name is required'],
        unique: true,
        trim: true
    },
    pointsRequired: {
        type: Number,
        required: [true, 'Points required is required'],
        min: [0, 'Points required cannot be negative']
    },
    benefits: {
        type: [String],
        required: [true, 'At least one benefit is required']
    },
    color: {
        type: String,
        required: [true, 'Color is required'],
        default: '#6d4c41' // Default to bronze hex color
    }
}, {
    timestamps: true
});

const LoyaltyTier = mongoose.model('LoyaltyTier', loyaltyTierSchema);

export default LoyaltyTier; 
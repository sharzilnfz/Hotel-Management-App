import mongoose from 'mongoose';

const loyaltySettingsSchema = new mongoose.Schema({
    pointsExpiration: {
        type: Number,
        required: [true, 'Points expiration period is required'],
        default: 24,
        min: [1, 'Expiration period must be at least 1 month']
    },
    pointsPerDollar: {
        type: Number,
        required: [true, 'Points per dollar is required'],
        default: 10,
        min: [1, 'Points per dollar must be at least 1']
    },
    welcomeBonus: {
        type: Number,
        required: [true, 'Welcome bonus is required'],
        default: 500,
        min: [0, 'Welcome bonus cannot be negative']
    },
    birthdayBonus: {
        type: Number,
        required: [true, 'Birthday bonus is required'],
        default: 250,
        min: [0, 'Birthday bonus cannot be negative']
    },
    promoCodesApplicable: {
        type: Boolean,
        required: [true, 'Promo codes applicability is required'],
        default: true
    },
    discountAvailable: {
        type: Boolean,
        required: [true, 'Discount availability is required'],
        default: true
    }
}, {
    timestamps: true
});

// Since there's only one settings document, we'll use a static method to get or create it
loyaltySettingsSchema.statics.getSettings = async function () {
    const settings = await this.findOne();
    if (settings) {
        return settings;
    } else {
        // Create default settings if none exist
        return await this.create({});
    }
};

const LoyaltySettings = mongoose.model('LoyaltySettings', loyaltySettingsSchema);

export default LoyaltySettings; 
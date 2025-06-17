import mongoose from 'mongoose';

const loyaltyRewardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Reward name is required'],
        unique: true,
        trim: true
    },
    pointsCost: {
        type: Number,
        required: [true, 'Points cost is required'],
        min: [1, 'Points cost must be at least 1']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Dining', 'Room', 'Wellness', 'Transportation', 'Experience', 'Other']
    },
    status: {
        type: String,
        required: [true, 'Status is required'],
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }
}, {
    timestamps: true
});

const LoyaltyReward = mongoose.model('LoyaltyReward', loyaltyRewardSchema);

export default LoyaltyReward; 
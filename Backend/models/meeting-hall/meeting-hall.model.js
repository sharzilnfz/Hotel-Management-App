import mongoose from 'mongoose';

const meetingHallSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Meeting hall name is required'],
        unique: true,
        trim: true
    },
    capacity: {
        type: Number,
        required: [true, 'Capacity is required'],
        min: 1
    },
    size: {
        type: String,
        required: [true, 'Size is required'],
        trim: true
    },
    price: {
        type: String,
        required: [true, 'Price is required'],
        trim: true
    },
    amenities: [{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        enum: ['Available', 'Booked', 'Maintenance'],
        default: 'Available'
    },
    description: {
        type: String,
        trim: true
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
meetingHallSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const MeetingHall = mongoose.model('MeetingHall', meetingHallSchema);

export default MeetingHall; 
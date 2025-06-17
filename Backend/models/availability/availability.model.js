import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
    serviceType: {
        type: String,
        enum: ['room', 'spa', 'restaurant', 'specialist'],
        required: true
    },
    serviceId: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    serviceName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    available: {
        type: Number,
        required: true
    },
    bookings: {
        type: Number,
        default: function () {
            return this.total - this.available;
        }
    },
    updatedBy: {
        type: String,
        default: 'admin'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Compound index to ensure uniqueness of availability records
availabilitySchema.index({ serviceType: 1, serviceId: 1, date: 1 }, { unique: true });

const Availability = mongoose.model('Availability', availabilitySchema);

export default Availability; 
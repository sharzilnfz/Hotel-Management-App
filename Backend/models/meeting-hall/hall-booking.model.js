import mongoose from 'mongoose';

const hallBookingSchema = new mongoose.Schema({
    bookingId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    hallId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MeetingHall',
        required: [true, 'Meeting hall ID is required']
    },
    hallName: {
        type: String,
        required: [true, 'Hall name is required'],
        trim: true
    },
    client: {
        type: String,
        required: [true, 'Client name is required'],
        trim: true
    },
    eventType: {
        type: String,
        required: [true, 'Event type is required'],
        trim: true
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required']
    },
    attendees: {
        type: Number,
        required: [true, 'Number of attendees is required'],
        min: 1
    },
    status: {
        type: String,
        enum: ['Confirmed', 'Pending', 'Cancelled'],
        default: 'Pending'
    },
    totalPrice: {
        type: Number,
        required: [true, 'Total price is required']
    },
    paymentStatus: {
        type: String,
        enum: ['Paid', 'Partial', 'Unpaid'],
        default: 'Unpaid'
    },
    notes: {
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

// Generate booking ID before saving new document
hallBookingSchema.pre('save', function (next) {
    if (!this.isNew) {
        this.updatedAt = Date.now();
        return next();
    }

    // Only generate booking ID for new documents
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');

    // Get the count of documents
    this.constructor.countDocuments().then(count => {
        const sequenceNumber = String(count + 1).padStart(3, '0');
        this.bookingId = `BK-${year}${month}-${sequenceNumber}`;
        next();
    }).catch(err => {
        next(err);
    });
});

const HallBooking = mongoose.model('HallBooking', hallBookingSchema);

export default HallBooking; 
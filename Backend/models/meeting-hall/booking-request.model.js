import mongoose from 'mongoose';

const bookingRequestSchema = new mongoose.Schema({
    requestId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    companyName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    preferredDate: {
        type: Date,
        required: [true, 'Preferred date is required']
    },
    preferredTime: {
        type: String,
        required: [true, 'Preferred time is required'],
        trim: true
    },
    hallName: {
        type: String,
        required: [true, 'Hall name is required'],
        trim: true
    },
    attendees: {
        type: Number,
        required: [true, 'Number of attendees is required'],
        min: 1
    },
    purpose: {
        type: String,
        required: [true, 'Event purpose is required'],
        trim: true
    },
    additionalRequirements: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['New', 'Contacted', 'Confirmed', 'Declined'],
        default: 'New'
    },
    notes: {
        type: String,
        trim: true
    },
    isNew: {
        type: Boolean,
        default: true
    },
    submissionDate: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Generate request ID before saving new document
bookingRequestSchema.pre('save', function (next) {
    if (!this.isNew) {
        this.updatedAt = Date.now();
        return next();
    }

    // Only generate request ID for new documents
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');

    // Get the count of documents
    this.constructor.countDocuments().then(count => {
        const sequenceNumber = String(count + 1).padStart(3, '0');
        this.requestId = `REQ-${year}${month}-${sequenceNumber}`;
        next();
    }).catch(err => {
        next(err);
    });
});

const BookingRequest = mongoose.model('BookingRequest', bookingRequestSchema);

export default BookingRequest; 
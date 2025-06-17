import mongoose from "mongoose";

const durationSchema = new mongoose.Schema({
    duration: {
        type: String,
        required: [true, "Duration time is required"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"]
    }
}, { _id: false });

const addonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Addon name is required"]
    },
    price: {
        type: Number,
        required: [true, "Addon price is required"]
    },
    selected: {
        type: Boolean,
        default: false
    }
}, { _id: false });

const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Service title is required'],
        minlength: [3, 'Service title must be at least 3 characters long'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Service description is required'],
        minlength: [10, 'Service description must be at least 10 characters long']
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    },
    images: [{
        type: String,
        required: [true, 'At least one image is required']
    }],
    isPopular: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    displayStatus: {
        type: String,
        enum: ['available', 'limited', 'unavailable'],
        default: 'available'
    },
    specialist: {
        type: String,
        required: [true, "Specialist name is required"],
        trim: true
    },
    availability: {
        type: String,
        default: "Daily"
    },
    durations: {
        type: [durationSchema],
        required: [true, "At least one duration is required"],
        validate: {
            validator: function (v) {
                return Array.isArray(v) && v.length > 0;
            },
            message: "At least one duration must be provided"
        }
    },
    addons: {
        type: [addonSchema],
        default: []
    },
    isRefundable: {
        type: Boolean,
        default: true
    },
    refundPolicy: {
        type: String,
        default: "Full refund if cancelled up to 48 hours before appointment. 50% refund if cancelled up to 24 hours before appointment."
    },
    popularityScore: {
        type: Number,
        default: 0
    },
    specialistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Specialist',
        required: [true, "Specialist is required"]
    }
}, { timestamps: true });

// Middleware to increment category's serviceCount when a service is added
serviceSchema.post('save', async function (doc) {
    try {
        const Category = mongoose.model('Category');
        await Category.findByIdAndUpdate(
            doc.categoryId,
            { $inc: { serviceCount: 1 } }
        );
    } catch (error) {
        console.error('Error updating category service count:', error);
    }
});

// Middleware to decrement category's serviceCount when a service is deleted
serviceSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        try {
            const Category = mongoose.model('Category');
            await Category.findByIdAndUpdate(
                doc.categoryId,
                { $inc: { serviceCount: -1 } }
            );
        } catch (error) {
            console.error('Error updating category service count:', error);
        }
    }
});

const Service = mongoose.model("Service", serviceSchema);

export default Service; 
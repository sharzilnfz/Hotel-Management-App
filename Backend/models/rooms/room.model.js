import mongoose from "mongoose";

const extraSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
});

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Room name is required"],
        trim: true
    },
    type: {
        type: String,
        required: [true, "Room type is required"],
        enum: ["standard", "deluxe", "premium", "suite", "executive"]
    },
    category: {
        type: String,
        required: [true, "Room category is required"],
        enum: ["single", "double", "twin", "family", "accessible"]
    },
    bedType: {
        type: String,
        required: [true, "Bed type is required"],
        enum: ["king", "queen", "twin", "double", "single"]
    },
    capacity: {
        type: Number,
        required: [true, "Capacity is required"],
        min: [1, "Capacity must be at least 1"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price must be a positive number"]
    },
    totalRooms: {
        type: Number,
        required: [true, "Total rooms is required"],
        min: [1, "Must have at least 1 room"]
    },
    availableRooms: {
        type: Number,
        default: function () {
            return this.totalRooms;
        }
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        minlength: [10, "Description must be at least 10 characters"]
    },
    breakfastIncluded: {
        type: Boolean,
        default: false
    },
    checkInTime: {
        type: String,
        default: "14:00"
    },
    checkOutTime: {
        type: String,
        default: "12:00"
    },
    amenities: [{
        type: String
    }],
    extras: [extraSchema],
    payNow: {
        type: Boolean,
        default: true
    },
    payAtHotel: {
        type: Boolean,
        default: true
    },
    isRefundable: {
        type: Boolean,
        default: true
    },
    refundPolicy: {
        type: String,
        default: "Full refund if cancelled up to 48 hours before check-in. 50% refund if cancelled up to 24 hours before check-in."
    },
    cancellationPolicy: {
        type: String,
        enum: ["flexible", "moderate", "strict", "custom"],
        default: "flexible"
    },
    discount: {
        name: {
            type: String,
            default: ""
        },
        type: {
            type: String,
            enum: ["percentage", "fixed"],
            default: "percentage"
        },
        value: {
            type: Number,
            default: 0
        },
        capacity: {
            type: Number,
            default: 0
        },
        active: {
            type: Boolean,
            default: false
        },
        publishWebsite: {
            type: Boolean,
            default: true
        },
        publishApp: {
            type: Boolean,
            default: true
        }
    },
    images: [{
        type: String
    }],
    publishWebsite: {
        type: Boolean,
        default: true
    },
    publishApp: {
        type: Boolean,
        default: true
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Room = mongoose.model("Room", roomSchema);

export default Room; 
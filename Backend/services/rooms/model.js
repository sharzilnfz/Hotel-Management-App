import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Room name is required"],
        trim: true
    },
    type: {
        type: String,
        required: [true, "Room type is required"],
        trim: true
    },
    category: {
        type: String,
        required: [true, "Room category is required"],
        trim: true
    },
    bedType: {
        type: String,
        required: [true, "Bed type is required"],
        trim: true
    },
    capacity: {
        type: Number,
        required: [true, "Capacity is required"],
        min: [1, "Capacity must be at least 1"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"]
    },
    totalRooms: {
        type: Number,
        required: [true, "Total rooms count is required"],
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
    isRefundable: {
        type: Boolean,
        default: true
    },
    refundPolicy: {
        type: String,
        default: ""
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
    amenities: {
        type: [String],
        default: []
    },
    payNow: {
        type: Boolean,
        default: true
    },
    payAtHotel: {
        type: Boolean,
        default: true
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
    cancellationPolicy: {
        type: String,
        default: "flexible"
    },
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
    },
    images: {
        type: [String],
        default: []
    }
}, { timestamps: true });

const Room = mongoose.model("Room", roomSchema);

export default Room; 
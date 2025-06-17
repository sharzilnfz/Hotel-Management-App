import mongoose from "mongoose";

const addonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Add-on name is required"]
    },
    price: {
        type: Number,
        required: [true, "Add-on price is required"],
        min: [0, "Price must be a positive number"]
    }
});

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Event title is required"],
        minlength: [2, "Title must be at least 2 characters"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        minlength: [10, "Description must be at least 10 characters"]
    },
    date: {
        type: Date,
        required: [true, "Event date is required"]
    },
    startTime: {
        type: String,
        required: [true, "Start time is required"],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter a valid time in format HH:MM"]
    },
    endTime: {
        type: String,
        required: [true, "End time is required"],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter a valid time in format HH:MM"]
    },
    bookingDeadlineDate: {
        type: Date,
        required: [true, "Booking deadline date is required"]
    },
    bookingDeadlineTime: {
        type: String,
        required: [true, "Booking deadline time is required"],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter a valid time in format HH:MM"]
    },
    location: {
        type: String,
        required: [true, "Location is required"],
        minlength: [2, "Location must be at least 2 characters"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price must be a positive number"]
    },
    maxAttendees: {
        type: Number,
        required: [true, "Maximum attendees is required"],
        min: [1, "Maximum attendees must be at least 1"]
    },
    currentAttendees: {
        type: Number,
        default: 0,
        min: [0, "Current attendees cannot be negative"]
    },
    isRefundable: {
        type: Boolean,
        default: true
    },
    refundPolicy: {
        type: String,
        default: "Full refund if cancelled 48 hours before the event. 50% refund if cancelled 24 hours before."
    },
    addons: [addonSchema],
    images: [{
        type: String
    }],
    status: {
        type: String,
        enum: ["upcoming", "ongoing", "completed", "cancelled"],
        default: "upcoming"
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
    }
}, {
    timestamps: true
});

const Event = mongoose.model("Event", eventSchema);

export default Event; 
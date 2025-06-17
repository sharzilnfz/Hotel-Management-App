import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: [true, "Table number is required"],
        unique: true,
        min: [1, "Table number must be greater than 0"]
    },
    capacity: {
        type: Number,
        required: [true, "Table capacity is required"],
        min: [1, "Capacity must be at least 1"],
        max: [20, "Capacity cannot exceed 20"]
    },
    status: {
        type: String,
        enum: ["available", "occupied", "reserved"],
        default: "available"
    },
    reservationTime: {
        type: String,
        default: null
    },
    customerName: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

const Table = mongoose.model("Table", tableSchema);

export default Table; 
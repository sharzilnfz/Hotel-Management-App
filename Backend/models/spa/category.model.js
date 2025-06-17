import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Category name is required"],
        trim: true,
        minlength: [2, "Category name must be at least 2 characters"]
    },
    description: {
        type: String,
        required: [true, "Category description is required"],
        trim: true,
        minlength: [10, "Category description must be at least 10 characters"]
    },
    serviceCount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    }
}, { timestamps: true });

const Category = mongoose.model("Category", categorySchema);

export default Category; 
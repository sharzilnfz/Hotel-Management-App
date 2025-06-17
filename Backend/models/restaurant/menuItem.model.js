import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: [3, "Name must be at least 3 characters"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        minlength: [10, "Description must be at least 10 characters"]
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuCategory",
        required: [true, "Category is required"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price must be a positive number"]
    },
    preparationTime: {
        type: Number,
        required: [true, "Preparation time is required"],
        min: [1, "Preparation time must be a positive number"]
    },
    ingredients: {
        type: String,
        required: [true, "Ingredients are required"],
        minlength: [5, "Ingredients must be at least 5 characters"]
    },
    available: {
        type: Boolean,
        default: true
    },
    extras: [{
        name: {
            type: String,
            required: [true, "Extra name is required"]
        },
        price: {
            type: Number,
            required: [true, "Extra price is required"],
            min: [0, "Extra price must be a non-negative number"]
        }
    }],
    images: [{
        type: String,
        required: [true, "At least one image is required"]
    }]
}, {
    timestamps: true
});

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

export default MenuItem; 
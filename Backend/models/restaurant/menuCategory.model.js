import mongoose from "mongoose";

const menuCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Category name is required"],
        unique: true,
        minlength: [2, "Category name must be at least 2 characters"],
        maxlength: [50, "Category name must not exceed 50 characters"],
        trim: true
    },
    description: {
        type: String,
        maxlength: [200, "Description must not exceed 200 characters"],
        trim: true
    },
    sortOrder: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Add index for better query performance
menuCategorySchema.index({ name: 1 });
menuCategorySchema.index({ sortOrder: 1 });

const MenuCategory = mongoose.model("MenuCategory", menuCategorySchema);

export default MenuCategory; 
import mongoose from "mongoose";

const accessLevelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Access level name is required"],
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        permissions: {
            type: [String],
            default: []
        }
    },
    { timestamps: true }
);

const AccessLevel = mongoose.model("AccessLevel", accessLevelSchema);

export default AccessLevel; 
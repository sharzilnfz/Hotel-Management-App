import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Role name is required"],
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
        },
        permissions: {
            type: [String],
            default: []
        }
    },
    { timestamps: true }
);

const Role = mongoose.model("Role", roleSchema);

export default Role; 
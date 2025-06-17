import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Department name is required"],
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        }
    },
    { timestamps: true }
);

const Department = mongoose.model("Department", departmentSchema);

export default Department; 
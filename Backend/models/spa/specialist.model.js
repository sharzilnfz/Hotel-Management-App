import mongoose from "mongoose";

const specialistSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true
    },
    bio: {
        type: String,
        required: [true, "Bio is required"],
        minlength: [20, "Bio must be at least 20 characters long"]
    },
    nationality: {
        type: String,
        required: [true, "Nationality is required"],
        trim: true
    },
    experienceYears: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    languages: {
        type: String,
        required: [true, "At least one language is required"]
    },
    specializations: [
        {
            id: Number,
            name: String
        }
    ],
    photo: {
        type: String, // Path to the uploaded photo
        default: ""
    }
}, { timestamps: true });

const Specialist = mongoose.model("Specialist", specialistSchema);

export default Specialist; 
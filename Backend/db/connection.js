import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongose_connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Successfully connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        throw error;
    }
}

export default mongose_connect;
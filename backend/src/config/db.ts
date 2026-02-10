import mongoose from "mongoose";
import logger from "../config/logger";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        logger.info("MongoDB connected");
    } catch (error) {
        logger.error("MongoDB connection failed", error);
        process.exit(1);
    }

}
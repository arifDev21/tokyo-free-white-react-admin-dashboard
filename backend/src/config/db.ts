import mongoose from "mongoose";
import { config } from "./environment";

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = config.MONGODB_URI;

    await mongoose.connect(mongoURI);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;

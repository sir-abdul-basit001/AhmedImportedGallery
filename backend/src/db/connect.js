import mongoose from "mongoose";
import { env } from "../services/env.js";

export default async function connectDB() {
  try {
    await mongoose.connect(env.mongoUri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

import mongoose from "mongoose"
import { env } from "../services/env.js"

let connectionPromise = null

export default async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(env.mongoUri)
      .then(() => {
        console.log("MongoDB connected")
        return mongoose.connection
      })
      .catch((error) => {
        connectionPromise = null
        console.error("MongoDB connection failed:", error.message)
        throw error
      })
  }

  return connectionPromise
}

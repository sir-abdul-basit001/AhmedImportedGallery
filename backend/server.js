import { env } from "./src/services/env.js"
import app from "./src/app.js"
import connectDB from "./src/db/connect.js"
import mongoose from "mongoose"

await connectDB()

let server

if (!process.env.VERCEL) {
  server = app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`)
  })
}

const shutdown = async () => {
  if (server) {
    server.close(async () => {
      await mongoose.disconnect()
      process.exit(0)
    })
  }
}

if (server) {
  process.on("SIGTERM", shutdown)
  process.on("SIGINT", shutdown)
}

export default app

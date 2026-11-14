import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import express from "express"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import rateLimit from "express-rate-limit"
import { env } from "./services/env.js"
import sanitize from "./middleware/sanitize.js"
import originCheck from "./middleware/originCheck.js"
import { notFound, errorHandler } from "./middleware/errorHandler.js"
import authRoutes from "./routes/authRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import galleryRoutes from "./routes/galleryRoutes.js"
import imageRoutes from "./routes/imageRoutes.js"
import settingsRoutes from "./routes/settingsRoutes.js"
import contactRoutes from "./routes/contactRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"

const app = express()
app.set("trust proxy", 1)
app.disable("x-powered-by")

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://cdnjs.cloudflare.com",
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
          "https://cdnjs.cloudflare.com",
        ],
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        mediaSrc: ["'self'", "https:"],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
  }),
)
app.use(express.json({ limit: "20kb" }))
app.use(cookieParser())
app.use(sanitize)
app.use(
  "/api",
  rateLimit({ windowMs: 15 * 60 * 1000, limit: 600 }),
  originCheck,
)

app.get("/api/health", (req, res) => res.json({ ok: true }))
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/gallery", galleryRoutes)
app.use("/api/images", imageRoutes)
app.use("/api/settings", settingsRoutes)
app.use("/api/contact", contactRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api", notFound)

// Production: serve the built React app from the same server (same origin = safest cookies)
const dist = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../frontend/dist",
)
if (fs.existsSync(dist)) {
  app.use(express.static(dist, { index: false, maxAge: "1h" }))
  app.use((req, res, next) => {
    if (req.method !== "GET") return next()
    res.set("Cache-Control", "no-cache")
    res.sendFile(path.join(dist, "index.html"))
  })
}

app.use(notFound)
app.use(errorHandler)
export default app

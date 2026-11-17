import "dotenv/config"

for (const key of ["MONGO_URI", "JWT_SECRET"]) {
  if (!process.env[key]) {
    console.error(`Missing environment variable: ${key}`)
    process.exit(1)
  }
}

if (process.env.JWT_SECRET.length < 32) {
  console.error("JWT_SECRET must be at least 32 characters")
  process.exit(1)
}

const isProduction =
  process.env.VERCEL === "1" || process.env.NODE_ENV === "production"

export const env = {
  port: Number(process.env.PORT) || 5000,
  isProd: isProduction,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
}

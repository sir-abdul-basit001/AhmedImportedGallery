import { env } from "../services/env.js"

export default function originCheck(req, res, next) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next()
  }

  const origin = req.get("origin")

  if (!origin) {
    return next()
  }

  try {
    const requestOrigin = new URL(origin).origin
    const clientOrigin = new URL(env.clientUrl).origin
    const serverOrigin = `${req.protocol}://${req.get("host")}`

    if (requestOrigin === clientOrigin || requestOrigin === serverOrigin) {
      return next()
    }
  } catch {
    return res.status(403).json({
      message: "Invalid origin",
    })
  }

  return res.status(403).json({
    message: "Forbidden origin",
  })
}

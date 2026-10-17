import { env } from "../services/env.js";

export default function originCheck(req, res, next) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  const origin = req.get("origin");
  if (!origin) return next();
  try {
    if (new URL(origin).host === req.get("host") || origin === env.clientUrl) return next();
  } catch { /* fall through */ }
  res.status(403).json({ message: "Forbidden origin" });
}

import { Router } from "express";
import rateLimit from "express-rate-limit";
import { register, login, logout, me, changePassword } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema, passwordSchema } from "../services/schemas.js";

const r = Router();
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, message: { message: "Too many attempts, try again later" } });

r.post("/register", limiter, validate(registerSchema), register);
r.post("/login", limiter, validate(loginSchema), login);
r.post("/logout", logout);
r.get("/me", protect, me);
r.put("/password", protect, limiter, validate(passwordSchema), changePassword);
export default r;

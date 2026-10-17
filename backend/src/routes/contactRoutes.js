import { Router } from "express";
import rateLimit from "express-rate-limit";
import { sendMessage } from "../controllers/contactController.js";
import { validate } from "../middleware/validate.js";
import { contactSchema } from "../services/schemas.js";

const r = Router();
r.post("/", rateLimit({ windowMs: 60 * 60 * 1000, limit: 10, message: { message: "Too many messages, try later" } }), validate(contactSchema), sendMessage);
export default r;

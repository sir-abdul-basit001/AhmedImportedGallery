import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { settingsSchema } from "../services/schemas.js";

const r = Router();
r.get("/", getSettings);
r.put("/", protect, adminOnly, validate(settingsSchema), updateSettings);
export default r;

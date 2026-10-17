import { Router } from "express";
import crud from "../controllers/galleryController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { checkId } from "../middleware/checkId.js";
import { gallerySchema } from "../services/schemas.js";

const r = Router();
r.param("id", checkId);
r.get("/", crud.list);
r.post("/", protect, adminOnly, validate(gallerySchema), crud.create);
r.put("/:id", protect, adminOnly, validate(gallerySchema), crud.update);
r.delete("/:id", protect, adminOnly, crud.remove);
export default r;

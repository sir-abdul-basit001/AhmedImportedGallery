import { Router } from "express";
import { uploadImage, getImage } from "../controllers/imageController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { checkId } from "../middleware/checkId.js";

const r = Router();
r.param("id", checkId);
r.post("/", protect, adminOnly, upload.single("image"), uploadImage);
r.get("/:id", getImage);
export default r;

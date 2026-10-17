import { Router } from "express";
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { checkId } from "../middleware/checkId.js";
import { productSchema } from "../services/schemas.js";

const r = Router();
r.param("id", checkId);
r.get("/", listProducts);
r.get("/:id", getProduct);
r.post("/", protect, adminOnly, validate(productSchema), createProduct);
r.put("/:id", protect, adminOnly, validate(productSchema), updateProduct);
r.delete("/:id", protect, adminOnly, deleteProduct);
export default r;

import { Router } from "express";
import rateLimit from "express-rate-limit";
import { createOrder, myOrders } from "../controllers/orderController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { orderSchema } from "../services/schemas.js";

const r = Router();
r.use(protect);
r.get("/mine", myOrders);
r.post("/", rateLimit({ windowMs: 60 * 60 * 1000, limit: 20, message: { message: "Too many orders, try later" } }), validate(orderSchema), createOrder);
export default r;

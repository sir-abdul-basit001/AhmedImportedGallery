import { Router } from "express";
import * as c from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { checkId } from "../middleware/checkId.js";
import { orderStatusSchema, userPatchSchema } from "../services/schemas.js";

const r = Router();
r.param("id", checkId);
r.use(protect, adminOnly);
r.get("/stats", c.stats);
r.get("/users", c.listUsers);
r.patch("/users/:id", validate(userPatchSchema), c.patchUser);
r.get("/orders", c.listOrders);
r.patch("/orders/:id", validate(orderStatusSchema), c.patchOrder);
r.get("/messages", c.listMessages);
r.patch("/messages/:id", c.toggleRead);
r.delete("/messages/:id", c.deleteMessage);
export default r;

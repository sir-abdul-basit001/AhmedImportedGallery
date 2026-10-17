import { env } from "./env.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { registerSchema } from "./schemas.js";

const r = registerSchema.safeParse({ name: process.env.ADMIN_NAME || "Admin", email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });
if (!r.success) { console.error("Set valid ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD (8+ chars, letter + number):", r.error.issues[0].message); process.exit(1); }

await mongoose.connect(env.mongoUri);
const { name, email, password } = r.data;
const hash = await bcrypt.hash(password, 12);
const user = await User.findOne({ email });
if (user) { user.role = "admin"; user.active = true; user.password = hash; user.tokenVersion += 1; await user.save(); }
else await User.create({ name, email, password: hash, role: "admin" });
console.log(`Admin ready: ${email}`);
await mongoose.disconnect();

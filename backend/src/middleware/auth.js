import mongoose from "mongoose";
import User from "../models/User.js";
import { verifyToken } from "../services/token.js";

export const protect = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Please log in" });
  let payload;
  try { payload = verifyToken(token); } catch { return res.status(401).json({ message: "Session expired" }); }
  if (!mongoose.isValidObjectId(payload.sub)) return res.status(401).json({ message: "Invalid session" });
  const user = await User.findById(payload.sub);
  if (!user || !user.active || user.tokenVersion !== payload.v) return res.status(401).json({ message: "Invalid session" });
  req.user = user;
  next();
};

export const adminOnly = (req, res, next) =>
  req.user?.role === "admin" ? next() : res.status(403).json({ message: "Admins only" });

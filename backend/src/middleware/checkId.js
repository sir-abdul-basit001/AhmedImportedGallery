import mongoose from "mongoose";
export const checkId = (req, res, next, id) =>
  mongoose.isValidObjectId(id) ? next() : res.status(400).json({ message: "Invalid id" });

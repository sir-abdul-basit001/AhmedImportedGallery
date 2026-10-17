import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 60 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  active: { type: Boolean, default: true },
  tokenVersion: { type: Number, default: 0 },
  failedLogins: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.model("User", userSchema);

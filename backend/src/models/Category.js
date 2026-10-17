import mongoose from "mongoose";
export default mongoose.model("Category", new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true, maxlength: 60 },
  image: { type: String, default: "" },
}, { timestamps: true }));

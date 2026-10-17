import mongoose from "mongoose";
export default mongoose.model("Product", new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, default: "" },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, default: "" },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true, index: true },
  badge: { type: String, enum: ["", "New", "Sale"], default: "" },
  featured: { type: Boolean, default: false },
  inStock: { type: Boolean, default: true },
}, { timestamps: true }));

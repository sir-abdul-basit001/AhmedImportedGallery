import mongoose from "mongoose";
export default mongoose.model("Order", new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  items: [{ product: mongoose.Schema.Types.ObjectId, name: String, price: Number, qty: Number, image: String }],
  total: { type: Number, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  note: { type: String, default: "" },
  paymentMethod: { type: String, default: "Cash on delivery" },
  status: { type: String, enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"], default: "pending" },
}, { timestamps: true }));

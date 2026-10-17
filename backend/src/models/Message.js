import mongoose from "mongoose";
export default mongoose.model("Message", new mongoose.Schema({
  name: { type: String, required: true, maxlength: 80 },
  email: { type: String, required: true, maxlength: 120 },
  phone: { type: String, default: "" },
  message: { type: String, required: true, maxlength: 1500 },
  read: { type: Boolean, default: false },
}, { timestamps: true }));

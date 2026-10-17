import mongoose from "mongoose";
export default mongoose.model("Image", new mongoose.Schema({
  data: { type: Buffer, required: true },
  contentType: { type: String, required: true },
}, { timestamps: true }));

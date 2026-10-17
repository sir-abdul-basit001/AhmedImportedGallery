import mongoose from "mongoose";
export default mongoose.model("GalleryItem", new mongoose.Schema({
  image: { type: String, required: true },
  caption: { type: String, default: "", maxlength: 200 },
}, { timestamps: true }));

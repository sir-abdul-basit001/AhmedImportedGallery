import Image from "../models/Image.js";

const sniff = (b) => {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b.subarray(0, 8).toString("hex") === "89504e470d0a1a0a") return "image/png";
  if (b.subarray(0, 4).toString() === "RIFF" && b.subarray(8, 12).toString() === "WEBP") return "image/webp";
  return null;
};

export const uploadImage = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No image uploaded" });
  const type = sniff(req.file.buffer);
  if (!type) return res.status(400).json({ message: "File is not a valid image" });
  const img = await Image.create({ data: req.file.buffer, contentType: type });
  res.status(201).json({ url: `/api/images/${img._id}` });
};

export const getImage = async (req, res) => {
  const img = await Image.findById(req.params.id);
  if (!img) return res.status(404).end();
  res.set({ "Content-Type": img.contentType, "Cache-Control": "public, max-age=31536000, immutable" });
  res.send(img.data);
};

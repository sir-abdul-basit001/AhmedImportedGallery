import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) =>
    ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype) ? cb(null, true) : cb(new Error("Only JPG, PNG or WebP images")),
});

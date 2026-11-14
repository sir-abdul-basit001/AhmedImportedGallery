import multer from "multer"

export const upload = multer({
  storage: multer.memoryStorage(),

  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]

    if (allowedTypes.includes(file.mimetype)) {
      return cb(null, true)
    }

    cb(new Error("Only JPG, PNG or WebP images are allowed."))
  },
})

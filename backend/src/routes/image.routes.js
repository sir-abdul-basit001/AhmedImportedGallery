import { Router } from "express"
import multer from "multer"
import { uploadImage } from "../controllers/imageController.js"

const router = Router()

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG and WebP images are allowed."))
    }

    cb(null, true)
  },
})

router.post(
  "/",
  (req, res, next) => {
    console.log("IMAGE UPLOAD REQUEST RECEIVED")
    console.log("Content-Type:", req.headers["content-type"])

    next()
  },
  upload.single("image"),
  (req, res, next) => {
    console.log(
      "MULTER RESULT:",
      req.file
        ? {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
          }
        : "NO FILE RECEIVED",
    )

    next()
  },
  uploadImage,
)

export default router

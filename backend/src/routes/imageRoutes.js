import { Router } from "express"
import { uploadImage } from "../controllers/imageController.js"
import { protect, adminOnly } from "../middleware/auth.js"
import { upload } from "../middleware/upload.js"

const router = Router()

router.post(
  "/",
  protect,
  adminOnly,
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

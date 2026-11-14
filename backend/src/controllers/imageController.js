import ImageKit from "imagekit"

let imageKitInstance

const getImageKit = () => {
  if (imageKitInstance) {
    return imageKitInstance
  }

  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT

  if (!publicKey || !privateKey || !urlEndpoint) {
    throw new Error("ImageKit environment variables are missing.")
  }

  imageKitInstance = new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint,
  })

  return imageKitInstance
}

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image provided. Multer did not receive the file.",
      })
    }

    const result = await getImageKit().upload({
      file: req.file.buffer,
      fileName: `${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_")}`,
      folder: "/uploads",
      useUniqueFileName: true,
    })

    return res.status(201).json({
      message: "Image uploaded successfully.",
      url: result.url,
      fileId: result.fileId,
    })
  } catch (error) {
    console.error("IMAGEKIT UPLOAD ERROR:", error)
    next(error)
  }
}

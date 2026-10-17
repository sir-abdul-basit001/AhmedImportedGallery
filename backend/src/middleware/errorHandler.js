export const notFound = (req, res) => res.status(404).json({ message: "Route not found" });

export const errorHandler = (err, req, res, next) => {
  if (err.name === "MulterError" || err.message === "Only JPG, PNG or WebP images")
    return res.status(400).json({ message: err.code === "LIMIT_FILE_SIZE" ? "Image must be under 3MB" : err.message });
  if (err.name === "ValidationError" || err.name === "CastError") return res.status(400).json({ message: "Invalid data" });
  if (err.code === 11000) return res.status(409).json({ message: "Already exists" });
  if (err.type === "entity.parse.failed") return res.status(400).json({ message: "Bad JSON" });
  console.error(err);
  res.status(500).json({ message: "Server error" });
};

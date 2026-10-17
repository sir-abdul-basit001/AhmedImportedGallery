export const validate = (schema) => (req, res, next) => {
  const r = schema.safeParse(req.body ?? {});
  if (!r.success) return res.status(400).json({ message: r.error.issues[0]?.message || "Invalid input" });
  req.body = r.data;
  next();
};

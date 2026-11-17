export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body ?? {})

  if (!result.success) {
    return res.status(400).json({
      message: result.error.issues[0]?.message || "Invalid input",
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    })
  }

  req.body = result.data
  next()
}

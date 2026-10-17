export const makeCrud = (Model, { populate, sort = { createdAt: -1 }, beforeRemove } = {}) => ({
  list: async (req, res) => {
    let q = Model.find().sort(sort);
    if (populate) q = q.populate(populate);
    res.json(await q);
  },
  create: async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json(populate ? await doc.populate(populate) : doc);
  },
  update: async (req, res) => {
    let q = Model.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after", runValidators: true });
    if (populate) q = q.populate(populate);
    const doc = await q;
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json(doc);
  },
  remove: async (req, res) => {
    if (beforeRemove) {
      const msg = await beforeRemove(req.params.id);
      if (msg) return res.status(409).json({ message: msg });
    }
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  },
});

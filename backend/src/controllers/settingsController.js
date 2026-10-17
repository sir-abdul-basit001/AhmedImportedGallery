import Setting from "../models/Setting.js";

const load = () => Setting.findOneAndUpdate({ key: "main" }, { $setOnInsert: { key: "main" } }, { upsert: true, returnDocument: "after" });

export const getSettings = async (req, res) => res.json(await load());

export const updateSettings = async (req, res) => {
  await load();
  res.json(await Setting.findOneAndUpdate({ key: "main" }, { $set: req.body }, { returnDocument: "after", runValidators: true }));
};

import Message from "../models/Message.js";
export const sendMessage = async (req, res) => {
  await Message.create(req.body);
  res.status(201).json({ message: "Message sent" });
};

import User from "../models/User.js";
import Order from "../models/Order.js";
import Message from "../models/Message.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

export const stats = async (req, res) => {
  const [products, categories, users, orders, pending, unread, revenue] = await Promise.all([
    Product.countDocuments(), Category.countDocuments(), User.countDocuments(), Order.countDocuments(),
    Order.countDocuments({ status: "pending" }), Message.countDocuments({ read: false }),
    Order.aggregate([{ $match: { status: { $ne: "cancelled" } } }, { $group: { _id: null, total: { $sum: "$total" } } }]),
  ]);
  res.json({ products, categories, users, orders, pending, unread, revenue: revenue[0]?.total || 0 });
};

export const listUsers = async (req, res) => res.json(await User.find().sort({ createdAt: -1 }).select("name email role active createdAt"));

export const patchUser = async (req, res) => {
  if (String(req.user._id) === req.params.id) return res.status(400).json({ message: "You cannot change your own account here" });
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (req.body.role) user.role = req.body.role;
  if (typeof req.body.active === "boolean") user.active = req.body.active;
  user.tokenVersion += 1;
  await user.save();
  res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, active: user.active, createdAt: user.createdAt });
};

export const listOrders = async (req, res) => res.json(await Order.find().sort({ createdAt: -1 }).limit(300).populate("user", "name email"));

export const patchOrder = async (req, res) => {
  const o = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { returnDocument: "after" }).populate("user", "name email");
  if (!o) return res.status(404).json({ message: "Order not found" });
  res.json(o);
};

export const listMessages = async (req, res) => res.json(await Message.find().sort({ createdAt: -1 }).limit(300));

export const toggleRead = async (req, res) => {
  const m = await Message.findById(req.params.id);
  if (!m) return res.status(404).json({ message: "Message not found" });
  m.read = !m.read;
  await m.save();
  res.json(m);
};

export const deleteMessage = async (req, res) => {
  await Message.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

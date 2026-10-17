import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  const { items, phone, address, note } = req.body;
  const ids = [...new Set(items.map((i) => i.product))];
  const products = await Product.find({ _id: { $in: ids } });
  const map = new Map(products.map((p) => [String(p._id), p]));
  const lines = [];
  for (const i of items) {
    const p = map.get(i.product);
    if (!p) return res.status(400).json({ message: "A product in your cart no longer exists" });
    if (!p.inStock) return res.status(400).json({ message: `${p.name} is out of stock` });
    lines.push({ product: p._id, name: p.name, price: p.price, qty: i.qty, image: p.image }); // price always comes from the database
  }
  const total = lines.reduce((t, l) => t + l.price * l.qty, 0);
  const order = await Order.create({ user: req.user._id, items: lines, total, phone, address, note });
  res.status(201).json(order);
};

export const myOrders = async (req, res) => res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 }));

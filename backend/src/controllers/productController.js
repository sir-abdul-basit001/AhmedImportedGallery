import mongoose from "mongoose";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { makeCrud } from "./crud.js";

const crud = makeCrud(Product, { populate: { path: "category", select: "name" } });
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const listProducts = async (req, res) => {
  const { category, q, featured, limit } = req.query;
  const f = {};
  if (typeof category === "string" && mongoose.isValidObjectId(category)) f.category = category;
  if (typeof q === "string" && q.trim()) f.name = { $regex: esc(q.trim().slice(0, 60)), $options: "i" };
  if (featured === "true") f.featured = true;
  const lim = Math.min(parseInt(limit) || 200, 200);
  res.json(await Product.find(f).sort({ createdAt: -1 }).limit(lim).populate("category", "name"));
};

export const getProduct = async (req, res) => {
  const p = await Product.findById(req.params.id).populate("category", "name");
  if (!p) return res.status(404).json({ message: "Product not found" });
  res.json(p);
};

const needCategory = (fn) => async (req, res) =>
  (await Category.exists({ _id: req.body.category })) ? fn(req, res) : res.status(400).json({ message: "Category not found" });

export const createProduct = needCategory(crud.create);
export const updateProduct = needCategory(crud.update);
export const deleteProduct = crud.remove;

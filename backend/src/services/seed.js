import { env } from "./env.js";
import mongoose from "mongoose";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

await mongoose.connect(env.mongoUri);
if (await Category.countDocuments()) { console.log("Data already exists, skipping seed."); process.exit(0); }
const names = ["Curtains", "رضائ", "Lady Shirts", "Frock", "School Bag", "Cut pieces"];
const cats = await Category.insertMany(names.map((name) => ({ name })));
await Product.insertMany([
  { name: "Shoes", price: 620, category: cats[0]._id, badge: "New", featured: true },
  { name: "Boys shirts", price: 1890, category: cats[2]._id, badge: "Sale", featured: true },
  { name: "Caps", price: 890, category: cats[2]._id, featured: true },
  { name: "Hand Bags", price: 180, category: cats[4]._id, featured: true },
]);
console.log("Seeded sample categories and products. Add images from the admin panel.");
await mongoose.disconnect();

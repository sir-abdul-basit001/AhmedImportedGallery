import { env } from "./env.js"
import mongoose from "mongoose"
import Category from "../models/Category.js"
import Product from "../models/Product.js"

const seedDatabase = async () => {
  try {
    await mongoose.connect(env.mongoUri)

    console.log("MongoDB connected.")

    if (await Category.countDocuments()) {
      console.log("Data already exists, skipping seed.")
      return
    }

    const names = [
      "Curtains",
      "رضائ",
      "Lady Shirts",
      "Frock",
      "School Bag",
      "Cut pieces",
    ]

    const categories = await Category.insertMany(
      names.map((name) => ({ name })),
    )

    const products = [
      {
        name: "Shoes",
        price: 620,
        category: categories[0]._id,
        badge: "New",
        featured: true,
      },
      {
        name: "Boys shirts",
        price: 1890,
        category: categories[1]._id,
        badge: "Sale",
        featured: true,
      },
      {
        name: "Caps",
        price: 890,
        category: categories[1]._id,
        featured: true,
      },
      {
        name: "Hand Bags",
        price: 1800,
        category: categories[4]._id,
        featured: true,
      },
    ]

    await Product.insertMany(products)

    console.log("Seeded sample categories and products.")
    console.log("Add product images from the admin panel.")
  } catch (error) {
    console.error("Database seeding failed:", error)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
    console.log("MongoDB disconnected.")
  }
}

await seedDatabase()

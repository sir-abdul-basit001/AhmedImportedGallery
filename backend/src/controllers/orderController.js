import Product from "../models/Product.js"
import Order from "../models/Order.js"

export const createOrder = async (req, res) => {
  try {
    const { items, phone, address, note = "" } = req.body || {}

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Your cart is empty or invalid",
      })
    }

    if (!phone || !String(phone).trim()) {
      return res.status(400).json({
        message: "Phone number is required",
      })
    }

    if (!address || !String(address).trim()) {
      return res.status(400).json({
        message: "Delivery address is required",
      })
    }

    const invalidItem = items.some(
      (item) =>
        !item.product ||
        !Number.isInteger(Number(item.qty)) ||
        Number(item.qty) < 1 ||
        Number(item.qty) > 50,
    )

    if (invalidItem) {
      return res.status(400).json({
        message: "Invalid cart items or quantities",
      })
    }

    const ids = [...new Set(items.map((item) => String(item.product)))]

    const products = await Product.find({
      _id: { $in: ids },
    })

    const productMap = new Map(
      products.map((product) => [String(product._id), product]),
    )

    const lines = []

    for (const item of items) {
      const product = productMap.get(String(item.product))

      if (!product) {
        return res.status(400).json({
          message: "A product in your cart no longer exists",
        })
      }

      if (!product.inStock) {
        return res.status(400).json({
          message: `${product.name} is out of stock`,
        })
      }

      lines.push({
        product: product._id,
        name: product.name,
        price: product.price,
        qty: Number(item.qty),
        image: product.image,
      })
    }

    const total = lines.reduce((sum, item) => sum + item.price * item.qty, 0)

    const order = await Order.create({
      user: req.user._id,
      items: lines,
      total,
      phone: String(phone).trim(),
      address: String(address).trim(),
      note: String(note).trim(),
    })

    return res.status(201).json(order)
  } catch (error) {
    console.error("Order creation failed:", error)

    return res.status(500).json({
      message: "Could not create your order",
    })
  }
}

export const myOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    })

    return res.json(orders)
  } catch (error) {
    console.error("Loading orders failed:", error)

    return res.status(500).json({
      message: "Could not load your orders",
    })
  }
}

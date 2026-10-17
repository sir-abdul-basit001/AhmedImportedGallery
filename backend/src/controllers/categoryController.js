import Category from "../models/Category.js";
import Product from "../models/Product.js";
import { makeCrud } from "./crud.js";

export default makeCrud(Category, {
  sort: { createdAt: 1 },
  beforeRemove: async (id) => ((await Product.exists({ category: id })) ? "This category still has products. Move or delete them first." : null),
});

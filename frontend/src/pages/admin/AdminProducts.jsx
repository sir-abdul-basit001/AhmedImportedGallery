import { useEffect, useState } from "react";
import axios from "axios";
import ResourceManager from "../../Components/ResourceManager.jsx";
import Img from "../../Components/Img.jsx";

export default function AdminProducts() {
  const [cats, setCats] = useState([]);
  useEffect(() => { axios.get("/api/categories").then((r) => setCats(r.data)).catch(() => {}); }, []);
  const fields = [
    { name: "name", label: "Name", required: true },
    { name: "price", label: "Price (PKR)", type: "number", required: true },
    { name: "category", label: "Category", type: "select", required: true, get: (r) => r.category?._id || "", options: cats.map((c) => ({ value: c._id, label: c.name })) },
    { name: "image", label: "Image", type: "image" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "badge", label: "Badge", type: "select", options: [{ value: "New", label: "New" }, { value: "Sale", label: "Sale" }] },
    { name: "featured", label: "Show on home page", type: "checkbox" },
    { name: "inStock", label: "In stock", type: "checkbox", default: true },
  ];
  const columns = [
    { label: "Image", render: (r) => <Img src={r.image} alt="" className="size-14 rounded-lg object-cover" /> },
    { label: "Name", render: (r) => r.name },
    { label: "Category", render: (r) => r.category?.name },
    { label: "Price", render: (r) => `PKR ${r.price}` },
    { label: "Status", render: (r) => [r.inStock ? "In stock" : "Out of stock", r.featured ? "Featured" : ""].filter(Boolean).join(" / ") },
  ];
  return <ResourceManager title="Products" noun="product" endpoint="/api/products" fields={fields} columns={columns} />;
}

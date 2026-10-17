import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../Components/ProductCard.jsx";
import { fail } from "../toast.js";
import { page, h1, input, grid4 } from "../ui.js";

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const q = params.get("q") || "";
  const category = params.get("category") || "";

  useEffect(() => { axios.get("/api/categories").then((r) => setCats(r.data)).catch(() => {}); }, []);
  useEffect(() => {
    setLoading(true);
    axios.get("/api/products", { params: { q, category } }).then((r) => setProducts(r.data)).catch(() => fail("Could not load products")).finally(() => setLoading(false));
  }, [q, category]);

  const set = (k, v) => { const n = new URLSearchParams(params); v ? n.set(k, v) : n.delete(k); setParams(n); };

  return (
    <div className={page}>
      <h1 className={h1}>Shop</h1>
      <div className="mb-9 flex flex-wrap gap-4">
        <input className={`${input} min-w-52 flex-1`} placeholder="Search products..." defaultValue={q} key={q} onKeyDown={(e) => e.key === "Enter" && set("q", e.target.value.trim())} />
        <select className={`${input} min-w-52 flex-1`} value={category} onChange={(e) => set("category", e.target.value)}>
          <option value="">All categories</option>
          {cats.map((c) => (<option key={c._id} value={c._id}>{c.name}</option>))}
        </select>
      </div>
      {loading ? <p className="text-sub">Loading...</p> : products.length === 0 ? <p className="text-sub">No products found.</p> : (
        <div className={grid4}>{products.map((p) => <ProductCard key={p._id} p={p} />)}</div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../Components/CartContext.jsx";
import Img from "../Components/Img.jsx";
import { ok } from "../toast.js";
import { page, btn, center, link } from "../ui.js";

export default function Product() {
  const { id } = useParams();
  const { add } = useCart();
  const [p, setP] = useState(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => { setP(null); setMissing(false); axios.get(`/api/products/${id}`).then((r) => setP(r.data)).catch(() => setMissing(true)); }, [id]);

  if (missing) return <div className={center}><h2 className="mb-3 text-2xl text-head">Product not found</h2><Link className={link} to="/shop">Back to shop</Link></div>;
  if (!p) return <div className={`${center} text-sub`}>Loading...</div>;
  return (
    <div className={`${page} grid grid-cols-2 items-start gap-12 max-md:grid-cols-1`}>
      <Img src={p.image} alt={p.name} loading="eager" className="max-h-[560px] rounded-3xl object-cover shadow-soft" />
      <div>
        <h1 className="text-4xl font-bold text-head">{p.name}</h1>
        <p className="text-sub">{p.category?.name}</p>
        <p className="my-4 text-3xl font-bold text-gold">PKR {p.price}</p>
        <p className="mb-8 leading-8 whitespace-pre-line text-sub">{p.description}</p>
        <button className={btn} disabled={!p.inStock} onClick={() => { add(p); ok("Added to cart"); }}>{p.inStock ? "Add to Cart" : "Out of stock"}</button>
      </div>
    </div>
  );
}

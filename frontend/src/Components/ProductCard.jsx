import { Link } from "react-router-dom";
import { useCart } from "./CartContext.jsx";
import { ok } from "../toast.js";
import Img from "./Img.jsx";

export default function ProductCard({ p }) {
  const { add } = useCart();
  return (
    <div className="group relative overflow-hidden rounded-[22px] bg-card shadow-soft transition duration-300 hover:-translate-y-3 before:pointer-events-none before:absolute before:top-0 before:-left-[150%] before:z-10 before:h-full before:w-[70%] before:-skew-x-[25deg] before:bg-linear-to-r before:from-transparent before:via-white/45 before:to-transparent hover:before:left-[180%] before:transition-all before:duration-700">
      {p.badge && <div className={`absolute top-4 left-4 z-20 rounded-full px-4 py-2 text-[13px] font-semibold text-white ${p.badge === "Sale" ? "bg-red-600" : "bg-navy"}`}>{p.badge}</div>}
      <Link to={`/product/${p._id}`}>
        <div className="overflow-hidden"><Img src={p.image} alt={p.name} className="h-[450px] object-cover transition duration-500 group-hover:scale-110 max-sm:h-[220px]" /></div>
        <h3 className="mx-5 mt-5 mb-2.5 text-[22px] text-head">{p.name}</h3>
      </Link>
      <p className="mx-5 mb-5 text-xl font-bold text-gold">PKR {p.price}</p>
      <button disabled={!p.inStock} onClick={() => { add(p); ok("Added to cart"); }}
        className="mx-5 mb-6 w-[calc(100%-2.5rem)] cursor-pointer rounded-full bg-linear-to-br from-navy to-[#1b4ea0] py-3.5 font-semibold text-white transition hover:enabled:-translate-y-1 hover:enabled:from-gold hover:enabled:to-[#d89c00] hover:enabled:text-[#222] disabled:cursor-not-allowed disabled:opacity-55">
        {p.inStock ? "Add to Cart" : "Out of stock"}
      </button>
    </div>
  );
}

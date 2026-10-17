import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Img from "../Components/Img.jsx";
import { page, h1 } from "../ui.js";

export default function Categories() {
  const [cats, setCats] = useState([]);
  useEffect(() => { axios.get("/api/categories").then((r) => setCats(r.data)).catch(() => {}); }, []);
  return (
    <div className={page}>
      <h1 className={h1}>Categories</h1>
      {cats.length === 0 ? <p className="text-sub">No categories yet.</p> : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8">
          {cats.map((c) => (
            <Link key={c._id} to={`/shop?category=${c._id}`} className="block overflow-hidden rounded-[22px] bg-card p-5 text-center shadow-soft transition duration-300 hover:-translate-y-3 hover:bg-navy hover:text-white">
              <Img src={c.image} alt={c.name} className="h-[260px] rounded-2xl object-cover" />
              <h3 className="pt-5 text-xl font-semibold">{c.name}</h3>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

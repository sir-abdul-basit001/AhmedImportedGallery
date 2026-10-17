import { useEffect, useState } from "react";
import axios from "axios";
import Img from "../Components/Img.jsx";
import { page, h1 } from "../ui.js";

export default function Gallery() {
  const [items, setItems] = useState([]);
  useEffect(() => { axios.get("/api/gallery").then((r) => setItems(r.data)).catch(() => {}); }, []);
  return (
    <div className={page}>
      <h1 className={h1}>Gallery</h1>
      {items.length === 0 ? <p className="text-sub">Photos coming soon.</p> : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
          {items.map((g) => (
            <figure key={g._id} className="group overflow-hidden rounded-[20px] bg-card shadow-soft">
              <div className="overflow-hidden"><Img src={g.image} alt={g.caption} className="h-[300px] object-cover transition duration-500 group-hover:scale-105" /></div>
              {g.caption && <figcaption className="px-4 py-3 text-sub">{g.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}

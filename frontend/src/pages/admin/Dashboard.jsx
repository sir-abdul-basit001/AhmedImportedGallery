import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [s, setS] = useState(null);
  useEffect(() => { axios.get("/api/admin/stats").then((r) => setS(r.data)).catch(() => {}); }, []);
  if (!s) return <p className="text-sub">Loading...</p>;
  const cards = [["Products", s.products], ["Categories", s.categories], ["Customers", s.users], ["Orders", s.orders], ["Pending orders", s.pending], ["Unread messages", s.unread], ["Revenue (PKR)", s.revenue]];
  return (
    <>
      <h1 className="mb-6 text-3xl font-bold text-head">Dashboard</h1>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-5">
        {cards.map(([l, v]) => (<div key={l} className="rounded-2xl bg-card p-6 shadow-soft"><b className="block text-4xl text-head">{v}</b><span className="text-sub">{l}</span></div>))}
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";
import { ok, fail, errMsg } from "../../toast.js";
import { orderCard, input } from "../../ui.js";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => { axios.get("/api/admin/orders").then((r) => setOrders(r.data)).catch(() => fail("Could not load orders")); }, []);

  const setStatus = async (id, status) => {
    try { const r = await axios.patch(`/api/admin/orders/${id}`, { status }); setOrders((o) => o.map((x) => (x._id === id ? r.data : x))); ok("Status updated"); }
    catch (err) { fail(errMsg(err)); }
  };

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold text-head">Orders</h1>
      {orders.length === 0 && <p className="text-sub">No orders yet.</p>}
      {orders.map((o) => (
        <div className={orderCard} key={o._id}>
          <div className="flex flex-wrap justify-between gap-2.5">
            <div><b>{o.user?.name || "Deleted user"}</b> <span className="text-sub">{o.user?.email}</span><br /><span className="text-sub">{new Date(o.createdAt).toLocaleString()}</span></div>
            <div className="flex items-center gap-3"><b>PKR {o.total}</b><select className={`${input} w-auto py-1.5`} value={o.status} onChange={(e) => setStatus(o._id, e.target.value)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></div>
          </div>
          <p className="my-2">{o.items.map((i) => `${i.name} x${i.qty}`).join(", ")}</p>
          <p className="text-sub"><i className="fa-solid fa-phone"></i> {o.phone} &nbsp; <i className="fa-solid fa-location-dot"></i> {o.address}{o.note && ` - Note: ${o.note}`}</p>
        </div>
      ))}
    </>
  );
}

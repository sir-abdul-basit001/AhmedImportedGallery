import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Components/AuthContext.jsx";
import { ok, fail, errMsg } from "../toast.js";
import { narrow, h1, input, btn, btnOutline, formCard, orderCard, pill } from "../ui.js";

const statusCls = { pending: "bg-yellow-100 text-yellow-800", delivered: "bg-green-100 text-green-800", cancelled: "bg-red-100 text-red-800" };

export default function Account() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [orders, setOrders] = useState([]);
  const [pw, setPw] = useState({ current: "", password: "" });

  useEffect(() => { axios.get("/api/orders/mine").then((r) => setOrders(r.data)).catch(() => {}); }, []);

  const changePw = async (e) => {
    e.preventDefault();
    try { await axios.put("/api/auth/password", pw); ok("Password updated"); setPw({ current: "", password: "" }); }
    catch (err) { fail(errMsg(err, "Could not update password")); }
  };

  return (
    <div className={narrow}>
      <h1 className={h1}>My Account</h1>
      <div className={formCard}>
        <p><b>{user.name}</b><br /><span className="text-sub">{user.email}</span></p>
        <div className="flex gap-4">
          {user.role === "admin" && <button className={btn} onClick={() => nav("/admin")}>Admin panel</button>}
          <button className={btnOutline} onClick={async () => { await logout(); nav("/"); }}>Log out</button>
        </div>
      </div>
      <h2 className="mt-10 mb-4 text-2xl font-bold text-head">My Orders</h2>
      {orders.length === 0 ? <p className="text-sub">No orders yet.</p> : orders.map((o) => (
        <div className={orderCard} key={o._id}>
          <div className="flex justify-between"><b>PKR {o.total}</b><span className={`${pill} ${statusCls[o.status] || ""}`}>{o.status}</span></div>
          <p className="text-sub">{new Date(o.createdAt).toLocaleDateString()} - {o.items.map((i) => `${i.name} x${i.qty}`).join(", ")}</p>
        </div>
      ))}
      <form className={`${formCard} mt-8`} onSubmit={changePw}>
        <h2 className="text-2xl font-bold text-head">Change password</h2>
        <input className={input} type="password" placeholder="Current password" autoComplete="current-password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} required />
        <input className={input} type="password" placeholder="New password (8+ characters, letter and number)" autoComplete="new-password" value={pw.password} onChange={(e) => setPw({ ...pw, password: e.target.value })} required minLength={8} />
        <button className={btn}>Update password</button>
      </form>
    </div>
  );
}

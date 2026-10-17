import { useEffect, useState } from "react";
import axios from "axios";
import { fail, errMsg } from "../../toast.js";
import { orderCard, smLight, smDanger } from "../../ui.js";

export default function AdminMessages() {
  const [msgs, setMsgs] = useState([]);
  useEffect(() => { axios.get("/api/admin/messages").then((r) => setMsgs(r.data)).catch(() => fail("Could not load messages")); }, []);

  const toggle = async (id) => { try { const r = await axios.patch(`/api/admin/messages/${id}`); setMsgs((m) => m.map((x) => (x._id === id ? r.data : x))); } catch (e) { fail(errMsg(e)); } };
  const del = async (id) => { if (!window.confirm("Delete this message?")) return; try { await axios.delete(`/api/admin/messages/${id}`); setMsgs((m) => m.filter((x) => x._id !== id)); } catch (e) { fail(errMsg(e)); } };

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold text-head">Messages</h1>
      {msgs.length === 0 && <p className="text-sub">No messages yet.</p>}
      {msgs.map((m) => (
        <div key={m._id} className={`${orderCard} ${m.read ? "opacity-70" : "border-l-4 border-gold"}`}>
          <b>{m.name}</b> <span className="text-sub">{m.email} {m.phone} - {new Date(m.createdAt).toLocaleString()}</span>
          <p className="my-2.5 whitespace-pre-wrap">{m.message}</p>
          <div className="flex gap-2"><button className={smLight} onClick={() => toggle(m._id)}>{m.read ? "Mark unread" : "Mark read"}</button><button className={smDanger} onClick={() => del(m._id)}>Delete</button></div>
        </div>
      ))}
    </>
  );
}

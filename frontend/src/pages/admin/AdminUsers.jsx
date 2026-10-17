import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Components/AuthContext.jsx";
import { ok, fail, errMsg } from "../../toast.js";
import { table, th, td, pill, smLight, smDanger } from "../../ui.js";

export default function AdminUsers() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  useEffect(() => { axios.get("/api/admin/users").then((r) => setUsers(r.data)).catch(() => fail("Could not load users")); }, []);

  const patch = async (u, body) => {
    try { const r = await axios.patch(`/api/admin/users/${u._id}`, body); setUsers((l) => l.map((x) => (x._id === u._id ? r.data : x))); ok("Updated"); }
    catch (e) { fail(errMsg(e)); }
  };

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold text-head">Users</h1>
      <table className={table}>
        <thead><tr>{["Name", "Email", "Role", "Status", "Joined", "Actions"].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td className={td}>{u.name}</td><td className={td}>{u.email}</td><td className={td}><span className={pill}>{u.role}</span></td><td className={td}>{u.active ? "Active" : "Blocked"}</td><td className={td}>{new Date(u.createdAt).toLocaleDateString()}</td>
              <td className={td}>{String(u._id) === String(me.id) ? <span className="text-sub">You</span> : (
                <div className="flex gap-2">
                  <button className={smLight} onClick={() => patch(u, { role: u.role === "admin" ? "user" : "admin" })}>{u.role === "admin" ? "Remove admin" : "Make admin"}</button>
                  <button className={smDanger} onClick={() => patch(u, { active: !u.active })}>{u.active ? "Block" : "Unblock"}</button>
                </div>)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

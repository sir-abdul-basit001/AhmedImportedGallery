import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/auth/me").then((r) => setUser(r.data)).catch(() => setUser(null)).finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => { const r = await axios.post("/api/auth/login", { email, password }); setUser(r.data); return r.data; };
  const register = async (name, email, password) => { const r = await axios.post("/api/auth/register", { name, email, password }); setUser(r.data); return r.data; };
  const logout = async () => { await axios.post("/api/auth/logout").catch(() => {}); setUser(null); };

  return <Ctx.Provider value={{ user, loading, login, register, logout }}>{children}</Ctx.Provider>;
}

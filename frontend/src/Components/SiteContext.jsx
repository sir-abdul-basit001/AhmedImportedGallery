import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const Ctx = createContext({ settings: {}, ready: false, reload: () => {} });
export const useSite = () => useContext(Ctx);

export function SiteProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const reload = () => axios.get("/api/settings").then((r) => setSettings(r.data)).catch(() => setSettings({}));
  useEffect(() => { reload(); }, []);
  useEffect(() => { if (settings?.shopName) document.title = settings.shopName; }, [settings]);
  return <Ctx.Provider value={{ settings: settings || {}, ready: settings !== null, reload }}>{children}</Ctx.Provider>;
}

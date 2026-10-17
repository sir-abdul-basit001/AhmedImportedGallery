import { createContext, useContext, useEffect, useState } from "react";

const Ctx = createContext(null);
export const useCart = () => useContext(Ctx);
const KEY = "aig_cart";

const read = () => { try { const v = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(v) ? v : []; } catch { return []; } };

export function CartProvider({ children }) {
  const [items, setItems] = useState(read);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* storage unavailable */ } }, [items]);

  const add = (p) => setItems((prev) => {
    const found = prev.find((i) => i.id === p._id);
    if (found) return prev.map((i) => (i.id === p._id ? { ...i, qty: Math.min(i.qty + 1, 50) } : i));
    return [...prev, { id: p._id, name: p.name, price: p.price, image: p.image, qty: 1 }];
  });
  const setQty = (id, qty) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(50, qty)) } : i)));
  const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clear = () => setItems([]);
  const count = items.reduce((n, i) => n + i.qty, 0);
  const total = items.reduce((t, i) => t + i.price * i.qty, 0);

  return <Ctx.Provider value={{ items, add, setQty, remove, clear, count, total }}>{children}</Ctx.Provider>;
}

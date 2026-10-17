import { Link } from "react-router-dom";
import { useCart } from "../Components/CartContext.jsx";
import Img from "../Components/Img.jsx";
import { page, h1, btn, center } from "../ui.js";

const qtyBtn = "size-8 cursor-pointer rounded-full border border-line bg-card text-ink hover:bg-gold";

export default function Cart() {
  const { items, setQty, remove, total } = useCart();
  if (items.length === 0) return <div className={center}><h2 className="mb-6 text-2xl text-head">Your cart is empty</h2><Link className={btn} to="/shop">Browse shop</Link></div>;
  return (
    <div className={page}>
      <h1 className={h1}>Your Cart</h1>
      {items.map((i) => (
        <div key={i.id} className="mb-3.5 grid grid-cols-[80px_1fr_auto_auto_auto] items-center gap-4 rounded-2xl bg-card px-4 py-3.5 shadow-soft max-md:grid-cols-[60px_1fr]">
          <Img src={i.image} alt={i.name} className="size-20 rounded-xl object-cover" />
          <div><b>{i.name}</b><div className="text-sub">PKR {i.price}</div></div>
          <div className="flex items-center gap-2.5"><button className={qtyBtn} onClick={() => setQty(i.id, i.qty - 1)} aria-label="Less">-</button>{i.qty}<button className={qtyBtn} onClick={() => setQty(i.id, i.qty + 1)} aria-label="More">+</button></div>
          <b>PKR {i.price * i.qty}</b>
          <button className={qtyBtn} onClick={() => remove(i.id)} aria-label="Remove"><i className="fa-solid fa-trash"></i></button>
        </div>
      ))}
      <div className="mt-6 text-right text-2xl"><b>Total: PKR {total}</b><div className="mt-5"><Link to="/checkout" className={btn}>Checkout</Link></div></div>
    </div>
  );
}

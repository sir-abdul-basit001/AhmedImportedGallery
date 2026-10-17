import { Link } from "react-router-dom";
import { useSite } from "./SiteContext.jsx";

const a = "my-3 block text-[#cfcfcf] transition hover:translate-x-2 hover:text-gold";
const h = "mb-5 text-gold";

export default function Footer() {
  const { settings: s } = useSite();
  return (
    <footer className="bg-[#08152f] px-[8%] pt-20 pb-8 text-white max-sm:px-5">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-11">
        <div><h3 className={h}>{(s.shopName || "").toUpperCase()}</h3><p className="leading-8 text-[#cfcfcf]">{s.footerNote}</p></div>
        <div><h3 className={h}>Quick Links</h3><Link className={a} to="/">Home</Link><Link className={a} to="/shop">Shop</Link><Link className={a} to="/gallery">Gallery</Link><Link className={a} to="/about">About</Link><Link className={a} to="/developer">About Creator</Link></div>
        <div><h3 className={h}>Account</h3><Link className={a} to="/login">Log in</Link><Link className={a} to="/register">Create account</Link><Link className={a} to="/account">My orders</Link><Link className={a} to="/cart">Cart</Link></div>
        <div>
          <h3 className={h}>Contact</h3>
          {s.phone && <a className={a} href={`tel:${s.phone}`}><i className="fa-solid fa-phone"></i> {s.phone}</a>}
          {s.address && <p className={a}><i className="fa-solid fa-location-dot"></i> {s.address}</p>}
          {s.email && <a className={a} href={`mailto:${s.email}`}><i className="fa-solid fa-envelope"></i> {s.email}</a>}
        </div>
      </div>
      <div className="mt-12 border-t border-white/15 pt-6 text-center text-[#d5d5d5]">
        <p>© {new Date().getFullYear()} {s.shopName}. All Rights Reserved.</p>
        <p>Created by: {s.creatorName}</p>
      </div>
    </footer>
  );
}

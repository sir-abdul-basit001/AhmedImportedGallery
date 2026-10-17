import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../Components/AuthContext.jsx";

const items = [
  ["/admin", "fa-gauge", "Dashboard", true], ["/admin/products", "fa-box", "Products"], ["/admin/categories", "fa-tags", "Categories"],
  ["/admin/gallery", "fa-images", "Gallery"], ["/admin/orders", "fa-receipt", "Orders"], ["/admin/messages", "fa-envelope", "Messages"],
  ["/admin/users", "fa-users", "Users"], ["/admin/settings", "fa-sliders", "Site settings"],
];
const link = ({ isActive }) => `mb-1.5 flex items-center gap-3 rounded-xl px-3.5 py-3 transition hover:bg-gold hover:text-[#222] ${isActive ? "bg-gold text-[#222]" : "text-[#cfd6e8]"}`;

export default function AdminLayout() {
  const { logout } = useAuth();
  const nav = useNavigate();
  return (
    <div className="grid min-h-screen grid-cols-[250px_1fr] bg-page max-[900px]:grid-cols-1">
      <aside className="sticky top-0 h-screen overflow-y-auto bg-[#08152f] p-4 py-6 text-white max-[900px]:static max-[900px]:flex max-[900px]:h-auto max-[900px]:flex-wrap max-[900px]:gap-1.5">
        <h2 className="mx-2.5 mb-6 text-xl text-gold max-[900px]:w-full"><i className="fa-solid fa-store"></i> Admin</h2>
        {items.map(([to, icon, text, end]) => (<NavLink key={to} to={to} end={!!end} className={link}><i className={`fa-solid ${icon} w-5`}></i>{text}</NavLink>))}
        <NavLink to="/" className={link}><i className="fa-solid fa-arrow-up-right-from-square w-5"></i>View site</NavLink>
        <button className={`${link({ isActive: false })} w-full cursor-pointer text-left`} onClick={async () => { await logout(); nav("/login"); }}><i className="fa-solid fa-right-from-bracket w-5"></i>Log out</button>
      </aside>
      <main className="overflow-x-auto p-9 max-md:p-4 text-ink"><Outlet /></main>
    </div>
  );
}

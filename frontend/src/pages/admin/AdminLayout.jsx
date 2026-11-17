import { useEffect, useState } from "react"
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../Components/AuthContext.jsx"

const items = [
  ["/admin", "fa-gauge", "Dashboard", true],
  ["/admin/products", "fa-box", "Products"],
  ["/admin/categories", "fa-tags", "Categories"],
  ["/admin/gallery", "fa-images", "Gallery"],
  ["/admin/orders", "fa-receipt", "Orders"],
  ["/admin/messages", "fa-envelope", "Messages"],
  ["/admin/users", "fa-users", "Users"],
  ["/admin/settings", "fa-sliders", "Site settings"],
]

function NavigationLinks({ onNavigate }) {
  return (
    <nav className="space-y-1">
      {items.map(([to, icon, label, end]) => (
        <NavLink
          key={to}
          to={to}
          end={!!end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
              isActive
                ? "bg-gold text-[#17213a] shadow-sm"
                : "text-[#cfd6e8] hover:bg-white/10 hover:text-white"
            }`
          }
        >
          <i className={`fa-solid ${icon} w-5 text-center`} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default function AdminLayout() {
  const { logout } = useAuth()
  const nav = useNavigate()
  const location = useLocation()

  const [menuOpen, setMenuOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  async function handleLogout() {
    if (loggingOut) return

    setLoggingOut(true)

    try {
      await logout()
      nav("/login")
    } finally {
      setLoggingOut(false)
    }
  }

  const logoutButton = (
    <button
      onClick={handleLogout}
      disabled={loggingOut}
      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-300 transition hover:bg-red-500/10 hover:text-red-200 disabled:opacity-50"
    >
      <i className="fa-solid fa-right-from-bracket w-5 text-center" />
      {loggingOut ? "Logging out..." : "Log out"}
    </button>
  )

  return (
    <div className="min-h-screen bg-page text-ink lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen flex-col overflow-y-auto bg-[#08152f] px-4 py-6 text-white lg:flex">
        <div className="mb-9 flex items-center gap-3 px-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-gold text-xl text-[#08152f]">
            <i className="fa-solid fa-store" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">Admin Panel</h2>
            <p className="text-xs text-slate-400">Manage your store</p>
          </div>
        </div>

        <p className="mb-3 px-4 text-[10px] font-bold uppercase tracking-[2px] text-slate-500">
          Management
        </p>

        <NavigationLinks />

        <div className="mt-auto space-y-2 border-t border-white/10 pt-5">
          <NavLink
            to="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#cfd6e8] transition hover:bg-white/10 hover:text-white"
          >
            <i className="fa-solid fa-arrow-up-right-from-square w-5 text-center" />
            View website
          </NavLink>

          {logoutButton}
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex h-[68px] items-center justify-between border-b border-line bg-card px-4 shadow-sm lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#08152f] text-lg text-gold">
            <i className="fa-solid fa-store" />
          </div>

          <div>
            <h2 className="text-base font-bold text-head">Admin Panel</h2>
            <p className="text-[11px] text-sub">Store management</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="flex size-10 items-center justify-center rounded-xl border border-line bg-page text-head transition hover:bg-gold hover:text-[#222]"
        >
          <i
            className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"} text-lg`}
          />
        </button>
      </header>

      {/* Mobile Navigation Drawer */}
      {menuOpen && (
        <>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] lg:hidden"
          />

          <aside className="fixed inset-y-0 right-0 z-50 flex w-[min(290px,85vw)] flex-col overflow-y-auto bg-[#08152f] px-4 py-6 text-white shadow-2xl lg:hidden">
            <div className="mb-9 flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-gold text-xl text-[#08152f]">
                  <i className="fa-solid fa-store" />
                </div>

                <div>
                  <h2 className="font-bold text-white">Admin Panel</h2>
                  <p className="text-xs text-slate-400">Manage your store</p>
                </div>
              </div>

              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="flex size-9 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10"
              >
                <i className="fa-solid fa-xmark text-xl" />
              </button>
            </div>

            <p className="mb-3 px-4 text-[10px] font-bold uppercase tracking-[2px] text-slate-500">
              Management
            </p>

            <NavigationLinks onNavigate={() => setMenuOpen(false)} />

            <div className="mt-auto space-y-2 border-t border-white/10 pt-5">
              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#cfd6e8] hover:bg-white/10"
              >
                <i className="fa-solid fa-arrow-up-right-from-square w-5 text-center" />
                View website
              </NavLink>

              {logoutButton}
            </div>
          </aside>
        </>
      )}

      {/* Page Content */}
      <main className="min-h-[calc(100vh-68px)] min-w-0 overflow-x-hidden p-3 sm:p-5 md:p-6 lg:min-h-screen lg:p-8">
        <Outlet />
      </main>
    </div>
  )
}

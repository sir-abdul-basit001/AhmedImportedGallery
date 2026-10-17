import { useEffect, useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { useSite } from "./SiteContext.jsx"
import { useAuth } from "./AuthContext.jsx"
import { useCart } from "./CartContext.jsx"
import { iconBtn } from "../ui.js"

const links = [
  ["Home", "/"],
  ["Shop", "/shop"],
  ["Categories", "/categories"],
  ["Gallery", "/gallery"],
  ["About", "/about"],
  ["Contact", "/contact"],
  ["Product", "/product"],
  ["About Creator", "/developer"],
]

const linkCls = ({ isActive }) =>
  `block rounded-xl px-3 py-2.5 text-sm font-semibold whitespace-nowrap transition-all duration-200
   ${
     isActive
       ? "bg-navy text-gold"
       : "text-ink hover:bg-navy/10 hover:text-gold"
   }`

export default function Navbar() {
  const { settings } = useSite()
  const { user } = useAuth()
  const { count } = useCart()
  const nav = useNavigate()

  const [q, setQ] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem("theme") === "dark"
    } catch {
      return false
    }
  })

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)

    try {
      localStorage.setItem("theme", dark ? "dark" : "light")
    } catch {
      // Local storage may be unavailable.
    }
  }, [dark])

  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
  }, [nav])

  const search = (e) => {
    e.preventDefault()

    const value = q.trim()

    if (!value) return

    nav(`/shop?q=${encodeURIComponent(value)}`)
    setQ("")
    setSearchOpen(false)
    setMenuOpen(false)
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-card/90 text-head shadow-lg shadow-black/5 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[72px] max-w-[1600px] items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-10 xl:px-12">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex min-w-0 shrink-0 items-center gap-2.5"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold text-xl text-navy shadow-sm transition-transform duration-200 hover:scale-105">
            <i className="fa-solid fa-store" />
          </span>

          <h2 className="max-w-[180px] text-base leading-tight font-extrabold sm:max-w-[220px] sm:text-lg lg:max-w-[250px] lg:text-xl">
            {settings.shopName || "Ahmed Imported Gallery"}
          </h2>
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 xl:flex"
        >
          {links.map(([label, path]) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              className={linkCls}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Action buttons */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {/* Search */}
          <form
            onSubmit={search}
            className={`flex items-center overflow-hidden rounded-full border transition-all duration-300 ${
              searchOpen
                ? "absolute top-full right-4 left-4 z-20 mt-2 border-line bg-card p-1 shadow-xl sm:static sm:mt-0 sm:w-48 sm:shadow-none lg:w-56"
                : "w-0 border-transparent"
            }`}
          >
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products..."
              aria-label="Search products"
              tabIndex={searchOpen ? 0 : -1}
              className={`min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-ink outline-none placeholder:text-ink/50 ${
                searchOpen ? "block" : "hidden"
              }`}
            />

            {searchOpen && (
              <button
                type="submit"
                aria-label="Submit search"
                className="grid size-9 shrink-0 place-items-center rounded-full text-ink transition hover:bg-navy/10 hover:text-gold"
              >
                <i className="fa-solid fa-arrow-right" />
              </button>
            )}
          </form>

          <button
            type="button"
            className={iconBtn}
            onClick={() => setSearchOpen((prev) => !prev)}
            aria-label={searchOpen ? "Close search" : "Open search"}
            aria-expanded={searchOpen}
          >
            <i
              className={`fa-solid ${
                searchOpen ? "fa-xmark" : "fa-magnifying-glass"
              }`}
            />
          </button>

          {/* Cart */}
          <Link
            to="/cart"
            aria-label={`Cart, ${count} items`}
            className={`${iconBtn} relative`}
          >
            <i className="fa-solid fa-cart-shopping" />

            <span className="absolute -top-1.5 -right-1.5 grid min-h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-extrabold text-navy ring-2 ring-card">
              {count}
            </span>
          </Link>

          {/* Admin */}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              aria-label="Admin panel"
              className={`${iconBtn} hidden sm:grid`}
            >
              <i className="fa-solid fa-gauge" />
            </Link>
          )}

          {/* Account */}
          <Link
            to={user ? "/account" : "/login"}
            aria-label={user ? "Account" : "Log in"}
            className={iconBtn}
          >
            <i
              className={`fa-solid ${user ? "fa-user" : "fa-right-to-bracket"}`}
            />
          </Link>

          {/* Theme */}
          <button
            type="button"
            className={iconBtn}
            onClick={() => setDark((prev) => !prev)}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            <i className={`fa-solid ${dark ? "fa-sun" : "fa-moon"}`} />
          </button>

          {/* Mobile menu */}
          <button
            type="button"
            className={`${iconBtn} xl:hidden`}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            <i className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"}`} />
          </button>
        </div>
      </div>

      {/* Mobile and tablet navigation */}
      <div
        id="mobile-navigation"
        className={`overflow-hidden border-t border-line bg-card transition-all duration-300 ease-in-out xl:hidden ${
          menuOpen
            ? "max-h-[75dvh] overflow-y-auto opacity-100"
            : "max-h-0 border-t-transparent opacity-0"
        }`}
        aria-hidden={!menuOpen}
      >
        <nav
          aria-label="Mobile navigation"
          className="mx-auto grid max-w-[1600px] grid-cols-2 gap-2 px-5 py-4 sm:grid-cols-3 sm:px-8 md:grid-cols-4"
        >
          {links.map(([label, path]) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              onClick={closeMenu}
              tabIndex={menuOpen ? 0 : -1}
              className={linkCls}
            >
              {label}
            </NavLink>
          ))}

          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              onClick={closeMenu}
              tabIndex={menuOpen ? 0 : -1}
              className={linkCls}
            >
              <i className="fa-solid fa-gauge mr-2" />
              Admin Panel
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}

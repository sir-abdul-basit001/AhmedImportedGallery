import { useEffect, useRef, useState } from "react"
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { useSite } from "./SiteContext.jsx"
import { useAuth } from "./AuthContext.jsx"
import { useCart } from "./CartContext.jsx"
import { iconBtn } from "../ui.js"

const links = [
  ["Home", "/", "fa-house"],
  ["Shop", "/shop", "fa-bag-shopping"],
  ["Categories", "/categories", "fa-layer-group"],
  ["Gallery", "/gallery", "fa-images"],
  ["About", "/about", "fa-circle-info"],
  ["Contact", "/contact", "fa-envelope"],
  ["Product", "/product", "fa-box"],
  ["About Creator", "/developer", "fa-code"],
]

const linkCls = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
    isActive ? "bg-navy text-gold" : "text-ink hover:bg-navy/10 hover:text-gold"
  }`

const rowCls =
  "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-ink transition hover:bg-navy/10 hover:text-gold"

export default function Navbar() {
  const { settings } = useSite()
  const { user } = useAuth()
  const { count } = useCart()

  const nav = useNavigate()
  const { pathname } = useLocation()
  const searchRef = useRef(null)

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

  // Close everything when the route changes
  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
  }, [pathname])

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  // Escape closes panels
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false)
        setSearchOpen(false)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // Lock page scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

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

  const toggleMenu = () => {
    setMenuOpen((p) => !p)
    setSearchOpen(false)
  }

  const toggleSearch = () => {
    setSearchOpen((p) => !p)
    setMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-card/90 text-head shadow-lg shadow-black/5 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-2 px-3 sm:h-[72px] sm:gap-4 sm:px-8 lg:px-10 xl:px-12">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex min-w-0 items-center gap-2.5"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gold text-lg text-navy shadow-sm transition-transform duration-200 hover:scale-105 sm:size-10 sm:text-xl">
            <i className="fa-solid fa-store" />
          </span>

          <span className="truncate text-[15px] leading-tight font-extrabold sm:text-lg lg:text-xl">
            {settings?.shopName || "Ahmed Imported Gallery"}
          </span>
        </Link>

        {/* Desktop nav */}
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

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-0.5 sm:gap-2">
          <button
            type="button"
            className={iconBtn}
            onClick={toggleSearch}
            aria-label={searchOpen ? "Close search" : "Open search"}
            aria-expanded={searchOpen}
          >
            <i
              className={`fa-solid ${
                searchOpen ? "fa-xmark" : "fa-magnifying-glass"
              }`}
            />
          </button>

          <Link
            to="/cart"
            aria-label={`Cart, ${count} items`}
            className={`${iconBtn} relative`}
          >
            <i className="fa-solid fa-cart-shopping" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-extrabold text-navy ring-2 ring-card">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </Link>

          {/* These move into the mobile menu below sm */}
          <div className="hidden items-center gap-2 sm:flex">
            {user?.role === "admin" && (
              <Link to="/admin" aria-label="Admin panel" className={iconBtn}>
                <i className="fa-solid fa-gauge" />
              </Link>
            )}

            <Link
              to={user ? "/account" : "/login"}
              aria-label={user ? "Account" : "Log in"}
              className={iconBtn}
            >
              <i
                className={`fa-solid ${
                  user ? "fa-user" : "fa-right-to-bracket"
                }`}
              />
            </Link>

            <button
              type="button"
              className={iconBtn}
              onClick={() => setDark((p) => !p)}
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            >
              <i className={`fa-solid ${dark ? "fa-sun" : "fa-moon"}`} />
            </button>
          </div>

          <button
            type="button"
            className={`${iconBtn} xl:hidden`}
            onClick={toggleMenu}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            <i className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"}`} />
          </button>
        </div>
      </div>

      {/* Search row (full width, all screen sizes) */}
      <div
        className={`overflow-hidden border-line bg-card transition-all duration-300 ${
          searchOpen
            ? "max-h-20 border-t opacity-100"
            : "invisible max-h-0 opacity-0"
        }`}
      >
        <form
          onSubmit={search}
          role="search"
          className="mx-auto flex max-w-[1600px] items-center gap-2 px-3 py-3 sm:px-8 lg:px-10 xl:px-12"
        >
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-line bg-card px-4 focus-within:border-gold">
            <i className="fa-solid fa-magnifying-glass text-sm text-ink/50" />
            <input
              ref={searchRef}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products..."
              aria-label="Search products"
              className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-ink outline-none placeholder:text-ink/50"
            />
          </div>
          <button
            type="submit"
            className="shrink-0 rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-navy transition hover:brightness-105"
          >
            Search
          </button>
        </form>
      </div>

      {/* Backdrop (tap to close) */}
      {menuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={closeMenu}
          className="fixed inset-x-0 top-16 bottom-0 -z-10 bg-black/40 backdrop-blur-[2px] sm:top-[72px] xl:hidden"
        />
      )}

      {/* Mobile menu */}
      <div
        id="mobile-navigation"
        className={`border-line bg-card transition-all duration-300 ease-in-out xl:hidden ${
          menuOpen
            ? "visible max-h-[calc(100dvh-4rem)] overflow-y-auto border-t opacity-100"
            : "invisible max-h-0 overflow-hidden opacity-0"
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="mx-auto max-w-[1600px] px-3 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8">
          <nav
            aria-label="Mobile navigation"
            className="grid grid-cols-1 gap-1.5 min-[480px]:grid-cols-2 md:grid-cols-3"
          >
            {links.map(([label, path, icon]) => (
              <NavLink
                key={path}
                to={path}
                end={path === "/"}
                onClick={closeMenu}
                className={linkCls}
              >
                <i className={`fa-solid ${icon} w-5 text-center`} />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Account / admin / theme (shown below sm only) */}
          <div className="mt-3 space-y-1 border-t border-line pt-3 sm:hidden">
            {user?.role === "admin" && (
              <Link to="/admin" onClick={closeMenu} className={rowCls}>
                <i className="fa-solid fa-gauge w-5 text-center" />
                Admin Panel
              </Link>
            )}

            <Link
              to={user ? "/account" : "/login"}
              onClick={closeMenu}
              className={rowCls}
            >
              <i
                className={`fa-solid ${
                  user ? "fa-user" : "fa-right-to-bracket"
                } w-5 text-center`}
              />
              {user ? "My Account" : "Log in"}
            </Link>

            <button
              type="button"
              onClick={() => setDark((p) => !p)}
              className={rowCls}
            >
              <i
                className={`fa-solid ${dark ? "fa-sun" : "fa-moon"} w-5 text-center`}
              />
              {dark ? "Light mode" : "Dark mode"}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

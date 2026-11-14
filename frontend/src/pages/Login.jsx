import { useState } from "react"
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../Components/AuthContext.jsx"
import { ok, fail, errMsg } from "../toast.js"
import { page, input, btn, formCard, link } from "../ui.js"

export default function Login() {
  const { user, login } = useAuth()
  const nav = useNavigate()
  const from = useLocation().state?.from
  const [form, setForm] = useState({ email: "", password: "" })
  const [busy, setBusy] = useState(false)
  const [showPw, setShowPw] = useState(false)

  if (user)
    return (
      <Navigate to={from || (user.role === "admin" ? "/admin" : "/")} replace />
    )

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      const u = await login(form.email, form.password)
      ok("Welcome back")
      nav(from || (u.role === "admin" ? "/admin" : "/"), { replace: true })
    } catch (err) {
      fail(errMsg(err, "Login failed"))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={page}>
      <form className={`${formCard} mx-auto max-w-md`} onSubmit={submit}>
        <h1 className="text-3xl font-bold text-head">Log in</h1>
        <input
          className={input}
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <div className="relative">
          <input
            className={input}
            style={{ paddingRight: "2.75rem" }}
            type={showPw ? "text" : "password"}
            placeholder="Password"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button
            type="button"
            onClick={() => setShowPw((s) => !s)}
            aria-label={showPw ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sub"
          >
            <i className={`fa-solid ${showPw ? "fa-eye-slash" : "fa-eye"}`}></i>
          </button>
        </div>

        <button className={btn} disabled={busy}>
          {busy ? "Logging in..." : "Log in"}
        </button>
        <p className="text-sub">
          New here?{" "}
          <Link className={link} to="/register">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  )
}

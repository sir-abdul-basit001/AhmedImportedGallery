import { useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { useAuth } from "../Components/AuthContext.jsx"
import { ok, fail, errMsg } from "../toast.js"
import { page, input, btn, formCard, link } from "../ui.js"

export default function Register() {
  const { user, register } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [busy, setBusy] = useState(false)
  const [showPw, setShowPw] = useState(false)
  if (user) return <Navigate to="/" replace />
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      await register(form.name, form.email, form.password)
      ok("Account created")
      nav("/", { replace: true })
    } catch (err) {
      fail(errMsg(err, "Could not create account"))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={page}>
      <form className={`${formCard} mx-auto max-w-md`} onSubmit={submit}>
        <h1 className="text-3xl font-bold text-head">Create account</h1>
        <input
          className={input}
          placeholder="Full name"
          autoComplete="name"
          value={form.name}
          onChange={set("name")}
          required
          minLength={2}
        />
        <input
          className={input}
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={form.email}
          onChange={set("email")}
          required
        />

        <div className="relative">
          <input
            className={input}
            style={{ paddingRight: "2.75rem" }}
            type={showPw ? "text" : "password"}
            placeholder="Password (8+ characters, letter and number)"
            autoComplete="new-password"
            value={form.password}
            onChange={set("password")}
            required
            minLength={8}
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
          {busy ? "Creating..." : "Create account"}
        </button>
        <p className="text-sub">
          Already have an account?{" "}
          <Link className={link} to="/login">
            Log in
          </Link>
        </p>
      </form>
    </div>
  )
}

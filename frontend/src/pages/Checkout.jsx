import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import axios from "axios"

import { useCart } from "../Components/CartContext.jsx"
import { ok, fail, errMsg } from "../toast.js"
import { narrow, h1, input, btn, formCard } from "../ui.js"

export default function Checkout() {
  const { items, total, clear } = useCart()
  const nav = useNavigate()

  const [form, setForm] = useState({
    phone: "",
    address: "",
    note: "",
  })

  const [busy, setBusy] = useState(false)

  if (items.length === 0) {
    return <Navigate to="/cart" replace />
  }

  const set = (key) => (e) => {
    setForm((previous) => ({
      ...previous,
      [key]: e.target.value,
    }))
  }

  const submit = async (e) => {
    e.preventDefault()

    if (busy) return

    setBusy(true)

    try {
      const orderPayload = {
        phone: form.phone.trim(),
        address: form.address.trim(),
        note: form.note.trim(),
        items: items.map((item) => ({
          product: item._id,
          qty: Number(item.qty),
        })),
      }

      // Step 2: Inspect the actual cart and order data.
      console.log("Cart items:", items)
      console.log("Order payload:", orderPayload)

      const response = await axios.post("/api/orders", orderPayload)

      clear()

      ok("Order placed. We will call you to confirm.")

      nav("/account")

      return response.data
    } catch (err) {
      console.error(
        "Order placement failed:",
        err.response?.data || err.message,
      )

      fail(errMsg(err, "Could not place order"))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={narrow}>
      <h1 className={h1}>Checkout</h1>

      <form className={formCard} onSubmit={submit}>
        <input
          className={input}
          type="tel"
          placeholder="Phone number"
          value={form.phone}
          onChange={set("phone")}
          required
          maxLength={20}
        />

        <textarea
          className={input}
          placeholder="Full delivery address"
          rows="3"
          value={form.address}
          onChange={set("address")}
          required
          maxLength={300}
        />

        <textarea
          className={input}
          placeholder="Note (optional)"
          rows="2"
          value={form.note}
          onChange={set("note")}
          maxLength={300}
        />

        <p className="text-sub">Payment: Cash on delivery</p>

        <p className="text-xl">
          <b>Total: PKR {total.toLocaleString("en-PK")}</b>
        </p>

        <button className={btn} type="submit" disabled={busy}>
          {busy ? "Placing order..." : "Place order"}
        </button>
      </form>
    </div>
  )
}

import { useEffect, useState } from "react"
import axios from "axios"
import ImageUpload from "./ImageUpload.jsx"
import { ok, fail, errMsg } from "../toast.js"
import {
  input,
  btn,
  btnOutline,
  table,
  th,
  td,
  smLight,
  smDanger,
  field,
  label,
} from "../ui.js"

// Generic admin list + add/edit/delete screen driven by a field config.
export default function ResourceManager({
  title,
  endpoint,
  fields,
  columns,
  noun,
}) {
  const [rows, setRows] = useState([])

  const [form, setForm] = useState(null)
  const [busy, setBusy] = useState(false)

  const load = () =>
    axios
      .get(endpoint)
      .then((r) => setRows(r.data))
      .catch(() => fail("Could not load data"))
  useEffect(() => {
    load()
  }, [endpoint])

  const blank = () =>
    Object.fromEntries(
      fields.map((f) => [
        f.name,
        f.default ?? (f.type === "checkbox" ? false : ""),
      ]),
    )
  const edit = (row) =>
    setForm({
      _id: row._id,
      ...Object.fromEntries(
        fields.map((f) => [f.name, f.get ? f.get(row) : (row[f.name] ?? "")]),
      ),
    })
  const set = (name, v) => setForm((f) => ({ ...f, [name]: v }))

  const save = async (e) => {
    e.preventDefault()
    const payload = Object.fromEntries(
      fields.map((f) => [f.name, form[f.name]]),
    )
    setBusy(true)
    try {
      if (form._id) await axios.put(`${endpoint}/${form._id}`, payload)
      else await axios.post(endpoint, payload)
      ok("Saved")
      setForm(null)
      load()
    } catch (err) {
      fail(errMsg(err, "Could not save"))
    } finally {
      setBusy(false)
    }
  }

  const del = async (row) => {
    if (!window.confirm(`Delete this ${noun}?`)) return
    try {
      await axios.delete(`${endpoint}/${row._id}`)
      ok("Deleted")
      load()
    } catch (err) {
      fail(errMsg(err, "Could not delete"))
    }
  }

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-head">{title}</h1>
        <button className={btn} onClick={() => setForm(blank())}>
          + Add {noun}
        </button>
      </div>
      <table className={table}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.label} className={th}>
                {c.label}
              </th>
            ))}
            <th className={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length + 1} className={`${td} text-sub`}>
                Nothing here yet.
              </td>
            </tr>
          )}
          {rows.map((r) => (
            <tr key={r._id}>
              {columns.map((c) => (
                <td key={c.label} className={td}>
                  {c.render(r)}
                </td>
              ))}
              <td className={td}>
                <div className="flex gap-2">
                  <button className={smLight} onClick={() => edit(r)}>
                    Edit
                  </button>
                  <button className={smDanger} onClick={() => del(r)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {form && (
        <div
          className="fixed inset-0 z-[2000] grid place-items-center bg-black/55 p-5"
          onMouseDown={(e) => e.target === e.currentTarget && setForm(null)}
        >
          <form
            className="grid max-h-[90vh] w-[min(560px,100%)] gap-3.5 overflow-y-auto rounded-3xl bg-card p-7 text-ink"
            onSubmit={save}
          >
            <h2 className="text-2xl font-bold text-head">
              {form._id ? "Edit" : "Add"} {noun}
            </h2>
            {fields.map((f) =>
              f.type === "checkbox" ? (
                <label className="flex items-center gap-2.5" key={f.name}>
                  <input
                    type="checkbox"
                    className="size-[18px]"
                    checked={!!form[f.name]}
                    onChange={(e) => set(f.name, e.target.checked)}
                  />
                  {f.label}
                </label>
              ) : (
                <label className={field} key={f.name}>
                  <span className={label}>{f.label}</span>
                  {f.type === "image" ? (
                    <ImageUpload
                      value={form[f.name]}
                      onChange={(v) => set(f.name, v)}
                    />
                  ) : f.type === "textarea" ? (
                    <textarea
                      className={input}
                      rows="4"
                      value={form[f.name]}
                      onChange={(e) => set(f.name, e.target.value)}
                    />
                  ) : f.type === "select" ? (
                    <select
                      className={input}
                      value={form[f.name]}
                      onChange={(e) => set(f.name, e.target.value)}
                      required={f.required}
                    >
                      <option value="">Select...</option>
                      {(f.options || []).map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className={input}
                      type={f.type === "number" ? "number" : "text"}
                      min={f.type === "number" ? 0 : undefined}
                      step={f.type === "number" ? "any" : undefined}
                      value={form[f.name]}
                      onChange={(e) => set(f.name, e.target.value)}
                      required={f.required}
                    />
                  )}
                </label>
              ),
            )}
            <div className="flex gap-3">
              <button className={btn} disabled={busy}>
                {busy ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                className={btnOutline}
                onClick={() => setForm(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

import { useCallback, useEffect, useState } from "react"
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

export default function ResourceManager({
  title,
  endpoint,
  fields = [],
  columns = [],
  noun = "Item",
}) {
  const [rows, setRows] = useState([])
  const [form, setForm] = useState(null)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)

  const normalizeArray = (data) => {
    if (Array.isArray(data)) return data
    if (Array.isArray(data?.data)) return data.data
    if (Array.isArray(data?.items)) return data.items
    if (Array.isArray(data?.results)) return data.results
    return null
  }

  const load = useCallback(async () => {
    setLoading(true)

    try {
      const response = await axios.get(endpoint)
      const data = normalizeArray(response.data)

      if (!data) {
        console.error("Invalid API response:", endpoint, response.data)
        setRows([])
        return
      }

      setRows(data)
    } catch (error) {
      console.error("Resource loading failed:", endpoint, error)
      setRows([])
      fail(errMsg(error, "Could not load data"))
    } finally {
      setLoading(false)
    }
  }, [endpoint])

  useEffect(() => {
    load()
  }, [load])

  const blank = () =>
    Object.fromEntries(
      fields.map((f) => [
        f.name,
        f.default ?? (f.type === "checkbox" ? false : ""),
      ]),
    )

  const edit = (row) => {
    setForm({
      _id: row._id,
      ...Object.fromEntries(
        fields.map((f) => [f.name, f.get ? f.get(row) : (row[f.name] ?? "")]),
      ),
    })
  }

  const set = (name, value) => {
    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const save = async (e) => {
    e.preventDefault()

    const payload = Object.fromEntries(
      fields.map((f) => [f.name, form[f.name]]),
    )

    setBusy(true)

    try {
      if (form._id) {
        await axios.put(`${endpoint}/${form._id}`, payload)
      } else {
        await axios.post(endpoint, payload)
      }

      ok("Saved successfully")
      setForm(null)
      await load()
    } catch (error) {
      console.error("Save failed:", error)
      fail(errMsg(error, "Could not save"))
    } finally {
      setBusy(false)
    }
  }

  const del = async (row) => {
    if (!window.confirm(`Delete this ${noun}?`)) return

    try {
      await axios.delete(`${endpoint}/${row._id}`)
      ok("Deleted successfully")
      await load()
    } catch (error) {
      console.error("Delete failed:", error)
      fail(errMsg(error, "Could not delete"))
    }
  }

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-head">{title}</h1>

        <button className={btn} onClick={() => setForm(blank())} type="button">
          + Add {noun}
        </button>
      </div>

      <div className={table}>
        <table className="w-full">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={column.label || index} className={th}>
                  {column.label}
                </th>
              ))}

              <th className={th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className={td}>
                  Loading {noun.toLowerCase()}s...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className={`${td} text-sub`}>
                  Nothing here yet.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row._id}>
                  {columns.map((column, index) => (
                    <td key={column.label || index} className={td}>
                      {typeof column.render === "function"
                        ? column.render(row)
                        : ""}
                    </td>
                  ))}

                  <td className={td}>
                    <div className="flex gap-2">
                      <button
                        className={smLight}
                        onClick={() => edit(row)}
                        type="button"
                      >
                        Edit
                      </button>

                      <button
                        className={smDanger}
                        onClick={() => del(row)}
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {form && (
        <div
          className="fixed inset-0 z-[2000] grid place-items-center bg-black/55 p-5"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setForm(null)
            }
          }}
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
                      onChange={(value) => set(f.name, value)}
                    />
                  ) : f.type === "textarea" ? (
                    <textarea
                      className={input}
                      rows="4"
                      value={form[f.name] ?? ""}
                      onChange={(e) => set(f.name, e.target.value)}
                      required={f.required}
                    />
                  ) : f.type === "select" ? (
                    <select
                      className={input}
                      value={form[f.name] ?? ""}
                      onChange={(e) => set(f.name, e.target.value)}
                      required={f.required}
                    >
                      <option value="">Select...</option>

                      {(Array.isArray(f.options) ? f.options : []).map(
                        (option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ),
                      )}
                    </select>
                  ) : (
                    <input
                      className={input}
                      type={f.type === "number" ? "number" : "text"}
                      min={f.type === "number" ? 0 : undefined}
                      step={f.type === "number" ? "any" : undefined}
                      value={form[f.name] ?? ""}
                      onChange={(e) =>
                        set(
                          f.name,
                          f.type === "number" ? e.target.value : e.target.value,
                        )
                      }
                      required={f.required}
                    />
                  )}
                </label>
              ),
            )}

            <div className="flex gap-3">
              <button className={btn} disabled={busy} type="submit">
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

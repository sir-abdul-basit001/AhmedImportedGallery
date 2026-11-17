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

const normalizeArray = (data) => {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.items)) return data.items
  if (Array.isArray(data?.results)) return data.results
  return null
}

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

    if (!form || busy) return

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

  const imageColumn = columns.find(
    (column) => column.label?.toLowerCase() === "image",
  )

  const nameColumn = columns.find((column) =>
    ["name", "title"].includes(column.label?.toLowerCase()),
  )

  const mobileColumns = columns.filter(
    (column) => column !== imageColumn && column !== nameColumn,
  )

  const renderCell = (column, row) =>
    typeof column.render === "function" ? column.render(row) : ""

  return (
    <>
      {/* Page Header */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-head sm:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-sub">
            Manage your {noun.toLowerCase()}s
          </p>
        </div>

        <button
          className={`${btn} w-full justify-center sm:w-auto`}
          onClick={() => setForm(blank())}
          type="button"
        >
          <i className="fa-solid fa-plus mr-2" />
          Add {noun}
        </button>
      </div>

      {/* Resource Count */}
      <div className="mb-4 flex items-center justify-between rounded-xl border border-line bg-card px-4 py-3">
        <span className="text-sm text-sub">Total {title}</span>

        <span className="rounded-lg bg-page px-3 py-1 text-sm font-bold text-head">
          {loading ? "..." : rows.length}
        </span>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-2xl border border-line bg-card shadow-soft lg:block">
        <div className="overflow-x-auto">
          <table className={`${table} w-full min-w-[750px]`}>
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
                    <div className="flex items-center justify-center gap-3 py-8 text-sub">
                      <i className="fa-solid fa-spinner animate-spin" />
                      Loading {noun.toLowerCase()}s...
                    </div>
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className={`${td} py-12 text-center text-sub`}
                  >
                    <i className="fa-solid fa-box-open mb-3 block text-3xl opacity-50" />
                    Nothing here yet.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row._id} className="transition hover:bg-page/70">
                    {columns.map((column, index) => (
                      <td key={column.label || index} className={td}>
                        {renderCell(column, row)}
                      </td>
                    ))}

                    <td className={td}>
                      <div className="flex flex-wrap gap-2">
                        <button
                          className={smLight}
                          onClick={() => edit(row)}
                          type="button"
                        >
                          <i className="fa-solid fa-pen-to-square mr-1" />
                          Edit
                        </button>

                        <button
                          className={smDanger}
                          onClick={() => del(row)}
                          type="button"
                        >
                          <i className="fa-solid fa-trash mr-1" />
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
      </div>

      {/* Mobile and Tablet Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
        {loading ? (
          <div className="col-span-full flex items-center justify-center gap-3 rounded-2xl border border-line bg-card py-12 text-sub">
            <i className="fa-solid fa-spinner animate-spin text-xl" />
            Loading {noun.toLowerCase()}s...
          </div>
        ) : rows.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-line bg-card px-4 py-12 text-center text-sub">
            <i className="fa-solid fa-box-open mb-3 block text-4xl opacity-40" />
            <p className="font-semibold text-head">
              No {title.toLowerCase()} found
            </p>
            <p className="mt-1 text-sm">
              Add your first {noun.toLowerCase()} to get started.
            </p>
          </div>
        ) : (
          rows.map((row) => (
            <article
              key={row._id}
              className="min-w-0 overflow-hidden rounded-2xl border border-line bg-card shadow-soft"
            >
              {/* Card Header */}
              <div className="flex min-w-0 items-center gap-3 p-3 sm:p-4">
                {imageColumn && (
                  <div className="size-[76px] shrink-0 overflow-hidden rounded-xl bg-page sm:size-[88px]">
                    {renderCell(imageColumn, row)}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 break-words text-base font-bold text-head sm:text-lg">
                    {nameColumn
                      ? renderCell(nameColumn, row)
                      : `${noun} #${row._id?.slice(-6) || ""}`}
                  </h3>

                  <p className="mt-1 text-xs text-sub">
                    ID: {row._id?.slice(-8) || "N/A"}
                  </p>
                </div>
              </div>

              {/* Card Details */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-4 border-t border-line p-3 sm:p-4">
                {mobileColumns.map((column, index) => {
                  const isPrice = column.label?.toLowerCase() === "price"

                  const isStatus = column.label?.toLowerCase() === "status"

                  return (
                    <div key={column.label || index} className="min-w-0">
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-sub">
                        {column.label}
                      </p>

                      <div
                        className={`break-words text-sm ${
                          isPrice
                            ? "font-bold text-gold"
                            : isStatus
                              ? "font-medium text-head"
                              : "text-ink"
                        }`}
                      >
                        {renderCell(column, row) || "N/A"}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Card Actions */}
              <div className="flex gap-2 border-t border-line bg-page/50 p-3 sm:p-4">
                <button
                  type="button"
                  onClick={() => edit(row)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-navy px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#173b77]"
                >
                  <i className="fa-solid fa-pen-to-square" />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => del(row)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                >
                  <i className="fa-solid fa-trash" />
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {form && (
        <div
          className="fixed inset-0 z-[2000] grid place-items-center overflow-y-auto bg-black/60 p-3 backdrop-blur-sm sm:p-5"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !busy) {
              setForm(null)
            }
          }}
        >
          <form
            className="my-auto grid max-h-[94dvh] w-full max-w-[560px] gap-4 overflow-y-auto rounded-2xl border border-line bg-card p-4 text-ink shadow-2xl sm:rounded-3xl sm:p-7"
            onSubmit={save}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <h2 className="text-xl font-bold text-head sm:text-2xl">
                  {form._id ? "Edit" : "Add"} {noun}
                </h2>

                <p className="mt-1 text-xs text-sub">
                  Enter the details below.
                </p>
              </div>

              <button
                type="button"
                disabled={busy}
                onClick={() => setForm(null)}
                aria-label="Close form"
                className="flex size-9 items-center justify-center rounded-full bg-page text-sub transition hover:bg-red-100 hover:text-red-600"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            {/* Form Fields */}
            {fields.map((f) =>
              f.type === "checkbox" ? (
                <label
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-page/50 p-3.5 text-sm font-medium text-ink transition hover:border-gold"
                  key={f.name}
                >
                  <input
                    type="checkbox"
                    className="size-5 shrink-0 accent-[#f4b400]"
                    checked={!!form[f.name]}
                    disabled={busy}
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
                      className={`${input} min-h-[110px] resize-y`}
                      rows={4}
                      value={form[f.name] ?? ""}
                      disabled={busy}
                      onChange={(e) => set(f.name, e.target.value)}
                      required={f.required}
                    />
                  ) : f.type === "select" ? (
                    <select
                      className={input}
                      value={form[f.name] ?? ""}
                      disabled={busy}
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
                      disabled={busy}
                      onChange={(e) => set(f.name, e.target.value)}
                      required={f.required}
                    />
                  )}
                </label>
              ),
            )}

            {/* Form Actions */}
            <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-line bg-card pt-4 sm:flex-row">
              <button
                type="button"
                className={`${btnOutline} flex-1 justify-center`}
                disabled={busy}
                onClick={() => setForm(null)}
              >
                Cancel
              </button>

              <button
                className={`${btn} flex-1 justify-center`}
                disabled={busy}
                type="submit"
              >
                {busy ? (
                  <>
                    <i className="fa-solid fa-spinner mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-check mr-2" />
                    Save {noun}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

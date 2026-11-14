import { useState } from "react"
import axios from "axios"
import Img from "./Img.jsx"
import { fail, errMsg } from "../toast.js"

export default function ImageUpload({ value, onChange }) {
  const [busy, setBusy] = useState(false)

  const pick = async (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    const formData = new FormData()
    formData.append("image", file, file.name)

    console.log("Selected file:", file)
    console.log("FormData image:", formData.get("image"))

    setBusy(true)

    try {
      const response = await axios.post("/api/images", formData, {
        withCredentials: true,
        transformRequest: [(data) => data],
      })

      console.log("Upload response:", response.data)

      if (!response.data?.url) {
        throw new Error("Image URL missing from server response.")
      }

      onChange(response.data.url)
    } catch (error) {
      console.error("Upload error:", error)
      console.error("Server response:", error.response?.data)
      fail(errMsg(error, "Image upload failed."))
    } finally {
      setBusy(false)
      e.target.value = ""
    }
  }

  return (
    <div className="grid gap-3">
      {value && (
        <Img
          src={value}
          alt="Uploaded image"
          className="h-28 w-36 rounded-xl object-cover"
        />
      )}

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={pick}
        disabled={busy}
        className="text-sm text-sub"
      />

      {busy && <span className="text-sm text-sub">Uploading...</span>}
    </div>
  )
}

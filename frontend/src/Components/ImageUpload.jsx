import { useState } from "react";
import axios from "axios";
import Img from "./Img.jsx";
import { input } from "../ui.js";
import { fail, errMsg } from "../toast.js";

export default function ImageUpload({ value, onChange }) {
  const [busy, setBusy] = useState(false);
  const pick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("image", file);
    setBusy(true);
    try { const r = await axios.post("/api/images", fd); onChange(r.data.url); }
    catch (err) { fail(errMsg(err, "Upload failed")); }
    finally { setBusy(false); e.target.value = ""; }
  };
  return (
    <div className="grid gap-2">
      {value && <Img className="h-24 w-32 rounded-xl object-cover" src={value} alt="preview" />}
      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={pick} disabled={busy} className="text-sm text-sub" />
      <input className={input} placeholder="...or paste an image link (https://)" value={value || ""} onChange={(e) => onChange(e.target.value)} />
      {busy && <span className="text-sub">Uploading...</span>}
    </div>
  );
}

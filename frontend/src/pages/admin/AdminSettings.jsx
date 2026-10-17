import { useEffect, useState } from "react";
import axios from "axios";
import ImageUpload from "../../Components/ImageUpload.jsx";
import { useSite } from "../../Components/SiteContext.jsx";
import { ok, fail, errMsg } from "../../toast.js";
import { input, btn, smLight, field, label, block } from "../../ui.js";

const TEXT = ["shopName", "topBarText", "tagline", "welcomeText", "heroText", "facebook", "instagram", "whatsapp", "phone", "email", "address", "aboutTitle", "aboutText", "aboutPageText", "creatorName", "creatorBio", "creatorLink", "footerNote"];
const h3 = "text-xl font-bold text-head";

function ListEditor({ items, onChange, cols, blank }) {
  const set = (i, k, v) => onChange(items.map((it, n) => (n === i ? { ...it, [k]: v } : it)));
  return (
    <div>
      {items.map((it, i) => (
        <div className="mb-2 flex gap-2" key={i}>
          {cols.map((c) => (<input key={c.key} className={`${input} py-2.5`} placeholder={c.label} value={it[c.key] || ""} onChange={(e) => set(i, c.key, e.target.value)} />))}
          <button type="button" className="size-10 shrink-0 cursor-pointer rounded-full border border-line bg-card text-ink hover:bg-gold" onClick={() => onChange(items.filter((_, n) => n !== i))} aria-label="Remove"><i className="fa-solid fa-xmark"></i></button>
        </div>
      ))}
      <button type="button" className={smLight} onClick={() => onChange([...items, blank])}>+ Add</button>
    </div>
  );
}

const T = ({ text, name, f, set, area }) => (
  <label className={field}><span className={label}>{text}</span>
    {area ? <textarea className={input} rows="4" value={f[name] || ""} onChange={(e) => set(name, e.target.value)} /> : <input className={input} value={f[name] || ""} onChange={(e) => set(name, e.target.value)} />}
  </label>
);

export default function AdminSettings() {
  const { reload } = useSite();
  const [f, setF] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    axios.get("/api/settings").then((r) => setF({ ...r.data, aboutPoints: (r.data.aboutPoints || []).map((v) => ({ v })) })).catch(() => fail("Could not load settings"));
  }, []);
  if (!f) return <p className="text-sub">Loading...</p>;
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const p = { f, set };

  const save = async (e) => {
    e.preventDefault();
    const payload = {};
    [...TEXT, "heroImage", "aboutImage"].forEach((k) => { payload[k] = f[k] ?? ""; });
    payload.features = f.features.map(({ icon, title, text }) => ({ icon, title, text }));
    payload.stats = f.stats.map(({ value, label: l }) => ({ value, label: l }));
    payload.videos = f.videos.map(({ title, subtitle, url }) => ({ title, subtitle, url }));
    payload.aboutPoints = f.aboutPoints.map((x) => x.v).filter(Boolean);
    setBusy(true);
    try { await axios.put("/api/settings", payload); await reload(); ok("Website updated"); }
    catch (err) { fail(errMsg(err, "Could not save")); }
    finally { setBusy(false); }
  };

  return (
    <form onSubmit={save}>
      <h1 className="mb-6 text-3xl font-bold text-head">Site settings</h1>
      <div className={block}><h3 className={h3}>Brand and top bar</h3>
        <T text="Shop name" name="shopName" {...p} /><T text="Top bar text" name="topBarText" {...p} />
      </div>
      <div className={block}><h3 className={h3}>Home hero</h3>
        <T text="Small tagline" name="tagline" {...p} /><T text="Welcome text" name="welcomeText" {...p} /><T text="Hero description" name="heroText" {...p} area />
        <span className={label}>Hero image</span><ImageUpload value={f.heroImage} onChange={(v) => set("heroImage", v)} />
      </div>
      <div className={block}><h3 className={h3}>Feature cards</h3>
        <p className="text-sub">Icon is a Font Awesome name such as fa-truck-fast, fa-shield-halved, fa-headset, fa-award.</p>
        <ListEditor items={f.features} onChange={(v) => set("features", v)} cols={[{ key: "icon", label: "Icon (fa-...)" }, { key: "title", label: "Title" }, { key: "text", label: "Text" }]} blank={{ icon: "fa-star", title: "", text: "" }} />
      </div>
      <div className={block}><h3 className={h3}>Numbers (stats)</h3>
        <ListEditor items={f.stats} onChange={(v) => set("stats", v)} cols={[{ key: "value", label: "Value" }, { key: "label", label: "Label" }]} blank={{ value: "", label: "" }} />
      </div>
      <div className={block}><h3 className={h3}>About</h3>
        <T text="Home about title" name="aboutTitle" {...p} /><T text="Home about text" name="aboutText" {...p} area /><T text="About page text" name="aboutPageText" {...p} area />
        <span className={label}>About image</span><ImageUpload value={f.aboutImage} onChange={(v) => set("aboutImage", v)} />
        <span className={label}>Bullet points</span>
        <ListEditor items={f.aboutPoints} onChange={(v) => set("aboutPoints", v)} cols={[{ key: "v", label: "Point" }]} blank={{ v: "" }} />
      </div>
      <div className={block}><h3 className={h3}>Videos (home page)</h3>
        <p className="text-sub">Use a direct https link to an .mp4 file, or a path like /video1.mp4 placed in frontend/public.</p>
        <ListEditor items={f.videos} onChange={(v) => set("videos", v)} cols={[{ key: "title", label: "Title" }, { key: "subtitle", label: "Subtitle" }, { key: "url", label: "Video link" }]} blank={{ title: "", subtitle: "", url: "" }} />
      </div>
      <div className={block}><h3 className={h3}>Contact and social</h3>
        <T text="Phone" name="phone" {...p} /><T text="WhatsApp number (digits only, with country code)" name="whatsapp" {...p} /><T text="Email" name="email" {...p} /><T text="Address" name="address" {...p} />
        <T text="Facebook link" name="facebook" {...p} /><T text="Instagram link" name="instagram" {...p} />
      </div>
      <div className={block}><h3 className={h3}>Footer and creator page</h3>
        <T text="Footer note" name="footerNote" {...p} /><T text="Creator name" name="creatorName" {...p} /><T text="Creator bio" name="creatorBio" {...p} area /><T text="Creator link" name="creatorLink" {...p} />
      </div>
      <button className={`${btn} sticky bottom-4`} disabled={busy}>{busy ? "Saving..." : "Save changes"}</button>
    </form>
  );
}

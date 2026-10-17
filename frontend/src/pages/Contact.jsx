import { useState } from "react";
import axios from "axios";
import { useSite } from "../Components/SiteContext.jsx";
import { ok, fail, errMsg } from "../toast.js";
import { page, h1, input, btn, formCard } from "../ui.js";

const info = "my-3.5 block text-head hover:text-gold";

export default function Contact() {
  const { settings: s } = useSite();
  const blank = { name: "", email: "", phone: "", message: "" };
  const [form, setForm] = useState(blank);
  const [busy, setBusy] = useState(false);
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try { await axios.post("/api/contact", form); ok("Message sent. We will contact you soon."); setForm(blank); }
    catch (err) { fail(errMsg(err, "Could not send message")); }
    finally { setBusy(false); }
  };

  return (
    <div className={page}>
      <h1 className={h1}>Contact Us</h1>
      <div className="grid grid-cols-2 gap-10 max-md:grid-cols-1">
        <form className={formCard} onSubmit={submit}>
          <input className={input} name="name" value={form.name} onChange={change} placeholder="Your name" required maxLength={80} />
          <input className={input} type="email" name="email" value={form.email} onChange={change} placeholder="Your email" required />
          <input className={input} name="phone" value={form.phone} onChange={change} placeholder="Phone (optional)" maxLength={20} />
          <textarea className={input} name="message" value={form.message} onChange={change} placeholder="Your message" rows="5" required maxLength={1500} />
          <button className={btn} disabled={busy}>{busy ? "Sending..." : "Send message"}</button>
        </form>
        <div>
          {s.phone && <a className={info} href={`tel:${s.phone}`}><i className="fa-solid fa-phone mr-2.5 w-5 text-gold"></i>{s.phone}</a>}
          {s.whatsapp && <a className={info} href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noopener noreferrer"><i className="fab fa-whatsapp mr-2.5 w-5 text-gold"></i>Chat on WhatsApp</a>}
          {s.email && <a className={info} href={`mailto:${s.email}`}><i className="fa-solid fa-envelope mr-2.5 w-5 text-gold"></i>{s.email}</a>}
          {s.address && <p className={info}><i className="fa-solid fa-location-dot mr-2.5 w-5 text-gold"></i>{s.address}</p>}
        </div>
      </div>
    </div>
  );
}

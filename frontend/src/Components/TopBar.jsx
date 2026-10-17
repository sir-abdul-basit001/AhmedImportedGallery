import { useSite } from "./SiteContext.jsx";

const ic = "text-white transition hover:-translate-y-0.5 hover:text-gold";

export default function TopBar() {
  const { settings: s } = useSite();
  return (
    <div className="flex items-center justify-between bg-navy px-[8%] py-2.5 text-sm text-white max-sm:flex-col max-sm:gap-2.5 max-sm:px-5 max-sm:text-center">
      <p>{s.topBarText}</p>
      <div className="flex gap-4">
        {s.facebook && <a className={ic} href={s.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>}
        {s.instagram && <a className={ic} href={s.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fab fa-instagram"></i></a>}
        {s.whatsapp && <a className={ic} href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><i className="fab fa-whatsapp"></i></a>}
      </div>
    </div>
  );
}

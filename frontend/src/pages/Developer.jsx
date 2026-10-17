import { useSite } from "../Components/SiteContext.jsx";
import { narrow, h1, formCard, link } from "../ui.js";

export default function Developer() {
  const { settings: s } = useSite();
  return (
    <div className={narrow}>
      <h1 className={h1}>About Creator</h1>
      <div className={formCard}>
        <h2 className="text-2xl font-bold text-head">{s.creatorName}</h2>
        <p className="leading-8 whitespace-pre-line text-sub">{s.creatorBio}</p>
        {s.creatorLink && <a className={link} href={s.creatorLink} target="_blank" rel="noopener noreferrer"><i className="fa-solid fa-link"></i> View portfolio</a>}
      </div>
    </div>
  );
}

import { useSite } from "../Components/SiteContext.jsx";
import { Stats, AboutBlock } from "./Home.jsx";

export default function About() {
  const { settings: s } = useSite();
  return (<><AboutBlock s={s} text={s.aboutPageText} to="/contact" cta="Contact Us" /><Stats stats={s.stats} /></>);
}

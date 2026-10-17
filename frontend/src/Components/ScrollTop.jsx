import { useEffect, useState } from "react";

export default function ScrollTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);
  if (!show) return null;
  return (
    <button aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed right-8 bottom-8 z-40 size-14 cursor-pointer rounded-full bg-navy text-xl text-white shadow-soft transition hover:bg-gold">
      <i className="fa-solid fa-arrow-up"></i>
    </button>
  );
}

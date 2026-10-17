import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { useSite } from "../Components/SiteContext.jsx"
import ProductCard from "../Components/ProductCard.jsx"
import Img from "../Components/Img.jsx"
import { sec, btn, btnOutline } from "../ui.js"

const catCard =
  "group block min-w-0 overflow-hidden rounded-3xl bg-card p-4 shadow-soft transition duration-300 hover:-translate-y-2 hover:shadow-xl sm:p-5"

export default function Home() {
  const { settings: s } = useSite()
  const [cats, setCats] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
    axios
      .get("/api/categories")
      .then((r) => setCats(r.data.slice(0, 6)))
      .catch(() => {})

    axios
      .get("/api/products", {
        params: { featured: true, limit: 8 },
      })
      .then((r) => setProducts(r.data))
      .catch(() => {})
  }, [])

  return (
    <main className="w-full min-w-0 overflow-x-clip">
      {/* HERO SECTION */}
      <section className="grid min-w-0 grid-cols-1 overflow-hidden bg-page lg:min-h-[calc(100svh-72px)] lg:grid-cols-2">
        {/* Image first on mobile */}
        <div className="relative order-1 h-[38vh] min-h-[250px] w-full sm:h-[48vh] lg:order-2 lg:h-auto lg:min-h-[600px]">
          <Img
            src={s.heroImage}
            alt={s.shopName || "Ahmed Imported Gallery"}
            loading="eager"
            className="absolute inset-0 h-full w-full rounded-none object-cover object-center"
          />
        </div>

        {/* Text below image on mobile */}
        <div className="order-2 flex flex-col justify-center px-5 py-10 sm:px-10 sm:py-14 lg:order-1 lg:px-10 xl:px-16 xl:py-20">
          <span className="text-sm font-bold tracking-[2px] text-gold sm:text-base">
            {s.tagline}
          </span>

          <p className="pt-4 text-xl font-medium text-sub sm:text-2xl lg:text-3xl">
            {s.welcomeText}
          </p>

          <h1 className="my-4 break-words text-4xl leading-tight font-extrabold text-gold sm:text-5xl xl:text-6xl">
            {(s.shopName || "Ahmed Imported Gallery").toUpperCase()}
          </h1>

          <p className="mb-8 max-w-xl text-sm leading-7 text-sub sm:text-base lg:text-lg">
            {s.heroText}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link to="/shop" className={`${btn} justify-center`}>
              Explore Shop
            </Link>

            <Link to="/contact" className={`${btnOutline} justify-center`}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section
        className={`${sec} grid grid-cols-1 gap-5 bg-card sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 xl:gap-8`}
      >
        {(s.features || []).map((f, i) => (
          <div
            key={i}
            className={`group relative flex min-w-0 flex-col items-center overflow-hidden rounded-3xl px-5 py-8 text-center shadow-soft transition duration-300 hover:-translate-y-2 hover:bg-navy hover:text-white sm:px-6 sm:py-10 ${
              i % 4 === 1 ? "bg-gold/10" : "bg-page"
            }`}
          >
            <i
              className={`fa-solid ${f.icon} mb-5 text-5xl text-gold transition duration-300 group-hover:scale-110 group-hover:rotate-6 sm:text-6xl`}
            />

            <h3 className="mb-3 text-lg font-bold text-head transition-colors group-hover:text-white sm:text-xl">
              {f.title}
            </h3>

            <p className="max-w-xs text-sm leading-7 text-sub transition-colors group-hover:text-white/80 sm:text-base">
              {f.text}
            </p>
          </div>
        ))}
      </section>

      {/* POPULAR CATEGORIES */}
      <section className={`${sec} bg-page`}>
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
          <span className="text-xs font-bold tracking-[3px] text-gold sm:text-sm">
            BROWSE OUR COLLECTION
          </span>

          <h2 className="mt-3 text-3xl font-extrabold text-head sm:text-4xl lg:text-5xl">
            Popular Categories
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-sub sm:text-base">
            Explore our collections and discover products selected for you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8">
          {cats.map((c) => (
            <Link
              key={c._id}
              to={`/shop?category=${c._id}`}
              className={catCard}
            >
              <div className="overflow-hidden rounded-2xl bg-page">
                <Img
                  src={c.image}
                  alt={c.name}
                  className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72 lg:h-80"
                />
              </div>

              <div className="flex items-center justify-between gap-3 px-1 pt-5 pb-2">
                <h3 className="break-words text-base font-bold text-head sm:text-lg">
                  {c.name}
                </h3>

                <i className="fa-solid fa-arrow-right shrink-0 text-gold transition duration-300 group-hover:translate-x-1" />
              </div>
            </Link>
          ))}

          <Link
            to="/categories"
            className={`${catCard} flex min-h-[300px] flex-col items-center justify-center text-center sm:min-h-[340px]`}
          >
            <i className="fa-solid fa-box-open text-6xl text-gold transition duration-300 group-hover:scale-110 sm:text-7xl" />

            <h3 className="mt-6 text-lg font-bold text-head sm:text-xl">
              Explore More
            </h3>

            <p className="mt-2 text-sm text-sub">Discover all categories</p>
          </Link>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className={`${sec} bg-card`}>
        <div className="mb-8 flex flex-col gap-4 sm:mb-11 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-bold tracking-[3px] text-gold sm:text-sm">
              OUR SELECTION
            </span>

            <h2 className="mt-3 text-3xl font-extrabold text-head sm:text-4xl">
              Featured Products
            </h2>
          </div>

          <Link
            to="/shop"
            className="inline-flex w-fit items-center gap-2 rounded-full px-5 py-3 font-semibold text-gold transition hover:bg-navy hover:text-white"
          >
            View All
            <i className="fa-solid fa-arrow-right" />
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="rounded-2xl bg-page px-5 py-10 text-center text-sub">
            Products will appear here soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8">
            {products.map((p) => (
              <ProductCard key={p._id} p={p} />
            ))}
          </div>
        )}
      </section>

      {/* STATISTICS */}
      <Stats stats={s.stats} />

      {/* ABOUT SECTION */}
      <AboutBlock s={s} text={s.aboutText} to="/about" cta="Read More" />

      {/* VIDEOS */}
      {s.videos?.length > 0 && (
        <section className={`${sec} bg-page`}>
          <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
            <span className="text-xs font-bold tracking-[3px] text-gold sm:text-sm">
              TAKE A CLOSER LOOK
            </span>

            <h2 className="mt-3 text-3xl font-extrabold text-head sm:text-4xl lg:text-5xl">
              Our Gallery
            </h2>

            <p className="mt-4 text-sm leading-7 text-sub sm:text-base">
              Explore our products and store through video.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            {s.videos.map((v, i) => (
              <div
                key={i}
                className="relative min-w-0 overflow-hidden rounded-2xl border border-line bg-card shadow-soft"
              >
                <video
                  className="aspect-video w-full bg-black object-cover"
                  controls
                  preload="metadata"
                  playsInline
                >
                  <source src={v.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                <div className="p-4 sm:p-6">
                  <h3 className="text-lg font-bold text-head sm:text-xl">
                    {v.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-sub">
                    {v.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

export function Stats({ stats = [] }) {
  return (
    <section
      className={`${sec} grid grid-cols-1 gap-4 bg-linear-to-br from-navy to-[#173d7f] text-center text-white sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 xl:gap-8`}
    >
      {stats.map((st, i) => (
        <div
          key={i}
          className="rounded-2xl border border-white/10 px-4 py-8 transition duration-300 hover:bg-white/5 sm:px-5 sm:py-10"
        >
          <h2 className="mb-3 break-words text-4xl font-extrabold text-gold sm:text-5xl lg:text-[52px]">
            {st.value}
          </h2>

          <p className="text-sm leading-6 text-white/90 sm:text-base lg:text-lg">
            {st.label}
          </p>
        </div>
      ))}
    </section>
  )
}

export function AboutBlock({ s, text, to, cta }) {
  return (
    <section
      className={`${sec} grid grid-cols-1 items-center gap-8 bg-page sm:gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-[70px]`}
    >
      {/* Image first on mobile */}
      <div className="min-w-0 overflow-hidden rounded-3xl">
        <Img
          src={s.aboutImage}
          alt={s.aboutTitle || "About Ahmed Imported Gallery"}
          className="max-h-[500px] min-h-[250px] w-full rounded-3xl object-cover shadow-soft transition duration-500 hover:scale-[1.02] sm:min-h-[350px] lg:min-h-[450px]"
        />
      </div>

      <div className="min-w-0">
        <span className="text-xs font-bold tracking-[3px] text-gold sm:text-sm">
          ABOUT US
        </span>

        <h2 className="mt-3 mb-5 text-3xl leading-tight font-extrabold text-head sm:text-4xl lg:text-5xl">
          {s.aboutTitle}
        </h2>

        <p className="mb-6 text-sm leading-7 whitespace-pre-line text-sub sm:text-base sm:leading-8">
          {text}
        </p>

        <ul className="mb-8 space-y-4">
          {(s.aboutPoints || []).map((p, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm leading-6 font-medium text-ink sm:text-base"
            >
              <i className="fa-solid fa-check mt-1 shrink-0 text-gold" />
              <span>{p}</span>
            </li>
          ))}
        </ul>

        <Link to={to} className={`${btn} inline-flex justify-center`}>
          {cta}
        </Link>
      </div>
    </section>
  )
}

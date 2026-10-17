import { Link } from "react-router-dom"
import { btn, center } from "../ui.js"

export default function NotFound() {
  return (
    <div className={center}>
      <h1 className="mb-6 text-4xl font-bold text-head">Page not found</h1>
      <Link className={btn} to="/">
        Go home
      </Link>
    </div>
  )
}

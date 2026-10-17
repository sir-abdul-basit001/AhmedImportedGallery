export default function Img({ src, alt = "", className = "", ...rest }) {
  return (
    <img
      src={src || "/placeholder.svg"} alt={alt} loading="lazy" className={`block w-full ${className}`}
      onError={(e) => { if (!e.currentTarget.src.endsWith("/placeholder.svg")) e.currentTarget.src = "/placeholder.svg"; }}
      {...rest}
    />
  );
}

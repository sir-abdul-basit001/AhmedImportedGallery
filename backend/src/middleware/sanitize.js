const BAD = new Set(["__proto__", "constructor", "prototype"]);
const clean = (o) => {
  if (!o || typeof o !== "object") return;
  for (const k of Object.keys(o)) {
    if (k.startsWith("$") || k.includes(".") || BAD.has(k)) delete o[k];
    else clean(o[k]);
  }
};
export default function sanitize(req, res, next) {
  clean(req.body);
  clean(req.params);
  next();
}

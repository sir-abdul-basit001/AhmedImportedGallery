import { toast } from "react-toastify";
export const ok = (m) => toast.success(m);
export const fail = (m) => toast.error(m);
export const errMsg = (e, fallback = "Something went wrong") => e?.response?.data?.message || fallback;

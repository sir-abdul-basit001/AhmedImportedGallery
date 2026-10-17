import { z } from "zod";

const s = (max) => z.string().trim().max(max);
const media = z.union([z.literal(""), z.string().trim().max(500).regex(/^(\/|https:\/\/)[^\s"'<>]*$/, "Invalid link")]);
const email = z.string().trim().toLowerCase().max(120).pipe(z.email("Invalid email address"));
const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id");
const icon = z.string().regex(/^fa-[a-z0-9-]{1,40}$/, "Invalid icon");
const password = z.string().min(8, "Password must be at least 8 characters").max(72)
  .regex(/[A-Za-z]/, "Password needs a letter").regex(/\d/, "Password needs a number");

export const registerSchema = z.object({ name: s(60).min(2), email: email, password });
export const loginSchema = z.object({ email: email, password: z.string().min(1).max(72) });
export const passwordSchema = z.object({ current: z.string().min(1).max(72), password });

export const productSchema = z.object({
  name: s(120).min(1), description: s(2000).default(""), price: z.coerce.number().min(0).max(10000000),
  image: media.default(""), category: objectId, badge: z.enum(["", "New", "Sale"]).default(""),
  featured: z.boolean().default(false), inStock: z.boolean().default(true),
});
export const categorySchema = z.object({ name: s(60).min(1), image: media.default("") });
export const gallerySchema = z.object({ image: media.refine((v) => v !== "", "Image required"), caption: s(200).default("") });

export const contactSchema = z.object({
  name: s(80).min(1), email: email,
  phone: s(20).default(""), message: s(1500).min(1),
});

export const orderSchema = z.object({
  items: z.array(z.object({ product: objectId, qty: z.coerce.number().int().min(1).max(50) })).min(1).max(50),
  phone: s(20).regex(/^[0-9+\-\s]{7,20}$/, "Invalid phone number"), address: s(300).min(5), note: s(300).default(""),
});
export const orderStatusSchema = z.object({ status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]) });
export const userPatchSchema = z.object({ role: z.enum(["user", "admin"]).optional(), active: z.boolean().optional() });

export const settingsSchema = z.object({
  shopName: s(80), topBarText: s(150), tagline: s(150), welcomeText: s(60), heroText: s(300), heroImage: media,
  facebook: media, instagram: media, whatsapp: s(20), phone: s(30), email: z.union([z.literal(""), z.email().max(120)]), address: s(300),
  features: z.array(z.object({ icon, title: s(60), text: s(150) })).max(8),
  stats: z.array(z.object({ value: s(20), label: s(40) })).max(8),
  aboutTitle: s(100), aboutText: s(1500), aboutImage: media, aboutPoints: z.array(s(80)).max(10), aboutPageText: s(5000),
  videos: z.array(z.object({ title: s(80), subtitle: s(150), url: media })).max(10),
  creatorName: s(60), creatorBio: s(1500), creatorLink: media, footerNote: s(150),
}).partial();

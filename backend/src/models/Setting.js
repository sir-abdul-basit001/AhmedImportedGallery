import mongoose from "mongoose";
const S = (d = "") => ({ type: String, default: d });

export default mongoose.model("Setting", new mongoose.Schema({
  key: { type: String, default: "main", unique: true },
  shopName: S("Ahmed Imported Gallery"),
  topBarText: S("Free Delivery on Orders Above PKR 3000"),
  tagline: S("Everything You Need. All In One Store."),
  welcomeText: S("welcome to"),
  heroText: S("Quality products, affordable prices, fast delivery, and trusted customer service."),
  heroImage: S("/shop.jpeg"),
  facebook: S("https://www.facebook.com/profile.php?id=61559822194638"),
  instagram: S("https://www.instagram.com/ahmedimportedgallery"),
  whatsapp: S("923477874447"),
  phone: S("+923477874447"),
  email: S("ahmedimportedgallery@gmail.com"),
  address: S("نیو بنوں چنگی السعودیہ بازار نزد زوہیب میڈیکل سٹور"),
  features: { type: [{ icon: String, title: String, text: String, _id: false }], default: [
    { icon: "fa-truck-fast", title: "Fast Delivery", text: "Delivery available across Pakistan." },
    { icon: "fa-shield-halved", title: "Secure Payments", text: "100% Safe Shopping Experience." },
    { icon: "fa-headset", title: "24/7 Support", text: "Always ready to help customers." },
    { icon: "fa-award", title: "Premium Quality", text: "Trusted brands only." },
  ] },
  stats: { type: [{ value: String, label: String, _id: false }], default: [
    { value: "5000+", label: "Happy Customers" }, { value: "350+", label: "Products" },
    { value: "15+", label: "Years Experience" }, { value: "24/7", label: "Support" },
  ] },
  aboutTitle: S("Your Trusted Local Store"),
  aboutText: S("We provide quality products from trusted brands with affordable prices and friendly customer service."),
  aboutImage: S("/gallery.jpeg"),
  aboutPoints: { type: [String], default: ["Genuine Products", "Affordable Prices", "Fast Delivery", "Customer Satisfaction"] },
  aboutPageText: S("Ahmed Imported Gallery brings quality imported clothing, curtains, bags, shoes and more at affordable prices, with fast delivery and friendly service."),
  videos: { type: [{ title: String, subtitle: String, url: String, _id: false }], default: [] },
  creatorName: S("AbdulBasit"),
  creatorBio: S("This website was designed and built by AbdulBasit as a MERN stack project."),
  creatorLink: S("https://portfolio-five-drab-14.vercel.app/"),
  footerNote: S("Quality products at affordable prices."),
}, { timestamps: true }));

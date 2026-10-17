import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { setAuthCookie, clearAuthCookie, publicUser } from "../services/token.js";

const DUMMY_HASH = bcrypt.hashSync("not-a-real-password-1", 12);
const MAX_FAILS = 5;
const LOCK_MS = 15 * 60 * 1000;

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (await User.exists({ email })) return res.status(409).json({ message: "Email already registered" });
  const user = await User.create({ name, email, password: await bcrypt.hash(password, 12) });
  setAuthCookie(res, user);
  res.status(201).json(publicUser(user));
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (user?.lockUntil && user.lockUntil > Date.now())
    return res.status(423).json({ message: "Too many failed attempts. Try again in 15 minutes." });
  const ok = await bcrypt.compare(password, user?.password || DUMMY_HASH);
  if (!user || !ok || !user.active) {
    if (user) {
      user.failedLogins += 1;
      if (user.failedLogins >= MAX_FAILS) { user.lockUntil = new Date(Date.now() + LOCK_MS); user.failedLogins = 0; }
      await user.save();
    }
    return res.status(401).json({ message: "Invalid email or password" });
  }
  user.failedLogins = 0;
  user.lockUntil = null;
  await user.save();
  setAuthCookie(res, user);
  res.json(publicUser(user));
};

export const logout = (req, res) => { clearAuthCookie(res); res.json({ message: "Logged out" }); };

export const me = (req, res) => res.json(publicUser(req.user));

export const changePassword = async (req, res) => {
  const user = await User.findById(req.user._id).select("+password");
  if (!(await bcrypt.compare(req.body.current, user.password)))
    return res.status(400).json({ message: "Current password is incorrect" });
  user.password = await bcrypt.hash(req.body.password, 12);
  user.tokenVersion += 1; // signs the user out on every other device
  await user.save();
  setAuthCookie(res, user);
  res.json({ message: "Password updated" });
};

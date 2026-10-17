import jwt from "jsonwebtoken";
import { env } from "./env.js";

const MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export const signToken = (user) =>
  jwt.sign({ sub: String(user._id), v: user.tokenVersion }, env.jwtSecret, { expiresIn: "7d" });

export const verifyToken = (token) => jwt.verify(token, env.jwtSecret);

export const setAuthCookie = (res, user) =>
  res.cookie("token", signToken(user), {
    httpOnly: true,
    secure: env.isProd,
    sameSite: "strict",
    maxAge: MAX_AGE,
    path: "/",
  });

export const clearAuthCookie = (res) =>
  res.clearCookie("token", { httpOnly: true, secure: env.isProd, sameSite: "strict", path: "/" });

export const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role });

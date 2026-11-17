import jwt from "jsonwebtoken"
import { env } from "./env.js"

const MAX_AGE = 7 * 24 * 60 * 60 * 1000

export const signToken = (user) =>
  jwt.sign(
    {
      sub: String(user._id),
      v: user.tokenVersion,
    },
    env.jwtSecret,
    { expiresIn: "7d" },
  )

export const verifyToken = (token) => jwt.verify(token, env.jwtSecret)

const cookieOptions = {
  httpOnly: true,
  secure: env.isProd,
  sameSite: env.isProd ? "none" : "lax",
  maxAge: MAX_AGE,
  path: "/",
}

export const setAuthCookie = (res, user) => {
  res.cookie("token", signToken(user), cookieOptions)
}

export const clearAuthCookie = (res) => {
  const { maxAge, ...options } = cookieOptions

  res.clearCookie("token", options)
}

export const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
})

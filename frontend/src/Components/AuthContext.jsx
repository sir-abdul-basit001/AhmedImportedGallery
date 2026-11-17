import { createContext, useContext, useEffect, useState } from "react"

import axios from "axios"

const Ctx = createContext(null)

axios.defaults.withCredentials = true

export const useAuth = () => useContext(Ctx)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const checkAuth = async () => {
      try {
        const response = await axios.get("/api/auth/me")

        if (mounted) {
          setUser(response.data)
        }
      } catch (error) {
        if (mounted) {
          setUser(null)

          if (error.response?.status !== 401) {
            console.error(
              "Authentication check failed:",
              error.response?.data || error.message,
            )
          }
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    checkAuth()

    return () => {
      mounted = false
    }
  }, [])

  const login = async (email, password) => {
    const response = await axios.post("/api/auth/login", {
      email,
      password,
    })

    setUser(response.data)

    return response.data
  }

  const register = async (name, email, password) => {
    const response = await axios.post("/api/auth/register", {
      name,
      email,
      password,
    })

    setUser(response.data)

    return response.data
  }

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout")
    } finally {
      setUser(null)
    }
  }

  return (
    <Ctx.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </Ctx.Provider>
  )
}

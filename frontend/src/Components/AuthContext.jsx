import { createContext, useContext, useEffect, useState } from "react"
import axios from "axios"

const Ctx = createContext(null)

axios.defaults.withCredentials = true
axios.defaults.headers.common["Content-Type"] = "application/json"

export const useAuth = () => useContext(Ctx)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    axios
      .get("/api/auth/me")
      .then((response) => {
        if (mounted) setUser(response.data)
      })
      .catch(() => {
        if (mounted) setUser(null)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

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

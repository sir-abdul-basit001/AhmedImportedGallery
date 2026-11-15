import { createContext, useContext, useEffect, useState } from "react"

const Ctx = createContext(null)

export const useCart = () => useContext(Ctx)

const KEY = "aig_cart"

const read = () => {
  try {
    const value = JSON.parse(localStorage.getItem(KEY))

    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(read)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {
      // Storage may be unavailable.
    }
  }, [items])

  const add = (product) => {
    if (!product?._id) return

    setItems((previous) => {
      const prev = Array.isArray(previous) ? previous : []

      const found = prev.find((item) => item._id === product._id)

      if (found) {
        return prev.map((item) =>
          item._id === product._id
            ? {
                ...item,
                qty: Math.min((Number(item.qty) || 1) + 1, 50),
              }
            : item,
        )
      }

      return [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          qty: 1,
        },
      ]
    })
  }

  const setQty = (id, qty) => {
    setItems((previous) =>
      previous.map((item) =>
        item._id === id
          ? {
              ...item,
              qty: Math.max(1, Math.min(50, Number(qty) || 1)),
            }
          : item,
      ),
    )
  }

  const remove = (id) => {
    setItems((previous) => previous.filter((item) => item._id !== id))
  }

  const clear = () => setItems([])

  const count = items.reduce(
    (total, item) => total + (Number(item.qty) || 0),
    0,
  )

  const total = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 0),
    0,
  )

  return (
    <Ctx.Provider
      value={{
        items,
        add,
        setQty,
        remove,
        clear,
        count,
        total,
      }}
    >
      {children}
    </Ctx.Provider>
  )
}

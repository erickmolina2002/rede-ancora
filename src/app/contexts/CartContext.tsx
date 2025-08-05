'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { ProductItem } from '../ui/cards/ProductCard'

type CartContextType = {
  items: ProductItem[]
  addItem: (item: ProductItem) => void
  removeItem: (id: number) => void
  clearCart: () => void
  getTotalItems: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ProductItem[]>([])

  const addItem = (item: ProductItem) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === item.id)
      if (exists) {
        return prev
      }
      return [...prev, item]
    })
  }

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalItems = () => {
    return items.length
  }

  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      removeItem, 
      clearCart, 
      getTotalItems 
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
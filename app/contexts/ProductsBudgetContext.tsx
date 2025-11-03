'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { ProductItem } from '../ui/cards/ProductCard'

export type ProductWithPricing = {
  id: number
  name: string
  brand: string
  code: string
  imageUrl: string | null
  unitPrice: number
  quantity: number
  totalPrice: number
  originalProduct: ProductItem
}

type ProductsBudgetContextType = {
  products: ProductWithPricing[]
  addProduct: (product: ProductItem) => void
  removeProduct: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  updateUnitPrice: (id: number, price: number) => void
  getTotalAmount: () => number
  getTotalItems: () => number
  clearProducts: () => void
  hasProducts: () => boolean
}

const ProductsBudgetContext = createContext<ProductsBudgetContextType | undefined>(undefined)

// Generate random price for products (60-300 reais, round values)
const generateRandomPrice = () => {
  const min = 60
  const max = 300
  const randomValue = Math.floor(Math.random() * (max - min + 1)) + min
  // Round to nearest 10 for cleaner values
  return Math.round(randomValue / 10) * 10
}

export function ProductsBudgetProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<ProductWithPricing[]>([])

  const addProduct = (product: ProductItem) => {
    setProducts(prev => {
      const exists = prev.find(p => p.id === product.id)
      if (exists) {
        return prev // Already exists, don't add duplicate
      }

      // Usar o preço do produto se disponível, senão gerar aleatório
      const unitPrice = product.preco || generateRandomPrice()
      const newProduct: ProductWithPricing = {
        id: product.id,
        name: product.nomeProduto,
        brand: product.marca,
        code: product.codigoReferencia,
        imageUrl: product.imagemReal,
        unitPrice,
        quantity: 1,
        totalPrice: unitPrice,
        originalProduct: product
      }

      return [...prev, newProduct]
    })
  }

  const removeProduct = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return

    setProducts(prev =>
      prev.map(product =>
        product.id === id
          ? { ...product, quantity, totalPrice: product.unitPrice * quantity }
          : product
      )
    )
  }

  const updateUnitPrice = (id: number, price: number) => {
    if (price < 0) return

    setProducts(prev =>
      prev.map(product =>
        product.id === id
          ? { ...product, unitPrice: price, totalPrice: price * product.quantity }
          : product
      )
    )
  }

  const getTotalAmount = () => {
    return products.reduce((sum, product) => sum + product.totalPrice, 0)
  }

  const getTotalItems = () => {
    return products.reduce((sum, product) => sum + product.quantity, 0)
  }

  const clearProducts = () => {
    setProducts([])
  }

  const hasProducts = () => {
    return products.length > 0
  }

  return (
    <ProductsBudgetContext.Provider value={{
      products,
      addProduct,
      removeProduct,
      updateQuantity,
      updateUnitPrice,
      getTotalAmount,
      getTotalItems,
      clearProducts,
      hasProducts
    }}>
      {children}
    </ProductsBudgetContext.Provider>
  )
}

export function useProductsBudget() {
  const context = useContext(ProductsBudgetContext)
  if (context === undefined) {
    throw new Error('useProductsBudget must be used within a ProductsBudgetProvider')
  }
  return context
}

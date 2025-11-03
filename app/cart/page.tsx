"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface CartItem {
  id: number
  name: string
  image: string
  price: number
  quantity: number
  inStock: boolean
}

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Flange Conexão Com Tampa Mangueira Radiador Freemont Journey",
      image: "/placeholder.svg?height=200&width=200",
      price: 134.92,
      quantity: 2,
      inStock: true,
    },
    {
      id: 2,
      name: "Par Encolhedor De Mola Traseira E Dianteira Universal Ref.",
      image: "/placeholder.svg?height=200&width=200",
      price: 574.92,
      quantity: 1,
      inStock: true,
    },
    {
      id: 3,
      name: "Kit Limpador Para-brisa C/ Reservatório Fiesta Hatch/Sedan 1.0",
      image: "/placeholder.svg?height=150&width=150",
      price: 138.54,
      quantity: 1,
      inStock: true,
    },
  ])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const updateQuantity = (id: number, delta: number) => {
    setCartItems((items) =>
      items.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item)),
    )
  }

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 200 ? 0 : 15.9
  const total = subtotal + shipping

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="bg-white border-b border-border p-4 flex items-center">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full -ml-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg sm:text-xl font-bold text-foreground ml-2">Carrinho</h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-muted flex items-center justify-center mb-4">
            <ShoppingBag className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Carrinho vazio</h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-6">Adicione produtos para começar suas compras</p>
          <Link href="/home">
            <Button size="lg" className="bg-primary hover:bg-primary/90 h-12">
              Ir para o Catálogo
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-48">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-40">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full -ml-2 flex-shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg sm:text-xl font-bold text-foreground ml-2">Carrinho</h1>
          </div>
          <Badge variant="secondary" className="text-xs sm:text-sm font-semibold flex-shrink-0">
            {cartItems.length} {cartItems.length === 1 ? "item" : "itens"}
          </Badge>
        </div>
      </div>

      {/* Cart Items */}
      <div className="p-4 space-y-3">
        {cartItems.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-border p-3 sm:p-4 animate-slide-up">
            <div className="flex gap-3">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-contain p-2" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs sm:text-sm font-semibold text-foreground line-clamp-2 leading-tight mb-2">
                  {item.name}
                </h3>
                <p className="text-base sm:text-lg font-bold text-primary">{formatPrice(item.price)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 sm:mt-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-transparent"
                  onClick={() => updateQuantity(item.id, -1)}
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-transparent"
                  onClick={() => updateQuantity(item.id, 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 text-xs sm:text-sm"
                onClick={() => removeItem(item.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remover
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Shipping Info */}
      {shipping === 0 && (
        <div className="mx-4 mb-4 bg-green-50 border border-green-200 rounded-xl p-3 sm:p-4">
          <p className="text-xs sm:text-sm font-medium text-green-700">Frete grátis para compras acima de R$ 200,00</p>
        </div>
      )}

      {/* Fixed Bottom Summary */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-40 safe-area-bottom">
        <div className="p-4 space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Frete</span>
              <span className="font-medium text-foreground">{shipping === 0 ? "Grátis" : formatPrice(shipping)}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-base sm:text-lg font-bold text-foreground">Total</span>
              <span className="text-base sm:text-lg font-bold text-primary">{formatPrice(total)}</span>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-primary hover:bg-primary/90"
            onClick={() => router.push("/checkout")}
          >
            Finalizar Compra
          </Button>
        </div>
      </div>
    </div>
  )
}

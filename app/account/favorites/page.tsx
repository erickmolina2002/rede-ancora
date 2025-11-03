"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { BottomNav } from "@/components/bottom-nav"

const favoriteProducts = [
  {
    id: 1,
    name: "Flange Conexão Com Tampa Mangueira Radiador Freemont Journey",
    image: "/placeholder.svg?height=200&width=200",
    price: 134.92,
    originalPrice: 183.16,
    discount: 26,
    inStock: true,
  },
  {
    id: 3,
    name: "Kit Limpador Para-brisa C/ Reservatório Fiesta Hatch/Sedan 1.0",
    image: "/placeholder.svg?height=150&width=150",
    price: 138.54,
    inStock: true,
  },
  {
    id: 5,
    name: "Mangueira Inferior Radiador Fiesta 1.0 1.6 8v 16v",
    image: "/placeholder.svg?height=150&width=150",
    price: 156.3,
    inStock: true,
  },
  {
    id: 6,
    name: "Bomba D'água Fiesta 1.0 Zetec Rocam",
    image: "/placeholder.svg?height=150&width=150",
    price: 134.47,
    inStock: true,
  },
]

export default function FavoritesPage() {
  const router = useRouter()
  const [favorites, setFavorites] = useState(favoriteProducts)

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-40">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-foreground ml-3">Favoritos</h1>
          </div>
          <span className="text-sm text-muted-foreground">{favorites.length} itens</span>
        </div>
      </div>

      {/* Favorites Grid */}
      <div className="p-4">
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Nenhum favorito ainda</h2>
            <p className="text-muted-foreground mb-6">Adicione produtos aos favoritos para vê-los aqui</p>
            <Button onClick={() => router.push("/home")} className="bg-primary hover:bg-primary/90">
              Explorar Produtos
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}

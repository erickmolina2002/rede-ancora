"use client"

import { useState } from "react"
import { ArrowLeft, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { BottomNav } from "@/components/bottom-nav"
import Link from "next/link"

const offerProducts = [
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
    id: 2,
    name: "Par Encolhedor De Mola Traseira E Dianteira Universal Ref.",
    image: "/placeholder.svg?height=200&width=200",
    price: 574.92,
    originalPrice: 749.92,
    discount: 23,
    inStock: true,
  },
  {
    id: 9,
    name: "Kit Correia Dentada + Tensor Fiesta 1.0 1.6",
    image: "/placeholder.svg?height=200&width=200",
    price: 245.8,
    originalPrice: 320.5,
    discount: 23,
    inStock: true,
  },
  {
    id: 10,
    name: "Amortecedor Dianteiro Par Fiesta Hatch Sedan",
    image: "/placeholder.svg?height=200&width=200",
    price: 389.9,
    originalPrice: 520.0,
    discount: 25,
    inStock: true,
  },
]

export default function OffersPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProducts = offerProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-40">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/home">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-foreground">
              <span className="text-ancora-red">Ofertas</span> Especiais
            </h1>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar ofertas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="p-4">
        <div className="bg-gradient-to-r from-ancora-red to-red-600 rounded-xl p-4 mb-6 text-white">
          <h2 className="text-lg font-bold mb-1">Descontos de até 30%</h2>
          <p className="text-sm text-white/90">Aproveite as melhores ofertas em peças automotivas</p>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {filteredProducts.length} {filteredProducts.length === 1 ? "oferta disponível" : "ofertas disponíveis"}
        </p>

        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} compact />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

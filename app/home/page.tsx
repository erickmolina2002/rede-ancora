"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Search, ShoppingCart, Wrench, Zap, Fuel, Settings } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/product-card"
import { BottomNav } from "@/components/bottom-nav"
import Link from "next/link"
import { getFeaturedProducts, getRecentProducts, searchProducts } from "@/lib/mockProducts"

const categories = [
  { id: "injecao", name: "Injeção", icon: Zap },
  { id: "motores", name: "Motores", icon: Settings },
  { id: "abrantes", name: "Abrantes", icon: Wrench },
  { id: "combustivel", name: "Combustível", icon: Fuel },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [cartCount] = useState(3)
  const [featuredProducts, setFeaturedProducts] = useState(getFeaturedProducts(2))
  const [recentProducts, setRecentProducts] = useState(getRecentProducts(6))
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (searchQuery.length >= 3) {
      const timer = setTimeout(() => {
        filterProducts(searchQuery)
      }, 500)
      return () => clearTimeout(timer)
    } else if (searchQuery.length === 0) {
      setFeaturedProducts(getFeaturedProducts(2))
      setRecentProducts(getRecentProducts(6))
    }
  }, [searchQuery])

  const filterProducts = (query: string) => {
    setIsLoading(true)
    const filtered = searchProducts(query)
    setFeaturedProducts(filtered.slice(0, 2))
    setRecentProducts(filtered.slice(2, 8))
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background pb-20 max-w-screen-lg mx-auto">
      {/* Header */}
      <div className="bg-primary text-white sticky top-0 z-40 shadow-lg">
        <div className="p-4 pb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1" />
            <Image
              src="/images/rede.png"
              alt="Ancora Express"
              width={120}
              height={60}
              className="h-10 w-auto"
            />
            <div className="flex-1 flex justify-end">
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-ancora-red border-2 border-white text-xs">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Busque um produto"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-white border-0 shadow-md text-foreground placeholder:text-muted-foreground text-base"
            />
          </div>
        </div>
      </div>

      <div className="p-4 bg-white border-b">
        <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">Busca/orçamentos</h2>
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link key={category.id} href={`/catalog?category=${category.id}`}>
                <div className="flex flex-col items-center gap-2 p-2 sm:p-3 bg-white rounded-xl border-2 border-border hover:border-primary transition-all active:scale-95">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-center text-foreground leading-tight">
                    {category.name}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Featured Offers */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            <span className="text-ancora-red">Ofertas</span> em destaque
          </h2>
          <Link href="/offers" className="text-sm font-semibold text-primary hover:underline whitespace-nowrap">
            Ver todas
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} featured />
            ))}
          </div>
        )}
      </div>

      {/* Recent Products */}
      <div className="p-4 bg-muted/30">
        <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">Produtos recentes</h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {recentProducts.map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}

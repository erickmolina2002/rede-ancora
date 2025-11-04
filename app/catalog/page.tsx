"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Search, SlidersHorizontal, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { BottomNav } from "@/components/bottom-nav"
import Link from "next/link"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { MOCK_PRODUCTS } from "@/lib/mockProducts"

function CatalogContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")

  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryParam ? [categoryParam] : [])
  const [inStockOnly, setInStockOnly] = useState(false)

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategories.length === 0 || !product.category || selectedCategories.includes(product.category)
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    const matchesStock = !inStockOnly || product.inStock
    return matchesSearch && matchesCategory && matchesPrice && matchesStock
  })

  return (
    <div className="min-h-screen bg-background pb-20 max-w-screen-lg mx-auto">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-40">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/home">
              <Button variant="ghost" size="icon" className="rounded-full -ml-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg sm:text-xl font-bold text-foreground">Catálogo</h1>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 text-base"
              />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-11 w-11 flex-shrink-0 bg-transparent">
                  <SlidersHorizontal className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                  <SheetDescription>Refine sua busca por produtos</SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Categorias</Label>
                    <div className="space-y-3">
                      {["injecao", "motores", "abrantes", "combustivel"].map((cat) => (
                        <div key={cat} className="flex items-center space-x-2">
                          <Checkbox
                            id={cat}
                            checked={selectedCategories.includes(cat)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedCategories([...selectedCategories, cat])
                              } else {
                                setSelectedCategories(selectedCategories.filter((c) => c !== cat))
                              }
                            }}
                          />
                          <label
                            htmlFor={cat}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize cursor-pointer"
                          >
                            {cat}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-3 block">
                      Faixa de Preço: R$ {priceRange[0]} - R$ {priceRange[1]}
                    </Label>
                    <Slider
                      min={0}
                      max={1000}
                      step={10}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="mt-2"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="stock"
                      checked={inStockOnly}
                      onCheckedChange={(checked) => setInStockOnly(!!checked)}
                    />
                    <label
                      htmlFor="stock"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Apenas em estoque
                    </label>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4">
        <p className="text-xs sm:text-sm text-muted-foreground mb-4">
          {filteredProducts.length} {filteredProducts.length === 1 ? "produto encontrado" : "produtos encontrados"}
        </p>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} compact />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <CatalogContent />
    </Suspense>
  )
}

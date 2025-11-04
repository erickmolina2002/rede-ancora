import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"

interface Product {
  id: number
  name: string
  image: string
  price: number
  originalPrice?: number
  discount?: number
  inStock?: boolean
}

interface ProductCardProps {
  product: Product
  featured?: boolean
  compact?: boolean
}

export function ProductCard({ product, featured = false, compact = false }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const productImage = product.image
  const productPrice = product.price
  const productInStock = product.inStock !== false
  const productDiscount = product.discount
  const productOriginalPrice = product.originalPrice

  if (compact) {
    return (
      <Link href={`/product/${product.id}`}>
        <div className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all active:scale-95">
          <div className="aspect-square bg-muted relative overflow-hidden">
            <Image
              src={productImage || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              unoptimized
              quality={100}
            />
          </div>
          <div className="p-3 space-y-2">
            <h3 className="text-xs sm:text-sm font-medium text-foreground line-clamp-2 leading-tight min-h-[2.5rem]">
              {product.name}
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base sm:text-lg font-bold text-primary">{formatPrice(productPrice)}</p>
              </div>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-primary hover:bg-primary/10 flex-shrink-0">
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  if (featured) {
    return (
      <Link href={`/product/${product.id}`}>
        <div className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all active:scale-[0.98]">
          <div className="flex gap-3 sm:gap-4 p-3 sm:p-4">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-muted rounded-xl overflow-hidden">
              <Image
                src={productImage || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized
                quality={100}
              />
              {productDiscount && (
                <Badge className="absolute top-2 left-2 bg-ancora-red text-white border-0 font-bold text-xs">
                  -{productDiscount}%
                </Badge>
              )}
            </div>
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-foreground line-clamp-3 leading-tight mb-2">
                  {product.name}
                </h3>
                {productInStock && (
                  <Badge
                    variant="outline"
                    className="text-[10px] sm:text-xs border-green-500 text-green-600 bg-green-50"
                  >
                    Em estoque
                  </Badge>
                )}
              </div>
              <div className="space-y-1">
                {productOriginalPrice && (
                  <p className="text-[10px] sm:text-xs text-muted-foreground line-through">
                    {formatPrice(productOriginalPrice)}
                  </p>
                )}
                <div className="flex items-center justify-between gap-2">
                  <p className="text-base sm:text-xl font-bold text-primary">{formatPrice(productPrice)}</p>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm flex-shrink-0"
                  >
                    <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">Adicionar</span>
                    <span className="sm:hidden">+</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return null
}

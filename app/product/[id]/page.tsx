"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, ShoppingCart, Heart, Share2, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getProductById } from "@/lib/mockProducts"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = Number(params.id)
  const [product, setProduct] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const foundProduct = getProductById(productId)
    if (foundProduct) {
      setProduct({
        id: foundProduct.id,
        nomeProduto: foundProduct.name,
        marca: foundProduct.marca || "Original",
        imagemReal: foundProduct.image,
        imagemIlustrativa: null,
        preco: foundProduct.price,
        estoque: foundProduct.estoque || 10,
        codigoReferencia: foundProduct.codigoReferencia || "N/A",
        dimensoes: foundProduct.dimensoes || "N/A",
        informacoesComplementares: foundProduct.informacoesComplementares || "Produto de alta qualidade.",
      })
    } else {
      // Produto não encontrado, redirecionar para home
      router.push('/home')
    }
  }, [productId, router])

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const handleAddToCart = () => {
    router.push("/cart")
  }

  const productImage = product.imagemReal || product.imagemIlustrativa || "/placeholder.svg?height=400&width=400"
  const inStock = product.estoque > 0

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-40">
        <div className="p-4 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsFavorite(!isFavorite)}>
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-ancora-red text-ancora-red" : ""}`} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Product Image */}
      <div className="bg-white p-4 sm:p-6">
        <div className="relative aspect-square max-w-md mx-auto bg-muted rounded-2xl overflow-hidden">
          <Image
            src={productImage || "/placeholder.svg"}
            alt={product.nomeProduto}
            fill
            className="object-cover"
            unoptimized
            quality={100}
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="bg-white mt-2 p-4 sm:p-6 space-y-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-tight mb-2">{product.nomeProduto}</h1>
          <p className="text-sm text-muted-foreground mb-2">{product.marca}</p>
          {inStock ? (
            <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50">
              Em estoque ({product.estoque} unidades)
            </Badge>
          ) : (
            <Badge variant="outline" className="border-red-500 text-red-600 bg-red-50">
              Fora de estoque
            </Badge>
          )}
        </div>

        <Separator />

        <div className="space-y-2">
          <p className="text-3xl sm:text-4xl font-bold text-primary">{formatPrice(product.preco)}</p>
          <p className="text-sm text-muted-foreground">ou 3x de {formatPrice(product.preco / 3)} sem juros</p>
        </div>

        <Separator />

        {/* Quantity Selector */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Quantidade:</span>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full bg-transparent"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full bg-transparent"
              onClick={() => setQuantity(Math.min(product.estoque, quantity + 1))}
              disabled={quantity >= product.estoque}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="bg-white mt-2 p-4 sm:p-6">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="description">Descrição</TabsTrigger>
            <TabsTrigger value="specs">Especificações</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-4">
            <p className="text-sm sm:text-base text-foreground leading-relaxed">
              {product.informacoesComplementares || "Produto de alta qualidade para seu veículo."}
            </p>
          </TabsContent>
          <TabsContent value="specs" className="mt-4">
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Marca</span>
                <span className="text-sm font-medium text-foreground">{product.marca}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Código</span>
                <span className="text-sm font-medium text-foreground">{product.codigoReferencia}</span>
              </div>
              {product.dimensoes && (
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Dimensões</span>
                  <span className="text-sm font-medium text-foreground">{product.dimensoes}</span>
                </div>
              )}
              <div className="flex justify-between py-2">
                <span className="text-sm text-muted-foreground">Garantia</span>
                <span className="text-sm font-medium text-foreground">3 meses</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 z-40">
        <Button
          size="lg"
          className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90"
          onClick={handleAddToCart}
          disabled={!inStock}
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Adicionar ao Carrinho
        </Button>
      </div>
    </div>
  )
}

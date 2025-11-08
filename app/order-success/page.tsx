"use client"

import { useRouter } from "next/navigation"
import { Package, MapPin, CreditCard, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

export default function OrderSuccessPage() {
  const router = useRouter()
  const orderNumber = "ANC" + Math.random().toString(36).substring(2, 9).toUpperCase()

  return (
    <div className="h-screen bg-ancora-dark flex flex-col overflow-hidden">
      <div className="flex justify-end p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/home")}
          className="rounded-full hover:bg-white/10 text-white"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="mb-8 animate-scale-in">
          <Image
            src="/images/rede.png"
            alt="Ancora Express"
            width={200}
            height={120}
            className="w-48 h-auto"
            priority
          />
        </div>

        <h1 className="text-3xl font-bold text-white mb-4 animate-slide-up">
          Compra realizada
          <br />
          com sucesso!
        </h1>

        <p className="text-white/80 text-base max-w-sm animate-slide-up">
          Para visualizar suas compras entre na aba Histórico de Compras.
        </p>

        {/* Order Details Section */}
        <div className="w-full max-w-md bg-white rounded-2xl border border-border p-6 space-y-4 animate-slide-up mt-8">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Número do pedido</span>
            <span className="text-sm font-bold text-foreground">{orderNumber}</span>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Preparando pedido</p>
                <p className="text-xs text-muted-foreground">Seu pedido está sendo preparado para envio</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Entrega prevista</p>
                <p className="text-xs text-muted-foreground">3-5 dias úteis</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Pagamento confirmado</p>
                <p className="text-xs text-muted-foreground">Cartão de crédito</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-6 space-y-3">
        <Button
          size="lg"
          className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90"
          onClick={() => router.push("/account/orders")}
        >
          Acompanhar Pedido
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="w-full h-14 text-lg font-semibold bg-transparent"
          onClick={() => router.push("/home")}
        >
          Voltar para Home
        </Button>
      </div>
    </div>
  )
}

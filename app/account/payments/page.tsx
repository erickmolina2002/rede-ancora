"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, Plus, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BottomNav } from "@/components/bottom-nav"

interface PaymentMethod {
  id: number
  type: "credit" | "debit"
  brand: string
  lastDigits: string
  expiryDate: string
  isDefault: boolean
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 1,
    type: "credit",
    brand: "Visa",
    lastDigits: "4532",
    expiryDate: "12/25",
    isDefault: true,
  },
  {
    id: 2,
    type: "credit",
    brand: "Mastercard",
    lastDigits: "8765",
    expiryDate: "08/26",
    isDefault: false,
  },
]

export default function PaymentsPage() {
  const router = useRouter()
  const [paymentMethods] = useState(mockPaymentMethods)

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-40">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-foreground ml-3">Formas de Pagamento</h1>
          </div>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1" />
            Novo
          </Button>
        </div>
      </div>

      {/* Payment Methods List */}
      <div className="p-4 space-y-3">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className="bg-gradient-to-br from-primary to-ancora-dark rounded-xl p-4 text-white hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">{method.brand}</p>
                  <p className="text-lg font-bold">•••• {method.lastDigits}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/60 mb-1">Validade</p>
                <p className="text-sm font-medium">{method.expiryDate}</p>
              </div>
              <div>
                <p className="text-xs text-white/60 mb-1">Tipo</p>
                <p className="text-sm font-medium capitalize">{method.type === "credit" ? "Crédito" : "Débito"}</p>
              </div>
              {method.isDefault && <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">Padrão</Badge>}
            </div>
          </div>
        ))}
      </div>

      {/* PIX Section */}
      <div className="px-4 mt-6">
        <div className="bg-white rounded-xl border border-border p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📱</span>
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">Pagar com PIX</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Pagamento instantâneo e seguro direto na finalização da compra
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

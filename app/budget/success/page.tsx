"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function BudgetSuccessPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-ancora-dark flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-12 animate-scale-in">
        <Image src="/images/ancora-logo-new.png" alt="Ancora" width={200} height={80} className="h-20 w-auto" />
      </div>

      <div className="space-y-4 animate-slide-up">
        <h1 className="text-3xl font-bold text-white">Orçamento finalizado com sucesso!</h1>
        <p className="text-white/80 text-sm">Para visualizar o orçamento entre na aba Histórico de Orçamentos</p>
      </div>

      <div className="mt-12 w-full max-w-sm space-y-3">
        <Button
          size="lg"
          className="w-full h-12 text-base font-semibold bg-white text-ancora-dark hover:bg-white/90"
          onClick={() => router.push("/account/budgets")}
        >
          Ver Histórico
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="w-full h-12 text-base font-semibold bg-transparent text-white border-white hover:bg-white/10"
          onClick={() => router.push("/home")}
        >
          Voltar para Home
        </Button>
      </div>
    </div>
  )
}

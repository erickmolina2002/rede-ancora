import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function WelcomePage() {
  return (
    <div className="h-screen bg-gradient-to-br from-primary via-ancora-dark to-primary flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-ancora-red/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-slide-up flex flex-col justify-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="flex justify-center mb-6 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-xl">
            <Image
              src="/images/rede.jpeg"
              alt="Ancora Express"
              width={140}
              height={70}
              className="w-auto mx-auto flex justify-center"
              priority
            />
          </div>
        </div>

        {/* Welcome content */}
        <div className="text-center mb-6 space-y-2">
          <h1 className="text-2xl font-bold text-white text-balance leading-tight">
            Bem-vindo ao
            <br />
            <span className="text-ancora-red bg-white/10 px-3 py-1.5 rounded-lg inline-block mt-1.5">
              Ancora Express
            </span>
          </h1>
          <p className="text-white/90 text-sm leading-relaxed px-4">Seu marketplace completo de peças automotivas</p>
        </div>

        {/* Action buttons */}
        <div className="space-y-3 animate-fade-in mb-6">
          <Link href="/register" className="block">
            <Button
              size="lg"
              className="w-full h-12 text-base font-semibold bg-ancora-red hover:bg-ancora-red/90 text-white shadow-lg shadow-ancora-red/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Criar Conta
            </Button>
          </Link>

          <Link href="/login" className="block">
            <Button
              size="lg"
              variant="outline"
              className="w-full h-12 text-base font-semibold bg-white/95 hover:bg-white text-primary border-2 border-white/50 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Já tenho conta
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3 text-center">
  {[
    { icon: '🔧', label: 'Catálogo Completo' },
    { icon: '⚡', label: 'Entrega Rápida' },
    { icon: '💰', label: 'Orçamentos', href: '/budget' }
  ].map((item, i) =>
    item.href ? (
      <Link key={i} href={item.href}>
        <div className="flex flex-col justify-center items-center h-24 bg-white/10 backdrop-blur-sm rounded-xl p-3 hover:bg-white/20 transition-all cursor-pointer active:scale-95">
          <div className="text-2xl mb-1">{item.icon}</div>
          <p className="text-white/90 text-xs font-medium">{item.label}</p>
        </div>
      </Link>
    ) : (
      <div key={i} className="flex flex-col justify-center items-center h-24 bg-white/10 backdrop-blur-sm rounded-xl p-3">
        <div className="text-2xl mb-1">{item.icon}</div>
        <p className="text-white/90 text-xs font-medium">{item.label}</p>
      </div>
    )
  )}
</div>

      </div>
    </div>
  )
}

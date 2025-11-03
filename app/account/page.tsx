"use client"

import { useRouter } from "next/navigation"
import {
  User,
  Package,
  FileText,
  Heart,
  MapPin,
  CreditCard,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { BottomNav } from "@/components/bottom-nav"
import Link from "next/link"

export default function AccountPage() {
  const router = useRouter()

  const menuItems = [
    {
      icon: Package,
      label: "Meus Pedidos",
      description: "Acompanhe seus pedidos",
      href: "/account/orders",
      badge: "3",
    },
    {
      icon: FileText,
      label: "Meus Orçamentos",
      description: "Gerencie seus orçamentos",
      href: "/account/budgets",
      badge: null,
    },
    {
      icon: Heart,
      label: "Favoritos",
      description: "Produtos salvos",
      href: "/account/favorites",
      badge: null,
    },
    {
      icon: MapPin,
      label: "Endereços",
      description: "Gerencie seus endereços",
      href: "/account/addresses",
      badge: null,
    },
    {
      icon: CreditCard,
      label: "Pagamentos",
      description: "Cartões e formas de pagamento",
      href: "/account/payments",
      badge: null,
    },
  ]

  const settingsItems = [
    {
      icon: Bell,
      label: "Notificações",
      href: "/account/notifications",
    },
    {
      icon: Settings,
      label: "Configurações",
      href: "/account/settings",
    },
    {
      icon: HelpCircle,
      label: "Ajuda e Suporte",
      href: "/account/help",
    },
  ]

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-ancora-dark to-primary text-white p-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Minha Conta</h1>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <User className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">João Silva</h2>
            <p className="text-white/80 text-sm">joao.silva@email.com</p>
            <p className="text-white/80 text-sm">(11) 98765-4321</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 -mt-4 mb-4">
        <div className="bg-white rounded-2xl border border-border p-4 shadow-lg">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">12</p>
              <p className="text-xs text-muted-foreground">Pedidos</p>
            </div>
            <div className="text-center border-x border-border">
              <p className="text-2xl font-bold text-primary">8</p>
              <p className="text-xs text-muted-foreground">Orçamentos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">15</p>
              <p className="text-xs text-muted-foreground">Favoritos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <div className="bg-white rounded-xl border border-border p-4 hover:shadow-md transition-all active:scale-[0.98]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-foreground">{item.label}</h3>
                      {item.badge && (
                        <span className="bg-ancora-red text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <Separator className="my-6" />

      {/* Settings Items */}
      <div className="px-4 space-y-2">
        {settingsItems.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <div className="bg-white rounded-xl border border-border p-4 hover:shadow-md transition-all active:scale-[0.98]">
                <div className="flex items-center gap-4">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-base font-medium text-foreground flex-1">{item.label}</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Logout Button */}
      <div className="px-4 mt-6">
        <Button
          variant="outline"
          size="lg"
          className="w-full h-14 text-destructive border-destructive hover:bg-destructive/10 bg-transparent"
          onClick={() => router.push("/welcome")}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Sair da Conta
        </Button>
      </div>

      <BottomNav />
    </div>
  )
}

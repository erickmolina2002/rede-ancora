"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Grid3x3, Tag, ShoppingCart, User } from "lucide-react"

const navItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/catalog", label: "Catálogo", icon: Grid3x3 },
  { href: "/budget", label: "Orçamentos", icon: Tag },
  { href: "/cart", label: "Carrinho", icon: ShoppingCart },
  { href: "/account", label: "Conta", icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-screen-xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "fill-primary" : ""}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

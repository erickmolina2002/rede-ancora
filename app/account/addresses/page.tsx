"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, MoreVertical, HomeIcon, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BottomNav } from "@/components/bottom-nav"

interface Address {
  id: number
  label: string
  type: "home" | "work"
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
  cep: string
  isDefault: boolean
}

const mockAddresses: Address[] = [
  {
    id: 1,
    label: "Casa",
    type: "home",
    street: "Rua das Flores",
    number: "123",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
    cep: "01234-567",
    isDefault: true,
  },
  {
    id: 2,
    label: "Trabalho",
    type: "work",
    street: "Av. Paulista",
    number: "1000",
    neighborhood: "Bela Vista",
    city: "São Paulo",
    state: "SP",
    cep: "01310-100",
    isDefault: false,
  },
]

export default function AddressesPage() {
  const router = useRouter()
  const [addresses] = useState(mockAddresses)

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-40">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-foreground ml-3">Endereços</h1>
          </div>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1" />
            Novo
          </Button>
        </div>
      </div>

      {/* Addresses List */}
      <div className="p-4 space-y-3">
        {addresses.map((address) => {
          const Icon = address.type === "home" ? HomeIcon : Briefcase
          return (
            <div
              key={address.id}
              className="bg-white rounded-xl border border-border p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-foreground">{address.label}</h3>
                      {address.isDefault && (
                        <Badge variant="secondary" className="text-xs">
                          Padrão
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  {address.street}, {address.number}
                </p>
                <p>
                  {address.neighborhood} - {address.city}/{address.state}
                </p>
                <p className="font-mono">CEP: {address.cep}</p>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Editar
                </Button>
                {!address.isDefault && (
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    Definir como Padrão
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <BottomNav />
    </div>
  )
}

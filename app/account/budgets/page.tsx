"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, FileText, Calendar, DollarSign, User, Share2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BottomNav } from "@/components/bottom-nav"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Budget {
  id: string
  clientName: string
  vehicle: string
  date: string
  total: number
  status: "pending" | "approved" | "rejected"
  itemsCount: number
}

const mockBudgets: Budget[] = [
  {
    id: "ORC7X9K2M",
    clientName: "João Silva",
    vehicle: "Fiat Uno 2015",
    date: "2024-01-15",
    total: 848.38,
    status: "approved",
    itemsCount: 3,
  },
  {
    id: "ORC5P3N8L",
    clientName: "Maria Santos",
    vehicle: "VW Gol 2018",
    date: "2024-01-14",
    total: 1245.5,
    status: "pending",
    itemsCount: 5,
  },
  {
    id: "ORC2W6H4K",
    clientName: "Pedro Costa",
    vehicle: "Ford Fiesta 2016",
    date: "2024-01-13",
    total: 567.9,
    status: "rejected",
    itemsCount: 2,
  },
]

export default function BudgetsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date)
  }

  const getStatusBadge = (status: Budget["status"]) => {
    const statusConfig = {
      pending: { label: "Pendente", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
      approved: { label: "Aprovado", className: "bg-green-100 text-green-700 border-green-200" },
      rejected: { label: "Recusado", className: "bg-red-100 text-red-700 border-red-200" },
    }
    const config = statusConfig[status]
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const filteredBudgets = mockBudgets.filter((budget) => {
    if (activeTab === "all") return true
    return budget.status === activeTab
  })

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-40">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-foreground ml-3">Meus Orçamentos</h1>
          </div>
          <Button size="sm" onClick={() => router.push("/budget")} className="bg-primary hover:bg-primary/90">
            Novo
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-border">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-4 h-12 bg-transparent">
            <TabsTrigger
              value="all"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Todos
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Pendentes
            </TabsTrigger>
            <TabsTrigger
              value="approved"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Aprovados
            </TabsTrigger>
            <TabsTrigger
              value="rejected"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Recusados
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Budgets List */}
      <div className="p-4 space-y-3">
        {filteredBudgets.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Nenhum orçamento encontrado</p>
          </div>
        ) : (
          filteredBudgets.map((budget) => (
            <div
              key={budget.id}
              className="bg-white rounded-xl border border-border p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-muted-foreground">#{budget.id}</span>
                    {getStatusBadge(budget.status)}
                  </div>
                  <h3 className="text-base font-bold text-foreground">{budget.clientName}</h3>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{budget.vehicle}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(budget.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>
                    {budget.itemsCount} {budget.itemsCount === 1 ? "item" : "itens"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <span className="text-lg font-bold text-primary">{formatPrice(budget.total)}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  )
}

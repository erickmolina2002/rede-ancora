"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Package, MapPin, Clock, CheckCircle2, XCircle, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BottomNav } from "@/components/bottom-nav"

interface Order {
  id: string
  date: string
  status: "processing" | "shipped" | "delivered" | "cancelled"
  total: number
  itemsCount: number
  trackingCode?: string
}

const mockOrders: Order[] = [
  {
    id: "ANC7X9K2M",
    date: "2024-01-15",
    status: "delivered",
    total: 848.38,
    itemsCount: 3,
    trackingCode: "BR123456789",
  },
  {
    id: "ANC5P3N8L",
    date: "2024-01-14",
    status: "shipped",
    total: 1245.5,
    itemsCount: 5,
    trackingCode: "BR987654321",
  },
  {
    id: "ANC2W6H4K",
    date: "2024-01-13",
    status: "processing",
    total: 567.9,
    itemsCount: 2,
  },
  {
    id: "ANC8M4L9P",
    date: "2024-01-10",
    status: "cancelled",
    total: 234.5,
    itemsCount: 1,
  },
]

export default function OrdersPage() {
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

  const getStatusConfig = (status: Order["status"]) => {
    const configs = {
      processing: {
        label: "Processando",
        icon: Clock,
        className: "bg-yellow-100 text-yellow-700 border-yellow-200",
      },
      shipped: {
        label: "Em Trânsito",
        icon: Truck,
        className: "bg-blue-100 text-blue-700 border-blue-200",
      },
      delivered: {
        label: "Entregue",
        icon: CheckCircle2,
        className: "bg-green-100 text-green-700 border-green-200",
      },
      cancelled: {
        label: "Cancelado",
        icon: XCircle,
        className: "bg-red-100 text-red-700 border-red-200",
      },
    }
    return configs[status]
  }

  const filteredOrders = mockOrders.filter((order) => {
    if (activeTab === "all") return true
    return order.status === activeTab
  })

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-40">
        <div className="p-4 flex items-center">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground ml-3">Meus Pedidos</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-border">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-5 h-12 bg-transparent">
            <TabsTrigger
              value="all"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-xs"
            >
              Todos
            </TabsTrigger>
            <TabsTrigger
              value="processing"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-xs"
            >
              Processando
            </TabsTrigger>
            <TabsTrigger
              value="shipped"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-xs"
            >
              Enviados
            </TabsTrigger>
            <TabsTrigger
              value="delivered"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-xs"
            >
              Entregues
            </TabsTrigger>
            <TabsTrigger
              value="cancelled"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-xs"
            >
              Cancelados
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Orders List */}
      <div className="p-4 space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Nenhum pedido encontrado</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const statusConfig = getStatusConfig(order.status)
            const StatusIcon = statusConfig.icon

            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-border p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-muted-foreground">#{order.id}</span>
                    </div>
                    <Badge variant="outline" className={statusConfig.className}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusConfig.label}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{formatDate(order.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span>
                      {order.itemsCount} {order.itemsCount === 1 ? "item" : "itens"}
                    </span>
                  </div>
                  {order.trackingCode && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="font-mono">{order.trackingCode}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total</p>
                    <p className="text-lg font-bold text-primary">{formatPrice(order.total)}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            )
          })
        )}
      </div>

      <BottomNav />
    </div>
  )
}

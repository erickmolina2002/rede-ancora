"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, User, Lock, Bell, Globe, Moon, Shield, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { BottomNav } from "@/components/bottom-nav"

export default function SettingsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-40">
        <div className="p-4 flex items-center">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground ml-3">Configurações</h1>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="p-4 space-y-4">
        {/* Account Settings */}
        <div className="bg-white rounded-xl border border-border p-4">
          <h3 className="text-sm font-bold text-foreground mb-4">Conta</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Editar Perfil</span>
              </div>
              <Button variant="ghost" size="sm">
                Editar
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Alterar Senha</span>
              </div>
              <Button variant="ghost" size="sm">
                Alterar
              </Button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-border p-4">
          <h3 className="text-sm font-bold text-foreground mb-4">Notificações</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Notificações Push</p>
                  <p className="text-xs text-muted-foreground">Receba atualizações de pedidos</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 flex items-center justify-center text-muted-foreground">📧</span>
                <div>
                  <p className="text-sm font-medium text-foreground">E-mail</p>
                  <p className="text-xs text-muted-foreground">Ofertas e novidades</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-xl border border-border p-4">
          <h3 className="text-sm font-bold text-foreground mb-4">Preferências</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Modo Escuro</p>
                  <p className="text-xs text-muted-foreground">Tema escuro para o app</p>
                </div>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Idioma</span>
              </div>
              <Button variant="ghost" size="sm">
                Português
              </Button>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-xl border border-border p-4">
          <h3 className="text-sm font-bold text-foreground mb-4">Sobre</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Política de Privacidade</span>
              </div>
              <Button variant="ghost" size="sm">
                Ver
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Termos de Uso</span>
              </div>
              <Button variant="ghost" size="sm">
                Ver
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Versão do App</span>
              <span className="text-sm font-medium text-foreground">1.0.0</span>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

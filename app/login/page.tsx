"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    document: "",
    password: "",
  })

  const formatDocument = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    }
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
  }

  const handleLogin = () => {
    router.push("/home")
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <div className="flex justify-end p-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-gray-100">
          <X className="h-5 w-5 text-gray-600" />
        </Button>
      </div>

      <div className="flex justify-center pt-2 pb-6">
        <Image
          src="/images/ancora-logo-new.png"
          alt="Rede Ancora"
          width={140}
          height={80}
          className="w-auto h-12"
          priority
        />
      </div>

      <div className="px-6 pb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Bem-vindo</h1>
        <p className="text-sm text-muted-foreground">Acesse sua conta</p>
      </div>

      <div className="flex-1 px-6 space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="document" className="text-xs font-semibold text-foreground uppercase tracking-wide">
            CPF/CNPJ
          </label>
          <Input
            id="document"
            type="text"
            placeholder="000.000.000-00"
            value={formData.document}
            onChange={(e) => setFormData({ ...formData, document: formatDocument(e.target.value) })}
            className="h-12 text-base border-gray-200 focus:border-primary rounded-lg"
            maxLength={18}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-xs font-semibold text-foreground uppercase tracking-wide">
              Senha
            </label>
            <Link href="/forgot-password" className="text-xs font-semibold text-ancora-red hover:text-ancora-red/80">
              Esqueci
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Digite sua senha"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="h-12 text-base border-gray-200 focus:border-primary rounded-lg pr-12"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6 pb-8 space-y-3">
        <Button
          size="lg"
          onClick={handleLogin}
          className="w-full h-12 text-base font-bold bg-gradient-to-r from-ancora-dark to-primary hover:from-primary hover:to-ancora-dark text-white rounded-lg shadow-md"
        >
          Entrar
        </Button>

        <div className="text-center">
          <span className="text-xs text-muted-foreground">Não tem conta? </span>
          <Link href="/register" className="text-xs text-ancora-red font-bold hover:underline">
            Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  )
}

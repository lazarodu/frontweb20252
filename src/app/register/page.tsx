'use client'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { register } = useAuth()
  const router = useRouter()

  const handleRegister = async () => {
    if (!name || !email || !password) {
      toast.error("Todos os campos são obrigatórios.")
      return
    }
    try {
      const success = await register(name, email, password)
      if (success) {
        toast.success("Cadastro Realizado!")
        router.push("/login")
      } else {
        toast.error("Este email já está em uso.")
      }
    } catch (error) {
      toast.error(String(error))
    }
  }

  return (
    <main className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Criar Conta</CardTitle>
          <CardDescription>Crie sua conta para começar a colecionar.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/login")}>Já tenho conta</Button>
          <Button onClick={handleRegister}>Criar</Button>
        </CardFooter>
      </Card>
    </main>
  )
}

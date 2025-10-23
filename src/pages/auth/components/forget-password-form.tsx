import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { requestPasswordReset } from "@/services/auth/authService"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
      const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
     
    await requestPasswordReset({email})
       navigate("/otp-verification")
    
    } catch (error) {
      console.error(error)
     
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <Link
              to="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                 <img
            src="/logo.png"
            alt="DExpress"
            className="h-auto w-50 max-w-xs"
          />
              </div>
              <span className="sr-only">Braleza</span>
            </Link>
<br />
<br />
       
            <FieldDescription>
              Insira o seu e-mail para redefinir sua senha.
            </FieldDescription>
          </div>

          <Field>
            <FieldLabel htmlFor="email">E-mail</FieldLabel>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@email.com"
              required
            />
          </Field>

          <Field>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Enviando..." : "Enviar"}
            </Button>
          </Field>

          {message && (
            <p
              className={cn(
                "mt-2 text-center text-sm",
                message.includes("erro") || message.includes("Erro")
                  ? "text-red-500"
                  : "text-green-600"
              )}
            >
              {message}
            </p>
          )}

          <div className="mt-4 text-center text-sm">
            <Link
              to="/login"
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              Voltar para o login
            </Link>
          </div>
        </FieldGroup>
      </form>

      <FieldDescription className="px-6 text-center">
        Ao continuar, você concorda com nossos{" "}
        <a href="#" className="underline underline-offset-4">
          Termos de Serviço
        </a>{" "}
        e{" "}
        <a href="#" className="underline underline-offset-4">
          Política de Privacidade
        </a>.
      </FieldDescription>
    </div>
  )
}

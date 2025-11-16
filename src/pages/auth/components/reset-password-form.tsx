import { useState } from "react"

import { Link, useNavigate, useParams } from "react-router-dom"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import { resetPassword } from "@/services/auth/authService"
export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()
    const { token } = useParams();
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (newPassword.length < 6) {
       toast.dismiss();
       toast.error("A senha deve ter pelo menos 6 caracteres.");
      setLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
     toast.dismiss();
       toast.error("As senhas não coincidem");
      setLoading(false)
      return
    }
    try {
      if (!token) return toast.error("Token não fornecido");
   await resetPassword({ token, newPassword })
  navigate("/login")
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

            <FieldDescription>
              Insira sua nova senha e confirme para concluir a redefinição.
            </FieldDescription>
          </div>

          <Field>
            <FieldLabel htmlFor="newPassword">Nova senha</FieldLabel>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Digite sua nova senha"
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirmar senha</FieldLabel>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua nova senha"
              required
            />
          </Field>

          <Field>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Salvando..." : "Redefinir senha"}
            </Button>
          </Field>

          {message && (
            <p
              className={cn(
                "mt-2 text-center text-sm",
                message.includes("erro") || message.includes("Erro")
                  ? "text-red-500"
                  : message.includes("sucesso")
                  ? "text-green-600"
                  : "text-yellow-500"
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

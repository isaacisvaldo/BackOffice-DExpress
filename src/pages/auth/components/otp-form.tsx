import { useState } from "react"
import { GalleryVerticalEnd } from "lucide-react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Link, useNavigate } from "react-router-dom"
import { verifyResetCode } from "@/services/auth/authService"

export function OTPForm({ className, ...props }: React.ComponentProps<"div">) {
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
      const navigate = useNavigate()
  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault()
    if (otp.length < 6) {
      toast.dismiss();
      toast.error("Por favor, insira o código completo de 6 dígitos.");
    
      return
    }
    setLoading(true)

    try {
    
  const result = await verifyResetCode({token:otp})
if (result.valid) navigate("/new-password")
    navigate(`/reset-password/${otp}`)


    } catch (err) {
      console.error(err)
  
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleVerifyOTP}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Braleza</span>
            </a>

            <h1 className="text-xl font-bold">Introduza o código de verificação</h1>
            <FieldDescription>
              Enviámos um código de 6 dígitos para o seu endereço de e-mail.
            </FieldDescription>
          </div>

          <Field>
            <FieldLabel htmlFor="otp" className="sr-only">
              Código de verificação
            </FieldLabel>

            <InputOTP
              maxLength={6}
              id="otp"
              required
              value={otp}
              onChange={(val) => setOtp(val)}
              containerClassName="gap-4"
            >
              <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <FieldDescription className="text-center">
              Não recebeu o código?{" "}
              <a href="#" className="underline underline-offset-4">
                Reenviar
              </a>
            </FieldDescription>
          </Field>

          <Field>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Verificando..." : "Verificar"}
            </Button>
          </Field>
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
        Ao continuar, você concorda com os nossos{" "}
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

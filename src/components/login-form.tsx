import { useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/AuthContext"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const { login } = useAuth() 

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  toast.dismiss();

  try {
    toast.loading("Entrando...");
     await login(email, password);
    toast.dismiss();
    toast.success("Login realizado com sucesso!");
    setTimeout(() => navigate("/dashboard"), 1000);
  } catch (err: any) {
    toast.dismiss();
    toast.error(err.message || "Erro ao autenticar");
  } finally {
    setLoading(false);
  }
};
  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      {/* Título e descrição */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Entre na sua conta</h1>
        <p className="text-muted-foreground text-sm">
          Insira seu e-mail e senha para acessar o painel administrativo.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Campo de email */}
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* Campo de senha */}
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Senha</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Esqueci minha senha
            </a>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* Botão de login */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>

        {/* Separador 
        <div className="relative text-center text-sm after:border-border after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Ou continue com
          </span>
        </div>
*/}
        {/* Login com GitHub 
        <Button variant="outline" className="w-full" type="button" disabled={loading}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-2">
            <path
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385..."
              fill="currentColor"
            />
          </svg>
          Login com GitHub
        </Button>
        */}
      </div>

      {/* Link para cadastro */}
      <div className="text-center text-sm">
        Não tem uma conta?{" "}
        <a href="#" className="underline underline-offset-4">
          Cadastre-se
        </a>
      </div>
    </form>
  )
}

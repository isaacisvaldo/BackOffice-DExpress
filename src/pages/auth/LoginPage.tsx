import { LoginForm } from "@/pages/auth/components/login-form"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function LoginPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      navigate("/dashboard") 
    }
  }, [navigate])
  
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col items-center justify-center gap-8 p-6 md:p-10">
        <a href="#" className="flex items-center gap-2 font-medium">
          <img
            src="/logo.png"
            alt="DExpress"
            className="h-auto w-80 max-w-xs"
          />
        </a>
        <div className="w-full max-w-xs">
          <LoginForm />
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/login.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}

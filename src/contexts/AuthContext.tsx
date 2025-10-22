import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { isAuthenticated, login as loginAPI, logout as logoutAPI } from "@/services/auth/authService";
import { useLocation, useNavigate } from "react-router-dom";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  permissions?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfileImage: (newImageUrl: string) => void;
  isLoading: boolean;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // setar para true faz com que quando estiver  na tela de login vai chamar a dasboar e depois lhe banir efeito nao muito amigavel
  const location = useLocation();
  const navigate = useNavigate();

const checkAuth = useCallback(async () => {
  console.log("Verificando autenticação para", location.pathname);
  setIsLoading(true);
  try {
    const res = await isAuthenticated();
    console.log("isAuthenticated response:", res);
    if (res?.valid && res?.user) {
      setUser(res.user);
      setIsLoggedIn(true);
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }
  } catch (error) {
    console.error("Erro na verificação de autenticação:", error);
    setUser(null);
    setIsLoggedIn(false);
  } finally {
    setIsLoading(false);
  }
}, []);
useEffect(() => {
    const publicPaths = ["/login", "/", "/forget-password", "/otp-verification", "/reset-password/:token"];
    const isPublicPath = publicPaths.some(
      (path) => location.pathname === path || (path.includes(":token") && location.pathname.startsWith("/reset-password"))
    );

    if (isPublicPath) {
   
      console.log("Rota pública detectada, mantendo isLoggedIn =", isLoggedIn,user);
      setIsLoading(false);
    } else {
      // Para rotas não públicas, verifica a sessão
      checkAuth();
    }
  }, [location.pathname, checkAuth]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await loginAPI({ email, password });
    if (data?.user) {
      setUser(data.user);
      setIsLoggedIn(true);
      navigate("/dashboard");
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    await logoutAPI();
    setUser(null);
    setIsLoggedIn(false);
    navigate("/login");
  }, [navigate]);

  const updateProfileImage = useCallback((newImageUrl: string) => {
    setUser((prev) => (prev ? { ...prev, avatar: newImageUrl } : prev));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateProfileImage,
        isLoading,
        isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
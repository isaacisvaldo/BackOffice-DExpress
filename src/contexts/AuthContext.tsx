import { createContext, useContext, useEffect, useState } from "react";
import { isAuthenticated, login as loginAPI, logout as logoutAPI } from "@/services/auth/authService";
import { useLocation } from "react-router-dom"; // Importa useLocation

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setisLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Obtém o caminho da URL atual
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await isAuthenticated();
        if (res && res.user) {
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
        setisLoading(false);
      }
    }
    
    // Condição para não executar a verificação nas rotas de login
    if (pathname === '/login' || pathname === '/') {
        setisLoading(false);
        setUser(null);
        setIsLoggedIn(false);
    } else {
        checkAuth();
    }
  }, [pathname]); // Adiciona pathname como dependência para re-executar quando a rota muda

  async function login(email: string, password: string) {
    const data = await loginAPI(email, password);
    setUser(data.user);
    setIsLoggedIn(true);
  }

  async function logout() {
    await logoutAPI();
    setUser(null);
    setIsLoggedIn(false);
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isLoading, isLoggedIn }}
    >
      {children}
    </AuthContext.Provider>
  );
}

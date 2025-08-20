// src/contexts/AuthContext.tsx

import { createContext, useContext, useEffect, useState } from "react";
import { isAuthenticated, login as loginAPI, logout as logoutAPI } from "@/services/auth/authService";
import { useLocation } from "react-router-dom"; 

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  permissions: string[];

}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfileImage: (newImageUrl: string) => void; // Adicione esta linha
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
    
    if (pathname === '/login' || pathname === '/') {
        setisLoading(false);
        setUser(null);
        setIsLoggedIn(false);
    } else {
        checkAuth();
    }
  }, [pathname]);

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
  
  // Função para atualizar a imagem do perfil no estado do contexto
   function updateProfileImage(newImageUrl: string) {
    if (user) {
      setUser({ ...user, avatar: newImageUrl });
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, updateProfileImage, isLoading, isLoggedIn }}
    >
      {children}
    </AuthContext.Provider>
  );
}
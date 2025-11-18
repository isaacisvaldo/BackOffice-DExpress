import { createContext, useContext, useState, useCallback } from "react";
import {
  isAuthenticated,
  login as loginAPI,
  logout as logoutAPI,
} from "@/services/auth/authService";
import { useNavigate } from "react-router-dom";

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
  checkAuth: () => Promise<void>;
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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await isAuthenticated();
      if (res?.valid && res?.user) {
        setUser(res.user);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false); // sem mostrar mensagem
      }
    } catch (e) {
      setUser(null);
      setIsLoggedIn(false); // aqui também silencioso
      console.error("Erro de autenticação", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const navigate = useNavigate();

  // login
  const login = useCallback(
    async (email: string, password: string) => {
      const data = await loginAPI({ email, password });
      if (data?.user) {
        setUser(data.user);
        setIsLoggedIn(true);
        navigate("/dashboard", { replace: true });
      }
    },
    [navigate],
  );

  // logout
  const logout = useCallback(async () => {
    await logoutAPI();
    setUser(null);
    setIsLoggedIn(false);
    navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateProfileImage: (newImageUrl) =>
          setUser((prev) => (prev ? { ...prev, avatar: newImageUrl } : prev)),
        isLoading,
        isLoggedIn: !!isLoggedIn,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

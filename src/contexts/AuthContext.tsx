import { createContext, useContext, useEffect, useState } from "react";
import { isAuthenticated, login as loginAPI, logout as logoutAPI } from "@/services/auth/authService";

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

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await isAuthenticated();
        if (res && res.user) setUser(res.user);
      } catch (error) {
        // Em caso de erro, garantimos que o utilizador é nulo.
        setUser(null);
      } finally {
        // Este bloco é executado sempre, garantindo que o loading seja false.
        setisLoading(false);
      }
    }

    checkAuth();
  }, []);

  async function login(email: string, password: string) {
    const data = await loginAPI(email, password);
    setUser(data.user);
  }

  async function logout() {
    await logoutAPI();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isLoading, isLoggedIn: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

import { useEffect, useState, type JSX } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, isTokenExpired, refreshAccessToken, login } from "@/services/auth/authService";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const [auth, setAuth] = useState<boolean | null>(null);
  const [showReauthModal, setShowReauthModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshTried, setRefreshTried] = useState(false); 

  useEffect(() => {
    async function check() {
      const expired = isTokenExpired();

      if (expired && !refreshTried) {
        setRefreshTried(true); // Marca que já tentamos atualizar
        try {
          const { accessToken } = await refreshAccessToken();
          localStorage.setItem("accessToken", accessToken);
          setAuth(true);
        } catch {
          // Se o refresh falhar, mostramos a modal
          setShowReauthModal(true);
          setAuth(false);
        } finally {
          setLoading(false);
        }
      } else if (!expired) {
        const valid = await isAuthenticated();
        setAuth(valid);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
    check();
  }, [refreshTried]);

  async function handleReauth(email: string, password: string) {
    try {
      const { accessToken, refreshToken } = await login(email, password);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setAuth(true);
      setShowReauthModal(false);
    } catch (e) {
      alert("Erro ao autenticar. Tente novamente.");
    }
  }

 function handleCancel() {
  localStorage.clear();   
  setShowReauthModal(false);
  setAuth(false);
  // Redireciona para a página inicial ou de login
  window.location.href = "/";
}

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg">Carregando...</p>
      </div>
    );
  }

  if (!auth && !showReauthModal) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      {showReauthModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-96 space-y-4">
            <h2 className="text-lg font-bold">Sessão Expirada</h2>
            <p className="text-sm text-gray-600">
              Faça login novamente para continuar.
            </p>
            <input
              type="email"
              placeholder="E-mail"
              className="border w-full px-3 py-2 rounded"
              id="reauthEmail"
            />
            <input
              type="password"
              placeholder="Senha"
              className="border w-full px-3 py-2 rounded"
              id="reauthPassword"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={handleCancel}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={() =>
                  handleReauth(
                    (document.getElementById("reauthEmail") as HTMLInputElement)
                      .value,
                    (document.getElementById("reauthPassword") as HTMLInputElement)
                      .value
                  )
                }
              >
                Autenticar
              </button>
            </div>
          </div>
        </div>
      )}
      {auth && children}
    </>
  );
}

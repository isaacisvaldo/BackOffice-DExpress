const API_URL = import.meta.env.VITE_API_URL

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/admin/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Erro ao autenticar")
  }

  return response.json()
}
export async function logout() {
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
  window.location.href = "/"
}
export async function isAuthenticated() {
  const accessToken = localStorage.getItem("accessToken")
  if (!accessToken) return false
  const response = await fetch(`${API_URL}/auth/validate`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return response.ok
}

export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken")
  if (!refreshToken) throw new Error("Refresh token não encontrado")

  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  })

  if (!response.ok) {
    throw new Error("Erro ao atualizar o token de acesso")
  }
  return response.json()
}
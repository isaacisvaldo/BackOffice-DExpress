const API_URL = import.meta.env.VITE_API_URL

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
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
  localStorage.removeItem("token")
  window.location.href = "/"
}
export async function isAuthenticated() {
  const token = localStorage.getItem("token")
  if (!token) return false

  const response = await fetch(`${API_URL}/auth/validate`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  return response.ok
}
const API_URL = import.meta.env.VITE_API_URL

// ✅ LOGIN (tokens virão via cookies, não no corpo)
export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/admin/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // ESSENCIAL para enviar e receber cookies
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Erro ao autenticar")
  }

  // Tokens estão no cookie HTTP-only, só retorna o user
  return response.json()
}

// ✅ LOGOUT (limpa os cookies no backend)
export async function logout() {
  await fetch(`${API_URL}/admin/auth/logout`, {
    method: "POST",
    credentials: "include",
  })

  window.location.href = "/"
}

// ✅ CHECA SE O USUÁRIO ESTÁ AUTENTICADO
export async function isAuthenticated() {
  const response = await fetch(`${API_URL}/admin/auth/validate`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) return null;

  return response.json(); // ← Aqui retorna { valid: true, user: {...} }
}

// ✅ REFRESH TOKEN usando cookie
export async function refreshAccessToken() {
  const response = await fetch(`${API_URL}/admin/auth/refresh`, {
    method: "POST",
    credentials: "include",
  })

  if (!response.ok) {
    throw new Error("Erro ao atualizar o token de acesso")
  }

  return response.json() // geralmente { accessToken: novoToken }
}



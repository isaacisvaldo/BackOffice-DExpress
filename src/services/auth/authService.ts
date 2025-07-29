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
  const response = await fetch(`${API_URL}/admin/auth/validate`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return response.ok
}

export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("Refresh token não encontrado");
  const response = await fetch(`${API_URL}/admin/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });
  if (!response.ok) {
    throw new Error("Erro ao atualizar o token de acesso");
  }
  return response.json();
}

export function isTokenExpired(): boolean {
  const token = localStorage.getItem("accessToken");
  if (!token) return true;

  try {
    // JWT tem 3 partes: header.payload.signature
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return true;

    const decodedPayload = JSON.parse(atob(payloadBase64));
    const exp = decodedPayload.exp; // geralmente vem em segundos

    if (!exp) return true;

    const now = Math.floor(Date.now() / 1000); // segundos atuais
    return now >= exp; // se o tempo atual passou do exp, o token expirou
  } catch (e) {
    console.error("Erro ao verificar expiração do token", e);
    return true;
  }
}

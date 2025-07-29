const API_URL = import.meta.env.VITE_API_URL || ""
export async function getCurrentUser() {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("Usuário não autenticado");
  }
  const response = await fetch(`${API_URL}/admin/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Não foi possível buscar os dados do usuário");
  }

  return await response.json(); 
}

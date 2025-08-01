const API_URL = import.meta.env.VITE_API_URL || "";

export async function getCurrentUser(): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/admin/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", 
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.message || "Erro ao buscar os dados do usuário.";
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || "Erro inesperado ao buscar usuário.");
  }
}

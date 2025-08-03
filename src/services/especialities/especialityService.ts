const API_URL = import.meta.env.VITE_API_URL || "";

export async function getEspecialities(): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/specialties`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", 
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.message || "Erro ao buscar Especialidades.";
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || "Erro inesperado ao buscar especialidades.");
  }
}

import type { Application } from "@/components/candidacy/columns";

const API_URL = import.meta.env.VITE_API_URL || "";

export type ApplicationResponse = {
  data: Application[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

// Adicionamos page e limit como parâmetros
export async function getApplications({
  page = 1,
  limit = 10,
  status = "",
}: { page?: number; limit?: number; status?: string }): Promise<ApplicationResponse> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (status) params.append("status", status)

  const response = await fetch(`${API_URL}/job-application?${params.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  if (!response.ok) throw new Error("Erro ao buscar candidaturas")
  return response.json()
}


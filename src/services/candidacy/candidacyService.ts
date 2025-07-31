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
}: { page?: number; limit?: number; status?: string,createdAt?:string}): Promise<ApplicationResponse> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (status) params.append("status", status)

  const response = await fetch(`${API_URL}/job-application?${params.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  if (!response.ok) throw new Error("Erro ao buscar candidaturas")
  return response.json()
}
const fakeApplications: Application[] = [
  {
    id: "79ad7f44-fa39-4cd2-a8f3-0c1877473e11",
    candidateName: "João Silva",
    email: "joao@example.com",
    phone: "912345678",
    location: "Luanda - Belas",
    position: "Desenvolvedor Frontend",
    status: "PENDING",
    appliedAt: "2025-07-20"
  },
  {
    id: "2",
    candidateName: "Maria Santos",
    email: "maria@example.com",
    phone: "923456789",
    location: "Benguela - Lobito",
    position: "UI/UX Designer",
    status: "ACCEPTED",
    appliedAt: "2025-07-25"
  },
  // Adicione mais objetos se necessário
]

export async function getApplicationById(id: string): Promise<Application | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const found = fakeApplications.find((app) => app.id === id)
      resolve(found || null)
    }, 500) // Simula um delay de requisição
  })
}


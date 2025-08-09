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
  createdAt = "",
}: { page?: number; limit?: number; status?: string; createdAt?: string }): Promise<ApplicationResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (status) params.append("status", status);
  if (createdAt) params.append("createdAt", createdAt);

  const response = await fetch(`${API_URL}/job-application?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 👈 importante para usar cookies
  });

  if (!response.ok) throw new Error("Erro ao buscar candidaturas");
  return response.json();
}

export async function getApplicationById(id: string): Promise<Application | null> {
  if (!id) return null; 
    const response = await fetch(`${API_URL}/job-application/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 👈 importante para usar cookies
  });

  if (!response.ok) throw new Error("Erro ao buscar candidaturas");
  return response.json();
}
export async function updateApplicationStatus(id: string, status: string): Promise<Application> {
  const response = await fetch(`${API_URL}/job-application/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar status da candidatura");
  }

  return response.json();
}
export async function deleteApplication(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/job-application/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erro ao excluir candidatura");
  }
}

// services/api.ts

export async function checkCandidateHasProfile(applicationId: string): Promise<boolean> {
  const response = await fetch(`${API_URL}/job-application/${applicationId}/has-profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erro ao verificar perfil do candidato");
  }

  const data = await response.json();
  //  a resposta  { hasProfile: true }
  return data.hasProfile; 
}
export async function createCandidateProfile(): Promise<void> {
 

 
}

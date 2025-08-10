// src/services/application/application.service.ts

import type { JobApplication } from "@/types/types";
import {
  fetchData,
  fetchDataWithFilter,
  sendData,
  deleteData,
    type FilterParams,
} from "../api-client";


// A tipagem 'ApplicationResponse' pode ser um tipo genérico 'PaginatedResponse<Application>'
// Mas para manter a consistência com o código original, vamos mantê-la.
export type ApplicationResponse = {
  data: JobApplication[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

// Nova interface para os parâmetros de filtro da candidatura, que estende FilterParams
interface GetApplicationsParams extends FilterParams {
  status?: string;
  createdAt?: string;
}

export async function getApplications(
  params: GetApplicationsParams = {},
): Promise<ApplicationResponse> {
  return fetchDataWithFilter("/job-application", params);
}

export async function getApplicationById(id: string): Promise<JobApplication> {
  return fetchData(`/job-application/${id}`);
}

export async function updateApplicationStatus(
  id: string,
  status: string,
): Promise<JobApplication> {
  return sendData(`/job-application/${id}/status`, "PATCH", { status });
}

export async function deleteApplication(id: string): Promise<void> {
  return deleteData(`/job-application/${id}`);
}

export async function checkCandidateHasProfile(applicationId: string): Promise<boolean> {
  
  const data = await fetchData(`/job-application/${applicationId}/has-profile`);
  return data.hasProfile;
}


export async function createCandidateProfile(): Promise<void> {
  // Como a função original estava vazia, assumimos que ela faria uma requisição POST
  // sem retorno específico. Se a API retornar dados, a tipagem 'void' pode ser alterada.
  // Exemplo de como poderia ser:
  // await sendData("/candidate-profile", "POST");
  // Ou, se precisar de um corpo de requisição:
  // await sendData("/candidate-profile", "POST", { someData: "value" });
}
// src/services/admin/admin-user.service.ts
import { fetchDataWithFilter } from "../api-client"
import type { FilterParams } from "../api-client"

// A interface do seu modelo AdminUser
export interface AdminUser {
  id: string;
  name: string;
  numberphone: string;
  isActive: boolean;
  identityNumber: string;
  birthDate: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  gender: {
    id: string;
    name: string;
  };
}


// Resposta paginada da API
export interface PaginatedAdminUsersResponse {
  data: AdminUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface GetAdminUsersParams extends FilterParams {
  search?: string;
}

// A função que vai chamar a sua API
export async function getAdminUsers(
  params: GetAdminUsersParams = {},
): Promise<PaginatedAdminUsersResponse> {

  return fetchDataWithFilter("/admin/users", params); 
}

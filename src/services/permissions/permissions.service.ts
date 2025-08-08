import { type FilterParams, fetchDataWithFilter, fetchData } from "../api-client";

// A interface para o objeto de permissão, seguindo o seu modelo do Prisma
export interface Permission {
  id: string;
  name: string;
  label: string; // Adicionado para exibir nomes amigáveis na UI
}

// Define a interface para a resposta paginada
export interface PaginatedPermissionsResponse {
  data: Permission[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Estende FilterParams para incluir 'page' e 'limit'
interface GetPermissionsParams extends FilterParams {
  name?: string;
  label?: string;
}

/**
 * Busca uma lista completa de permissões, sem paginação.
 * Usa a função genérica fetchData.
 */
export async function getPermissions(): Promise<Permission[]> {
  return fetchData("/permissions/list");
}

/**
 * Busca uma lista paginada e filtrada de permissões.
 * Usa a função genérica fetchDataWithFilter para lidar com a lógica de query.
 */
export async function getPaginatedPermissions(
  params: GetPermissionsParams = {},
): Promise<PaginatedPermissionsResponse> {
  return fetchDataWithFilter("/permissions", params);
}

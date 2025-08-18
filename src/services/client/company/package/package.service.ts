// src/services/package.service.ts

import {
  type FilterParams,
  fetchDataWithFilter,
  fetchData,
  sendData,
  deleteData,
} from "../../../api-client";

// --- Interfaces de Modelo ---

/**
 * Representa um pacote de serviço.
 */
export interface Package {
  id: string;
  name: string;
  description?: string;
  employees: number;
  hours: number;
  cost: number;
  percentage: number;
  equivalent: number;
  baseSalary: number;
  totalBalance: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Define a estrutura da resposta paginada para pacotes.
 */
export interface PaginatedPackagesResponse {
  data: Package[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// --- Interfaces DTO (Data Transfer Objects) ---

/**
 * DTO para a criação de um novo pacote.
 */
export interface CreatePackageDto {
  name: string;
  description?: string;
  employees: number;
  hours: number;
  cost: number;
  percentage: number;
  equivalent: number;
  baseSalary: number;
  totalBalance: number;
}

/**
 * DTO para a atualização de um pacote existente.
 */
export interface UpdatePackageDto {
  name?: string;
  description?: string;
  employees?: number;
  hours?: number;
  cost?: number;
  percentage?: number;
  equivalent?: number;
  baseSalary?: number;
  totalBalance?: number;
  isActive?: boolean;
}

// --- Parâmetros de Filtro ---

/**
 * Parâmetros de filtro para buscar pacotes, incluindo opção de pesquisa.
 */
interface GetPackagesParams extends FilterParams {
  search?: string;
}

// --- Funções da API ---

/**
 * Busca uma lista paginada e filtrada de pacotes de serviço.
 * @param params Parâmetros de filtro e paginação.
 * @returns Uma promessa que resolve para a resposta paginada dos pacotes.
 */
export async function getPackages(
  params: GetPackagesParams = {},
): Promise<PaginatedPackagesResponse> {
  return fetchDataWithFilter("/packages", params);
}

/**
 * Busca uma lista completa de todos os pacotes, sem paginação.
 * @returns Uma promessa que resolve para a lista completa de pacotes.
 */
export async function getAllPackages(): Promise<Package[]> {
  return fetchData("/packages/list");
}

/**
 * Busca um único pacote pelo seu ID.
 * @param id O ID do pacote.
 * @returns Uma promessa que resolve para o pacote.
 */
export async function getPackageById(id: string): Promise<Package> {
  return fetchData(`/packages/${id}`);
}

/**
 * Cria um novo pacote.
 * @param data Os dados para a criação do pacote.
 * @returns Uma promessa que resolve para o pacote recém-criado.
 */
export async function createPackage(
  data: CreatePackageDto,
): Promise<Package> {
  return sendData("/packages", "POST", data);
}

/**
 * Atualiza um pacote existente pelo seu ID.
 * @param id O ID do pacote a ser atualizado.
 * @param data Os dados de atualização.
 * @returns Uma promessa que resolve para o pacote atualizado.
 */
export async function updatePackage(
  id: string,
  data: UpdatePackageDto,
): Promise<Package> {
  return sendData(`/packages/${id}`, "PATCH", data);
}

/**
 * Remove um pacote existente pelo seu ID.
 * @param id O ID do pacote a ser removido.
 * @returns Uma promessa que resolve para o pacote removido.
 */
export async function deletePackage(id: string): Promise<Package> {
  return deleteData(`/packages/${id}`);
}
// src/services/company-package.service.ts

import {
  type FilterParams,
  fetchDataWithFilter,
  fetchData,
  sendData,
  deleteData,
} from "../../../api-client";

// --- Interfaces de Modelo ---

/**
 * Representa um contrato de pacote de serviço para uma empresa.
 */
export interface CompanyPackage {
  id: string;
  clientCompanyProfileId: string;
  packageId: string;
  startDate: string; // Data de início do contrato
  endDate: string; // Data de fim do contrato
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Define a estrutura da resposta paginada para contratos de pacotes.
 */
export interface PaginatedCompanyPackagesResponse {
  data: CompanyPackage[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// --- Interfaces DTO (Data Transfer Objects) ---

/**
 * DTO para a criação de um novo contrato de pacote.
 */
export interface CreateCompanyPackageDto {
  clientCompanyProfileId: string;
  packageId: string;
  startDate: string;
  endDate: string;
}

/**
 * DTO para a atualização de um contrato de pacote existente.
 */
export interface UpdateCompanyPackageDto {
  clientCompanyProfileId?: string;
  packageId?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

// --- Parâmetros de Filtro ---

/**
 * Parâmetros de filtro para buscar contratos de pacotes.
 */
interface GetCompanyPackagesParams extends FilterParams {
  search?: string;
}

// --- Funções da API ---

/**
 * Busca uma lista paginada e filtrada de contratos de pacotes.
 * @param params Parâmetros de filtro e paginação.
 * @returns Uma promessa que resolve para a resposta paginada dos contratos.
 */
export async function getCompanyPackages(
  params: GetCompanyPackagesParams = {},
): Promise<PaginatedCompanyPackagesResponse> {
  return fetchDataWithFilter("/company-packages", params);
}

/**
 * Busca um único contrato de pacote pelo seu ID.
 * @param id O ID do contrato.
 * @returns Uma promessa que resolve para o contrato de pacote.
 */
export async function getCompanyPackageById(
  id: string,
): Promise<CompanyPackage> {
  return fetchData(`/company-packages/${id}`);
}

/**
 * Cria um novo contrato de pacote.
 * @param data Os dados para a criação do contrato.
 * @returns Uma promessa que resolve para o contrato recém-criado.
 */
export async function createCompanyPackage(
  data: CreateCompanyPackageDto,
): Promise<CompanyPackage> {
  return sendData("/company-packages", "POST", data);
}

/**
 * Atualiza um contrato de pacote existente pelo seu ID.
 * @param id O ID do contrato a ser atualizado.
 * @param data Os dados de atualização.
 * @returns Uma promessa que resolve para o contrato atualizado.
 */
export async function updateCompanyPackage(
  id: string,
  data: UpdateCompanyPackageDto,
): Promise<CompanyPackage> {
  return sendData(`/company-packages/${id}`, "PATCH", data);
}

/**
 * Remove um contrato de pacote existente pelo seu ID.
 * @param id O ID do contrato a ser removido.
 * @returns Uma promessa que resolve para o contrato removido.
 */
export async function deleteCompanyPackage(
  id: string,
): Promise<CompanyPackage> {
  return deleteData(`/company-packages/${id}`);
}
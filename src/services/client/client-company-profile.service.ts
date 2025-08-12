import  {  type FilterParams, fetchDataWithFilter, fetchData, sendData, deleteData } from "../api-client";
export interface Sector {
  id:string;
  name:string;
  label:string
}

export interface ClientCompanyProfile {
  id: string;
  companyName: string;
  nif: string;
  email: string;
  phoneNumber: string;
  optionalContact?: string;
  address: string;
  state: string;
  createdAt: string;
  updatedAt: string;
  sectorId: string;
  sector: Sector;
}

// Define a interface para a resposta paginada
export interface PaginatedClientCompanyProfilesResponse {
  data: ClientCompanyProfile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Interfaces para os DTOs (Data Transfer Objects)
export interface CreateCompanyProfileDto {
  companyName: string;
  nif: string;
  email: string;
  phoneNumber: string;
  optionalContact?: string;
  address: string;
  sectorId: string;
}

export interface UpdateCompanyProfileDto {
  companyName?: string;
  nif?: string;
  email?: string;
  phoneNumber?: string;
  optionalContact?: string;
  address?: string;
  state?: string;
  sectorId?: string;
}

// Parâmetros de filtro para busca
interface GetCompanyProfilesParams extends FilterParams {
  search?: string;
}

// --- Funções da API ---

/**
 * Busca uma lista paginada e filtrada de perfis de empresa.
 * Usa a função genérica fetchDataWithFilter.
 */
export async function getClientCompanyProfiles(
  params: GetCompanyProfilesParams = {},
): Promise<PaginatedClientCompanyProfilesResponse> {
  return fetchDataWithFilter("/client-company-profiles", params);
}

/**
 * Busca um único perfil de empresa pelo seu ID.
 */
export async function getClientCompanyProfileById(id: string): Promise<ClientCompanyProfile> {
  return fetchData(`/client-company-profiles/${id}`);
}

/**
 * Busca o perfil de empresa de um usuário específico pelo ID do usuário.
 */
export async function getClientCompanyProfileByUserId(userId: string): Promise<ClientCompanyProfile> {
  return fetchData(`/client-company-profiles/user/${userId}`);
}

/**
 * Cria um novo perfil de empresa.
 */
export async function createClientCompanyProfile(data: CreateCompanyProfileDto): Promise<ClientCompanyProfile> {
  return sendData("/client-company-profiles", "POST", data);
}

/**
 * Atualiza um perfil de empresa existente pelo seu ID.
 */
export async function updateClientCompanyProfile(id: string, data: UpdateCompanyProfileDto): Promise<ClientCompanyProfile> {
  return sendData(`/client-company-profiles/${id}`, "PATCH", data);
}

/**
 * Remove um perfil de empresa existente pelo seu ID.
 */
export async function deleteClientCompanyProfile(id: string): Promise<ClientCompanyProfile> {
  return deleteData(`/client-company-profiles/${id}`);
}
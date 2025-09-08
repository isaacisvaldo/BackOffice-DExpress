// src/services/client-profile.service.ts

import {
  type FilterParams,
  fetchDataWithFilter,
  fetchData,
  sendData,
  deleteData,
} from "../api-client";

// --- Interfaces de Modelo ---

/**
 * Representa o perfil de um cliente individual.
 */
export interface ClientProfile {
  id: string;
  fullName: string;
  email: string;
  identityNumber?: string;
  phoneNumber: string;
  optionalContacts: string[];
  address: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

/**
 * Define a estrutura da resposta paginada para perfis de cliente.
 */
export interface PaginatedClientProfilesResponse {
  data: ClientProfile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// --- Interfaces DTO (Data Transfer Objects) ---

/**
 * DTO para a criação de um novo perfil de cliente.
 */
export interface CreateClientProfileDto {
  fullName: string;
  email: string;
  identityNumber?: string;
  phoneNumber: string;
  optionalContacts: string[];
  address: string;
}

/**
 * DTO para a atualização de um perfil de cliente existente.
 */
export interface UpdateClientProfileDto {
  fullName?: string;
  email?: string;
  identityNumber?: string;
  phoneNumber?: string;
  optionalContacts?: string[];
  address?: string;
}

// --- Parâmetros de Filtro ---

/**
 * Parâmetros de filtro para buscar perfis de cliente, incluindo opção de pesquisa.
 */
interface GetClientProfilesParams extends FilterParams {
  search?: string;
}

// --- Funções da API ---

/**
 * Busca uma lista paginada e filtrada de perfis de cliente.
 * @param params Parâmetros de filtro e paginação.
 * @returns Uma promessa que resolve para a resposta paginada dos perfis.
 */
export async function getClientProfiles(
  params: GetClientProfilesParams = {},
): Promise<PaginatedClientProfilesResponse> {
  return fetchDataWithFilter("/client-profiles", params);
}

export async function fetchIndividualClients(search?: string): Promise<ClientProfile[]> {
  const url = search ? `/client-profiles/all?search=${encodeURIComponent(search)}` : '/client-profiles/all';
  return fetchData(url);
}

/**
 * Busca um único perfil de cliente pelo seu ID.
 * @param id O ID do perfil do cliente.
 * @returns Uma promessa que resolve para o perfil do cliente.
 */
export async function getClientProfileById(
  id: string,
): Promise<ClientProfile> {
  return fetchData(`/client-profiles/${id}`);
}

/**
 * Busca o perfil de cliente de um usuário específico pelo ID do usuário.
 * @param userId O ID do usuário.
 * @returns Uma promessa que resolve para o perfil do cliente do usuário.
 */
export async function getClientProfileByUserId(
  userId: string,
): Promise<ClientProfile> {
  return fetchData(`/client-profiles/user/${userId}`);
}

/**
 * Cria um novo perfil de cliente para o usuário autenticado.
 * @param data Os dados para a criação do perfil.
 * @returns Uma promessa que resolve para o perfil de cliente recém-criado.
 */
export async function createClientProfile(
  data: CreateClientProfileDto,
): Promise<ClientProfile> {
  return sendData("/client-profiles", "POST", data);
}

/**
 * Cria um novo perfil de cliente pelo backOffice (usando o ID do usuário fornecido).
 * @param userId O ID do usuário para o qual o perfil será criado.
 * @param data Os dados para a criação do perfil.
 * @returns Uma promessa que resolve para o perfil de cliente recém-criado.
 */
export async function createClientProfileInternal(
  userId: string,
  data: CreateClientProfileDto,
): Promise<ClientProfile> {
  return sendData(`/client-profiles/${userId}`, "POST", data);
}

/**
 * Atualiza um perfil de cliente existente pelo seu ID.
 * @param id O ID do perfil a ser atualizado.
 * @param data Os dados de atualização.
 * @returns Uma promessa que resolve para o perfil de cliente atualizado.
 */
export async function updateClientProfile(
  id: string,
  data: UpdateClientProfileDto,
): Promise<ClientProfile> {
  return sendData(`/client-profiles/${id}`, "PATCH", data);
}

/**
 * Remove um perfil de cliente existente pelo seu ID.
 * @param id O ID do perfil a ser removido.
 * @returns Uma promessa que resolve para o perfil de cliente removido.
 */
export async function deleteClientProfile(
  id: string,
): Promise<ClientProfile> {
  return deleteData(`/client-profiles/${id}`);
}
// src/services/marital-statuses/marital-status.service.ts

import {
  type FilterParams,
  fetchDataWithFilter,
  fetchData,
  sendData,
  deleteData,
} from "../../api-client";

export interface MaritalStatus {
  id: string;
  name: string;
  label: string;
  createdAt: string;
  updatedAt: string;
}

interface GetMaritalStatusesParams extends FilterParams {
  name?: string;
}

export interface PaginatedMaritalStatusesResponse {
  data: MaritalStatus[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Busca uma lista paginada e filtrada de estados civis.
 * Corresponde ao endpoint GET /marital-statuses.
 * @param params Parâmetros de paginação e filtro.
 */
export async function getMaritalStatuses(
  params: GetMaritalStatusesParams = {},
): Promise<PaginatedMaritalStatusesResponse> {
  return fetchDataWithFilter("/marital-statuses", params);
}

/**
 * Busca uma lista completa de estados civis, sem paginação.
 * Corresponde ao endpoint GET /marital-statuses/list.
 * @returns Um array com todos os objetos de estado civil.
 */
export async function getMaritalStatusesList(): Promise<MaritalStatus[]> {
  return fetchData("/marital-statuses/list");
}

export interface CreateMaritalStatusDto {
  name: string;
  label: string;
}

/**
 * Cria um novo estado civil.
 * Corresponde ao endpoint POST /marital-statuses.
 * @param data O objeto de dados do novo estado civil.
 * @returns O objeto de estado civil criado.
 */
export async function createMaritalStatus(
  data: CreateMaritalStatusDto,
): Promise<MaritalStatus> {
  return sendData("/marital-statuses", "POST", data);
}

/**
 * Busca um estado civil específico pelo ID.
 * Corresponde ao endpoint GET /marital-statuses/:id.
 * @param id O ID do estado civil.
 * @returns O objeto de estado civil encontrado.
 */
export async function getMaritalStatusById(id: string): Promise<MaritalStatus> {
  return fetchData(`/marital-statuses/${id}`);
}

export interface UpdateMaritalStatusDto {
  name?: string;
  label?: string;
}

/**
 * Atualiza um estado civil existente.
 * Corresponde ao endpoint PATCH /marital-statuses/:id.
 * @param id O ID do estado civil a ser atualizado.
 * @param data O objeto com os dados a serem atualizados.
 * @returns O objeto de estado civil atualizado.
 */
export async function updateMaritalStatus(
  id: string,
  data: UpdateMaritalStatusDto,
): Promise<MaritalStatus> {
  return sendData(`/marital-statuses/${id}`, "PATCH", data);
}

/**
 * Remove um estado civil existente.
 * Corresponde ao endpoint DELETE /marital-statuses/:id.
 * @param id O ID do estado civil a ser removido.
 * @returns O objeto de estado civil removido.
 */
export async function deleteMaritalStatus(id: string): Promise<MaritalStatus> {
  return deleteData(`/marital-statuses/${id}`);
}
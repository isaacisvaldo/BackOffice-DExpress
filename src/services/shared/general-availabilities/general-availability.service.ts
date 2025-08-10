// src/services/general-availabilities/general-availability.service.ts

import {
  type FilterParams,
  fetchDataWithFilter,
  fetchData,
  sendData,
  deleteData,
} from "../../api-client";

export interface GeneralAvailability {
  id: string;
  name: string;
  label: string;
  createdAt: string;
  updatedAt: string;
}

interface GetGeneralAvailabilitiesParams extends FilterParams {
  name?: string;
}

export interface PaginatedGeneralAvailabilitiesResponse {
  data: GeneralAvailability[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Busca uma lista paginada e filtrada de disponibilidades gerais.
 * Corresponde ao endpoint GET /general-availabilities.
 * @param params Parâmetros de paginação e filtro.
 */
export async function getGeneralAvailabilities(
  params: GetGeneralAvailabilitiesParams = {},
): Promise<PaginatedGeneralAvailabilitiesResponse> {
  return fetchDataWithFilter("/general-availabilities", params);
}

/**
 * Busca uma lista completa de disponibilidades gerais, sem paginação.
 * Corresponde ao endpoint GET /general-availabilities/list.
 * @returns Um array com todos os objetos de disponibilidade geral.
 */
export async function getGeneralAvailabilitiesList(): Promise<GeneralAvailability[]> {
  return fetchData("/general-availabilities/list");
}

export interface CreateGeneralAvailabilityDto {
  name: string;
  label: string;
}

/**
 * Cria uma nova disponibilidade geral.
 * Corresponde ao endpoint POST /general-availabilities.
 * @param data O objeto de dados da nova disponibilidade geral.
 * @returns O objeto de disponibilidade geral criado.
 */
export async function createGeneralAvailability(
  data: CreateGeneralAvailabilityDto,
): Promise<GeneralAvailability> {
  return sendData("/general-availabilities", "POST", data);
}

/**
 * Busca uma disponibilidade geral específica pelo ID.
 * Corresponde ao endpoint GET /general-availabilities/:id.
 * @param id O ID da disponibilidade geral.
 * @returns O objeto de disponibilidade geral encontrado.
 */
export async function getGeneralAvailabilityById(id: string): Promise<GeneralAvailability> {
  return fetchData(`/general-availabilities/${id}`);
}

export interface UpdateGeneralAvailabilityDto {
  name?: string;
  label?: string;
}

/**
 * Atualiza uma disponibilidade geral existente.
 * Corresponde ao endpoint PATCH /general-availabilities/:id.
 * @param id O ID da disponibilidade geral a ser atualizada.
 * @param data O objeto com os dados a serem atualizados.
 * @returns O objeto de disponibilidade geral atualizado.
 */
export async function updateGeneralAvailability(
  id: string,
  data: UpdateGeneralAvailabilityDto,
): Promise<GeneralAvailability> {
  return sendData(`/general-availabilities/${id}`, "PATCH", data);
}

/**
 * Remove uma disponibilidade geral existente.
 * Corresponde ao endpoint DELETE /general-availabilities/:id.
 * @param id O ID da disponibilidade geral a ser removida.
 * @returns O objeto de disponibilidade geral removido.
 */
export async function deleteGeneralAvailability(id: string): Promise<GeneralAvailability> {
  return deleteData(`/general-availabilities/${id}`);
}
// src/services/desired-positions/desired-position.service.ts

import {
  type FilterParams,
  fetchDataWithFilter,
  fetchData,
  sendData,
  deleteData,
} from "../../api-client";

export interface DesiredPosition {
  id: string;
  name: string;
  label: string;
  createdAt: string;
  updatedAt: string;
}

interface GetDesiredPositionsParams extends FilterParams {
  name?: string;
}

export interface PaginatedDesiredPositionsResponse {
  data: DesiredPosition[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Busca uma lista paginada e filtrada de posições desejadas.
 * Corresponde ao endpoint GET /desired-positions.
 * @param params Parâmetros de paginação e filtro.
 */
export async function getDesiredPositions(
  params: GetDesiredPositionsParams = {},
): Promise<PaginatedDesiredPositionsResponse> {
  return fetchDataWithFilter("/desired-positions", params);
}

/**
 * Busca uma lista completa de posições desejadas, sem paginação.
 * Corresponde ao endpoint GET /desired-positions/list.
 * @returns Um array com todos os objetos de posições desejadas.
 */
export async function getDesiredPositionsList(): Promise<DesiredPosition[]> {
  return fetchData("/desired-positions/list");
}

export interface CreateDesiredPositionDto {
  name: string;
  label: string;
}

/**
 * Cria uma nova posição desejada.
 * Corresponde ao endpoint POST /desired-positions.
 * @param data O objeto de dados da nova posição desejada.
 * @returns O objeto de posição desejada criado.
 */
export async function createDesiredPosition(
  data: CreateDesiredPositionDto,
): Promise<DesiredPosition> {
  return sendData("/desired-positions", "POST", data);
}

/**
 * Busca uma posição desejada específica pelo ID.
 * Corresponde ao endpoint GET /desired-positions/:id.
 * @param id O ID da posição desejada.
 * @returns O objeto de posição desejada encontrado.
 */
export async function getDesiredPositionById(id: string): Promise<DesiredPosition> {
  return fetchData(`/desired-positions/${id}`);
}

export interface UpdateDesiredPositionDto {
  name?: string;
  label?: string;
}

/**
 * Atualiza uma posição desejada existente.
 * Corresponde ao endpoint PATCH /desired-positions/:id.
 * @param id O ID da posição desejada a ser atualizada.
 * @param data O objeto com os dados a serem atualizados.
 * @returns O objeto de posição desejada atualizado.
 */
export async function updateDesiredPosition(
  id: string,
  data: UpdateDesiredPositionDto,
): Promise<DesiredPosition> {
  return sendData(`/desired-positions/${id}`, "PATCH", data);
}

/**
 * Remove uma posição desejada existente.
 * Corresponde ao endpoint DELETE /desired-positions/:id.
 * @param id O ID da posição desejada a ser removida.
 * @returns O objeto de posição desejada removido.
 */
export async function deleteDesiredPosition(id: string): Promise<DesiredPosition> {
  return deleteData(`/desired-positions/${id}`);
}
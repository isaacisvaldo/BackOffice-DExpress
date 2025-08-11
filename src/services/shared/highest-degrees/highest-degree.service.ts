// src/services/highest-degrees/highest-degree.service.ts

import {
  type FilterParams,
  fetchDataWithFilter,
  fetchData,
  sendData,
  deleteData,
} from "../../api-client";

export interface HighestDegree {
  id: string;
  name: string;
  label: string;
  createdAt: string;
  updatedAt: string;
}

interface GetHighestDegreesParams extends FilterParams {
  name?: string;
}

export interface PaginatedHighestDegreesResponse {
  data: HighestDegree[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Busca uma lista paginada e filtrada de níveis de escolaridade.
 * Corresponde ao endpoint GET /highest-degrees.
 * @param params Parâmetros de paginação e filtro.
 */
export async function getHighestDegrees(
  params: GetHighestDegreesParams = {},
): Promise<PaginatedHighestDegreesResponse> {
  return fetchDataWithFilter("/highest-degrees", params);
}

/**
 * Busca uma lista completa de níveis de escolaridade, sem paginação.
 * Corresponde ao endpoint GET /highest-degrees/list.
 * @returns Um array com todos os objetos de nível de escolaridade.
 */
export async function getHighestDegreesList(): Promise<HighestDegree[]> {
  return fetchData("/highest-degrees/list");
}

export interface CreateHighestDegreeDto {
  name: string;
  label: string;
  level:number;
}

/**
 * Cria um novo nível de escolaridade.
 * Corresponde ao endpoint POST /highest-degrees.
 * @param data O objeto de dados do novo nível de escolaridade.
 * @returns O objeto de nível de escolaridade criado.
 */
export async function createHighestDegree(
  data: CreateHighestDegreeDto,
): Promise<HighestDegree> {
  return sendData("/highest-degrees", "POST", data);
}

/**
 * Busca um nível de escolaridade específico pelo ID.
 * Corresponde ao endpoint GET /highest-degrees/:id.
 * @param id O ID do nível de escolaridade.
 * @returns O objeto de nível de escolaridade encontrado.
 */
export async function getHighestDegreeById(id: string): Promise<HighestDegree> {
  return fetchData(`/highest-degrees/${id}`);
}

export interface UpdateHighestDegreeDto {
  name?: string;
  label?: string;
}

/**
 * Atualiza um nível de escolaridade existente.
 * Corresponde ao endpoint PATCH /highest-degrees/:id.
 * @param id O ID do nível de escolaridade a ser atualizado.
 * @param data O objeto com os dados a serem atualizados.
 * @returns O objeto de nível de escolaridade atualizado.
 */
export async function updateHighestDegree(
  id: string,
  data: UpdateHighestDegreeDto,
): Promise<HighestDegree> {
  return sendData(`/highest-degrees/${id}`, "PATCH", data);
}

/**
 * Remove um nível de escolaridade existente.
 * Corresponde ao endpoint DELETE /highest-degrees/:id.
 * @param id O ID do nível de escolaridade a ser removido.
 * @returns O objeto de nível de escolaridade removido.
 */
export async function deleteHighestDegree(id: string): Promise<HighestDegree> {
  return deleteData(`/highest-degrees/${id}`);
}
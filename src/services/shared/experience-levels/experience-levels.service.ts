// src/services/experience-levels/experience-level.service.ts

import {
  type FilterParams,
  fetchDataWithFilter,
  fetchData,
  sendData,
  deleteData,
} from "../../api-client";

export interface ExperienceLevel {
  id: string;
  name: string;
  label: string;
  createdAt: string;
  updatedAt: string;
}

interface GetExperienceLevelsParams extends FilterParams {
  name?: string;
}

export interface PaginatedExperienceLevelsResponse {
  data: ExperienceLevel[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Busca uma lista paginada e filtrada de níveis de experiência.
 * Corresponde ao endpoint GET /experience-levels.
 * @param params Parâmetros de paginação e filtro.
 */
export async function getExperienceLevels(
  params: GetExperienceLevelsParams = {},
): Promise<PaginatedExperienceLevelsResponse> {
  return fetchDataWithFilter("/experience-levels", params);
}

/**
 * Busca uma lista completa de níveis de experiência, sem paginação.
 * Corresponde ao endpoint GET /experience-levels/list.
 * @returns Um array com todos os objetos de nível de experiência.
 */
export async function getExperienceLevelsList(): Promise<ExperienceLevel[]> {
  return fetchData("/experience-levels/list");
}

export interface CreateExperienceLevelDto {
  name: string;
  label: string;
}

/**
 * Cria um novo nível de experiência.
 * Corresponde ao endpoint POST /experience-levels.
 * @param data O objeto de dados do novo nível de experiência.
 * @returns O objeto de nível de experiência criado.
 */
export async function createExperienceLevel(
  data: CreateExperienceLevelDto,
): Promise<ExperienceLevel> {
  return sendData("/experience-levels", "POST", data);
}

/**
 * Busca um nível de experiência específico pelo ID.
 * Corresponde ao endpoint GET /experience-levels/:id.
 * @param id O ID do nível de experiência.
 * @returns O objeto de nível de experiência encontrado.
 */
export async function getExperienceLevelById(id: string): Promise<ExperienceLevel> {
  return fetchData(`/experience-levels/${id}`);
}

export interface UpdateExperienceLevelDto {
  name?: string;
  label?: string;
}

/**
 * Atualiza um nível de experiência existente.
 * Corresponde ao endpoint PATCH /experience-levels/:id.
 * @param id O ID do nível de experiência a ser atualizado.
 * @param data O objeto com os dados a serem atualizados.
 * @returns O objeto de nível de experiência atualizado.
 */
export async function updateExperienceLevel(
  id: string,
  data: UpdateExperienceLevelDto,
): Promise<ExperienceLevel> {
  return sendData(`/experience-levels/${id}`, "PATCH", data);
}

/**
 * Remove um nível de experiência existente.
 * Corresponde ao endpoint DELETE /experience-levels/:id.
 * @param id O ID do nível de experiência a ser removido.
 * @returns O objeto de nível de experiência removido.
 */
export async function deleteExperienceLevel(id: string): Promise<ExperienceLevel> {
  return deleteData(`/experience-levels/${id}`);
}
import { type FilterParams, fetchDataWithFilter, fetchData, sendData, deleteData } from "../api-client"

interface GetExperienceLevelParams extends FilterParams {
  name?: string
  label?: string
}

export interface ExperienceLevel {
  id: string
  name: string
  label: string
  createdAt?: string
  updatedAt?: string
}

export interface PaginatedExperienceLevelResponse {
  data: ExperienceLevel[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/**
 * Lista paginada e filtrada
 */
export async function getExperienceLevels(
  params: GetExperienceLevelParams = {},
): Promise<PaginatedExperienceLevelResponse> {
  return fetchDataWithFilter("/experience-levels", params)
}

/**
 * Lista completa (sem paginação)
 */
export async function getExperienceLevelsList(): Promise<ExperienceLevel[]> {
  return fetchData("/experience-levels/list")
}

/**
 * Criar
 */
export interface CreateExperienceLevelDto {
  name: string
  label: string
}
export async function createExperienceLevel(data: CreateExperienceLevelDto): Promise<ExperienceLevel> {
  return sendData("/experience-levels", "POST", data)
}

/**
 * Atualizar
 */
export interface UpdateExperienceLevelDto {
  name?: string
  label?: string
}
export async function updateExperienceLevel(id: string, data: UpdateExperienceLevelDto): Promise<ExperienceLevel> {
  return sendData(`/experience-levels/${id}`, "PUT", data)
}

/**
 * Deletar
 */
export async function deleteExperienceLevel(id: string): Promise<void> {
  return deleteData(`/experience-levels/${id}`)
}

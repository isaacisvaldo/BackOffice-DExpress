import { type FilterParams, fetchDataWithFilter, fetchData, sendData } from "../api-client"

interface GetExperienceLevelParams extends FilterParams {
  name?: string
  description?: string
}

export interface ExperienceLevel {
  id: string
  name: string
  description: string
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
 * Criar Experience Level
 */
export interface CreateExperienceLevelDto {
  name: string
  description: string
}

export async function createExperienceLevel(data: CreateExperienceLevelDto): Promise<ExperienceLevel> {
  return sendData("/experience-levels", "POST", data)
}

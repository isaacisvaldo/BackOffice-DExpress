import { type FilterParams, fetchDataWithFilter, fetchData, sendData } from "../api-client"

interface GetDisponibilityParams extends FilterParams {
  name?: string
  description?: string
}

export interface Disponibility {
  id: string
  name: string
  description: string
}

export interface PaginatedDisponibilityResponse {
  data: Disponibility[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/**
 * Lista paginada e filtrada
 */
export async function getDisponibilities(
  params: GetDisponibilityParams = {},
): Promise<PaginatedDisponibilityResponse> {
  return fetchDataWithFilter("/general-availabilities", params)
}

/**
 * Lista completa (sem paginação)
 */
export async function getDisponibilitiesList(): Promise<Disponibility[]> {
  return fetchData("/general-availabilities/list")
}

/**
 * Criar disponibility
 */
export interface CreateDisponibilityDto {
  name: string
  description: string
}

export async function createDisponibility(data: CreateDisponibilityDto): Promise<Disponibility> {
  return sendData("/general-availabilities", "POST", data)
}

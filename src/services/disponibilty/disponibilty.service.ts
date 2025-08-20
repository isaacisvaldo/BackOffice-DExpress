import { type FilterParams, fetchDataWithFilter, fetchData, sendData, deleteData } from "../api-client"

interface GetDisponibilityParams extends FilterParams {
  name?: string
  label?: string
}

export interface Disponibility {
  id: string
  name: string
  label: string
  createdAt?: string
  updatedAt?: string
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
 * (mantido o endpoint original)
 */
export async function getDisponibilities(
  params: GetDisponibilityParams = {},
): Promise<PaginatedDisponibilityResponse> {
  return fetchDataWithFilter("/general-availabilities", params)
}

/** Lista completa (sem paginação) */
export async function getDisponibilitiesList(): Promise<Disponibility[]> {
  return fetchData("/general-availabilities/list")
}

/** Criar */
export interface CreateDisponibilityDto {
  name: string
  label: string
}
export async function createDisponibility(data: CreateDisponibilityDto): Promise<Disponibility> {
  return sendData("/general-availabilities", "POST", data)
}

/** Atualizar */
export interface UpdateDisponibilityDto {
  name?: string
  label?: string
}
export async function updateDisponibility(id: string, data: UpdateDisponibilityDto): Promise<Disponibility> {
  return sendData(`/general-availabilities/${id}`, "PUT", data)
}

/** Excluir */
export async function deleteDisponibility(id: string): Promise<void> {
  return deleteData(`/general-availabilities/${id}`)
}

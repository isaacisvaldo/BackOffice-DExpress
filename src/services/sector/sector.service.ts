import { type FilterParams, fetchDataWithFilter, fetchData, sendData, deleteData } from "../api-client"

// Parâmetros de busca
interface GetSectorParams extends FilterParams {
  name?: string
  label?: string
}

// Tipagem de sectors
export interface Sector {
  id: string
  name: string
  label: string
}

// Resposta paginada
export interface PaginatedSectorResponse {
  data: Sector[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/**
 * Lista paginada e filtrada
 */
export async function getSector(
  params: GetSectorParams = {},
): Promise<PaginatedSectorResponse> {
  return fetchDataWithFilter("/sectors", params)
}

/**
 * Lista completa (sem paginação)
 */
export async function getSectorList(): Promise<Sector[]> {
  return fetchData("/sectors/list")
}

/**
 * Criar sectors
 */
export interface CreateSectorDto {
  name: string
  label: string
}

export interface UpdateSectorDto {
  name?: string
  label?: string
}


export async function createSector(data: CreateSectorDto): Promise<Sector> {
  return sendData("/sectors", "POST", data)
}

export async function updateSector(id: string, data: UpdateSectorDto): Promise<Sector> {
  return sendData(`/sectors/${id}`, "PATCH", data)
}

export async function deleteSector(id: string): Promise<Sector> {
  return deleteData(`/sectors/${id}`)
}

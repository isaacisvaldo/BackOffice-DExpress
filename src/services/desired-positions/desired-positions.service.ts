import { type FilterParams, fetchDataWithFilter, fetchData, sendData } from "../api-client"

interface GetDesiredPositionParams extends FilterParams {
  name?: string
  description?: string
}

export interface DesiredPosition {
  id: string
  name: string
  label: string
  description: string
}

export interface PaginatedDesiredPositionResponse {
  data: DesiredPosition[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/**
 * Lista paginada e filtrada
 */
export async function getDesiredPositions(
  params: GetDesiredPositionParams = {},
): Promise<PaginatedDesiredPositionResponse> {
  return fetchDataWithFilter("/desired-positions", params)
}

/**
 * Lista completa (sem paginação)
 */
export async function getDesiredPositionsList(): Promise<DesiredPosition[]> {
  return fetchData("/desired-positions/list")
}

/**
 * Criar Desired Position
 */
export interface CreateDesiredPositionDto {
  name: string
  description: string
}

export async function createDesiredPosition(data: CreateDesiredPositionDto): Promise<DesiredPosition> {
  return sendData("/desired-positions", "POST", data)
}

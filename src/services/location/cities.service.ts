
import { type FilterParams, fetchDataWithFilter, fetchData, sendData, deleteData } from "../api-client";

// Ela estende FilterParams para incluir 'page' e 'limit' automaticamente.
interface GetCitiesParams extends FilterParams {
  name?: string;
}

// Define a interface para o objeto de cidade, para tipagem
export interface City {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Define a interface para a resposta paginada
export interface PaginatedCitiesResponse {
  data: City[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Busca uma lista paginada e filtrada de cidades.
 * Usa a função genérica fetchDataWithFilter para lidar com a lógica de query.
 */
export async function getCities(
  params: GetCitiesParams = {},
): Promise<PaginatedCitiesResponse> {
  return fetchDataWithFilter("/cities", params);
}

/**
 * Busca uma lista completa de cidades, sem paginação.
 * Usa a função genérica fetchData.
 */
export async function getCitiesList(): Promise<City[]> {
  return fetchData("/cities/list");
}

// Opcional: Função para criar uma nova cidade, usando a função sendData
export interface CreateCityDto {
  name: string;
}

export async function createCity(data: CreateCityDto): Promise<City> {
  return sendData("/cities", "POST", data);
}
export async function deleteCity(id: string): Promise<City> {
  return deleteData(`/cities/${id}`);
}


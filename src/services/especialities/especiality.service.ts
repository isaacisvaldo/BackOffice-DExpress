// src/services/specialties/specialty.service.ts

// Assume a importação de tipos comuns da sua camada de cliente de API
import {
  type FilterParams,
  fetchDataWithFilter,
  fetchData,
  sendData,
  deleteData,
} from "../api-client";

// Define a interface para o objeto de especialidade
export interface Specialty {
  id: string;
  name: string;
  label: string;
  createdAt: string;
  updatedAt: string;
}

// Estende FilterParams para incluir 'name' como parâmetro de filtro para a busca paginada
interface GetSpecialtiesParams extends FilterParams {
  name?: string;
}

// Define a interface para a resposta paginada da API, baseada em PaginatedDto
export interface PaginatedSpecialtiesResponse {
  data: Specialty[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Busca uma lista paginada e filtrada de especialidades.
 * Corresponde ao endpoint GET /specialties.
 * @param params Parâmetros de paginação e filtro.
 */
export async function getSpecialties(
  params: GetSpecialtiesParams = {},
): Promise<PaginatedSpecialtiesResponse> {
  return fetchDataWithFilter("/specialties", params);
}

/**
 * Busca uma lista completa de especialidades, sem paginação.
 * Corresponde ao endpoint GET /specialties/list.
 * @returns Um array com todos os objetos de especialidade.
 */
export async function getSpecialtiesList(): Promise<Specialty[]> {
  return fetchData("/specialties/list");
}

// Define o DTO para a criação de uma nova especialidade
export interface CreateSpecialtyDto {
  name: string;
  label: string;
}

/**
 * Cria uma nova especialidade.
 * Corresponde ao endpoint POST /specialties.
 * @param data O objeto de dados da nova especialidade.
 * @returns O objeto de especialidade criado.
 */
export async function createSpecialty(
  data: CreateSpecialtyDto,
): Promise<Specialty> {
  return sendData("/specialties", "POST", data);
}

/**
 * Busca uma especialidade específica pelo ID.
 * Corresponde ao endpoint GET /specialties/:id.
 * @param id O ID da especialidade.
 * @returns O objeto de especialidade encontrado.
 */
export async function getSpecialtyById(id: string): Promise<Specialty> {
  return fetchData(`/specialties/${id}`);
}

// Define o DTO para a atualização de uma especialidade
export interface UpdateSpecialtyDto {
  name?: string;
  label?: string;
}

/**
 * Atualiza uma especialidade existente.
 * Corresponde ao endpoint PATCH /specialties/:id.
 * @param id O ID da especialidade a ser atualizada.
 * @param data O objeto com os dados a serem atualizados.
 * @returns O objeto de especialidade atualizado.
 */
export async function updateSpecialty(
  id: string,
  data: UpdateSpecialtyDto,
): Promise<Specialty> {
  return sendData(`/specialties/${id}`, "PATCH", data);
}

/**
 * Remove uma especialidade existente.
 * Corresponde ao endpoint DELETE /specialties/:id.
 * @param id O ID da especialidade a ser removida.
 * @returns O objeto de especialidade removido.
 */
export async function deleteSpecialty(id: string): Promise<Specialty> {
  return deleteData(`/specialties/${id}`);
}

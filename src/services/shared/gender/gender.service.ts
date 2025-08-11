// src/services/gender/gender.service.ts

// Assume a importação de tipos comuns da sua camada de cliente de API
import { type FilterParams, fetchDataWithFilter, fetchData, sendData, deleteData } from "../../api-client";

// Define a interface para o objeto de gênero, correspondendo ao modelo da sua API
export interface Gender {
  id: string;
  name: string;
  label:string
  createdAt: string;
  updatedAt: string;
}

// Estende FilterParams para incluir 'name' como parâmetro de filtro
interface GetGendersParams extends FilterParams {
  name?: string;
}

// Define a interface para a resposta paginada da API
export interface PaginatedGendersResponse {
  data: Gender[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Busca uma lista paginada e filtrada de gêneros.
 * Corresponde ao endpoint GET /genders.
 * @param params Parâmetros de paginação e filtro.
 */
export async function getGenders(
  params: GetGendersParams = {},
): Promise<PaginatedGendersResponse> {
  return fetchDataWithFilter("/genders", params);
}

/**
 * Busca uma lista completa de gêneros, sem paginação.
 * Corresponde ao endpoint GET /genders/list.
 * @returns Um array com todos os objetos de gênero.
 */
export async function getGendersList(): Promise<Gender[]> {
  return fetchData("/genders/list");
}

// Define o DTO para a criação de um novo gênero
export interface CreateGenderDto {
  name: string;
  label:string;
}

/**
 * Cria um novo gênero.
 * Corresponde ao endpoint POST /genders.
 * @param data O objeto de dados do novo gênero.
 * @returns O objeto de gênero criado.
 */
export async function createGender(data: CreateGenderDto): Promise<Gender> {
  return sendData("/genders", "POST", data);
}

/**
 * Busca um gênero específico pelo ID.
 * Corresponde ao endpoint GET /genders/:id.
 * @param id O ID do gênero.
 * @returns O objeto de gênero encontrado.
 */
export async function getGenderById(id: string): Promise<Gender> {
  return fetchData(`/genders/${id}`);
}

// Define o DTO para a atualização de um gênero
export interface UpdateGenderDto {
  name?: string;
}

/**
 * Atualiza um gênero existente.
 * Corresponde ao endpoint PATCH /genders/:id.
 * @param id O ID do gênero a ser atualizado.
 * @param data O objeto com os dados a serem atualizados.
 * @returns O objeto de gênero atualizado.
 */
export async function updateGender(id: string, data: UpdateGenderDto): Promise<Gender> {
  return sendData(`/genders/${id}`, "PATCH", data);
}

/**
 * Remove um gênero existente.
 * Corresponde ao endpoint DELETE /genders/:id.
 * @param id O ID do gênero a ser removido.
 * @returns O objeto de gênero removido.
 */
export async function deleteGender(id: string): Promise<Gender> {
  
  return deleteData(`/genders/${id}`);
}

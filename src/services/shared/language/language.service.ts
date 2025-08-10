
import {
  type FilterParams,
  fetchDataWithFilter,
  fetchData,
  sendData,
  deleteData,
} from "../../api-client";

// Define a interface para o objeto de idioma
export interface Language {
  id: string;
  name: string;
  label: string;
  createdAt: string;
  updatedAt: string;
}

// Estende FilterParams para incluir 'name' como parâmetro de filtro para a busca paginada
interface GetLanguagesParams extends FilterParams {
  name?: string;
}

// Define a interface para a resposta paginada da API, baseada em PaginatedDto
export interface PaginatedLanguagesResponse {
  data: Language[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Busca uma lista paginada e filtrada de idiomas.
 * Corresponde ao endpoint GET /languages.
 * @param params Parâmetros de paginação e filtro.
 */
export async function getLanguages(
  params: GetLanguagesParams = {},
): Promise<PaginatedLanguagesResponse> {
  return fetchDataWithFilter("/languages", params);
}

/**
 * Busca uma lista completa de idiomas, sem paginação.
 * Corresponde ao endpoint GET /languages/list.
 * @returns Um array com todos os objetos de idioma.
 */
export async function getLanguagesList(): Promise<Language[]> {
  return fetchData("/languages/list");
}

// Define o DTO para a criação de um novo idioma
export interface CreateLanguageDto {
  name: string;
  label: string;
}

/**
 * Cria um novo idioma.
 * Corresponde ao endpoint POST /languages.
 * @param data O objeto de dados do novo idioma.
 * @returns O objeto de idioma criado.
 */
export async function createLanguage(
  data: CreateLanguageDto,
): Promise<Language> {
  return sendData("/languages", "POST", data);
}

/**
 * Busca um idioma específico pelo ID.
 * Corresponde ao endpoint GET /languages/:id.
 * @param id O ID do idioma.
 * @returns O objeto de idioma encontrado.
 */
export async function getLanguageById(id: string): Promise<Language> {
  return fetchData(`/languages/${id}`);
}

// Define o DTO para a atualização de um idioma
export interface UpdateLanguageDto {
  name?: string;
  label?: string;
}

/**
 * Atualiza um idioma existente.
 * Corresponde ao endpoint PATCH /languages/:id.
 * @param id O ID do idioma a ser atualizado.
 * @param data O objeto com os dados a serem atualizados.
 * @returns O objeto de idioma atualizado.
 */
export async function updateLanguage(
  id: string,
  data: UpdateLanguageDto,
): Promise<Language> {
  return sendData(`/languages/${id}`, "PATCH", data);
}

/**
 * Remove um idioma existente.
 * Corresponde ao endpoint DELETE /languages/:id.
 * @param id O ID do idioma a ser removido.
 * @returns O objeto de idioma removido.
 */
export async function deleteLanguage(id: string): Promise<Language> {
  return deleteData(`/languages/${id}`);
}
// Assumindo a importação de tipos comuns da sua camada de cliente de API
import {
  type FilterParams,
  fetchDataWithFilter,
  fetchData,
  sendData,
  deleteData,
} from '../api-client';

// Define a interface para o objeto de permissão
export interface Permission {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Define a interface para o objeto de perfil, correspondendo ao modelo da sua API
export interface Profile {
  id: string;
  name: string;
  label: string;
  description?: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

// Estende FilterParams para incluir 'name' ou 'label' como parâmetros de filtro
interface GetProfilesParams extends FilterParams {
  name?: string;
  label?: string;
}

// Define a interface para a resposta paginada da API
export interface PaginatedProfilesResponse {
  data: Profile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Busca uma lista paginada e filtrada de perfis.
 * Corresponde ao endpoint GET /profiles.
 * @param params Parâmetros de paginação e filtro.
 */
export async function getProfiles(
  params: GetProfilesParams = {},
): Promise<PaginatedProfilesResponse> {
  return fetchDataWithFilter('/profiles', params);
}

/**
 * Busca uma lista completa de perfis, sem paginação.
 * Corresponde ao endpoint GET /profiles/all.
 * @returns Um array com todos os objetos de perfil.
 */
export async function getProfilesList(): Promise<Profile[]> {
  return fetchData('/profiles/all');
}

// Define o DTO para a criação de um novo perfil
export interface CreateProfileDto {
  name: string;
  label: string;
  description?: string;
  permissions?: string[];
}

/**
 * Cria um novo perfil.
 * Corresponde ao endpoint POST /profiles.
 * @param data O objeto de dados do novo perfil.
 * @returns O objeto de perfil criado.
 */
export async function createProfile(data: CreateProfileDto): Promise<Profile> {
  return sendData('/profiles', 'POST', data);
}

/**
 * Busca um perfil específico pelo ID.
 * Corresponde ao endpoint GET /profiles/:id.
 * @param id O ID do perfil.
 * @returns O objeto de perfil encontrado.
 */
export async function getProfileById(id: string): Promise<Profile> {
  return fetchData(`/profiles/${id}`);
}

// Define o DTO para a atualização de um perfil
export interface UpdateProfileDto {
  name?: string;
  label?: string;
  description?: string;
  permissions?: string[];
}

/**
 * Atualiza um perfil existente.
 * Corresponde ao endpoint PATCH /profiles/:id.
 * @param id O ID do perfil a ser atualizado.
 * @param data O objeto com os dados a serem atualizados.
 * @returns O objeto de perfil atualizado.
 */
export async function updateProfile(
  id: string,
  data: UpdateProfileDto,
): Promise<Profile> {
  return sendData(`/profiles/${id}`, 'PATCH', data);
}

/**
 * Remove um perfil existente.
 * Corresponde ao endpoint DELETE /profiles/:id.
 * @param id O ID do perfil a ser removido.
 * @returns O objeto de perfil removido.
 */
export async function deleteProfile(id: string): Promise<Profile> {
  return deleteData(`/profiles/${id}`);
}

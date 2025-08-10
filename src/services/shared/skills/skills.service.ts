
import {
  type FilterParams,
  fetchDataWithFilter,
  fetchData,
  sendData,
  deleteData,
} from "../../api-client";

// Define a interface para o objeto de habilidade
export interface Skill {
  id: string;
  name: string;
  label: string;
  createdAt: string;
  updatedAt: string;
}

// Estende FilterParams para incluir 'name' como parâmetro de filtro para a busca paginada
interface GetSkillsParams extends FilterParams {
  name?: string;
}

// Define a interface para a resposta paginada da API, baseada em PaginatedDto
export interface PaginatedSkillsResponse {
  data: Skill[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Busca uma lista paginada e filtrada de habilidades.
 * Corresponde ao endpoint GET /skills.
 * @param params Parâmetros de paginação e filtro.
 */
export async function getSkills(
  params: GetSkillsParams = {},
): Promise<PaginatedSkillsResponse> {
  return fetchDataWithFilter("/skills", params);
}

/**
 * Busca uma lista completa de habilidades, sem paginação.
 * Corresponde ao endpoint GET /skills/list.
 * @returns Um array com todos os objetos de habilidade.
 */
export async function getSkillsList(): Promise<Skill[]> {
  return fetchData("/skills/list");
}

// Define o DTO para a criação de uma nova habilidade
export interface CreateSkillDto {
  name: string;
  label: string;
}

/**
 * Cria uma nova habilidade.
 * Corresponde ao endpoint POST /skills.
 * @param data O objeto de dados da nova habilidade.
 * @returns O objeto de habilidade criado.
 */
export async function createSkill(
  data: CreateSkillDto,
): Promise<Skill> {
  return sendData("/skills", "POST", data);
}

/**
 * Busca uma habilidade específica pelo ID.
 * Corresponde ao endpoint GET /skills/:id.
 * @param id O ID da habilidade.
 * @returns O objeto de habilidade encontrado.
 */
export async function getSkillById(id: string): Promise<Skill> {
  return fetchData(`/skills/${id}`);
}

// Define o DTO para a atualização de uma habilidade
export interface UpdateSkillDto {
  name?: string;
  label?: string;
}

/**
 * Atualiza uma habilidade existente.
 * Corresponde ao endpoint PATCH /skills/:id.
 * @param id O ID da habilidade a ser atualizada.
 * @param data O objeto com os dados a serem atualizados.
 * @returns O objeto de habilidade atualizado.
 */
export async function updateSkill(
  id: string,
  data: UpdateSkillDto,
): Promise<Skill> {
  return sendData(`/skills/${id}`, "PATCH", data);
}

/**
 * Remove uma habilidade existente.
 * Corresponde ao endpoint DELETE /skills/:id.
 * @param id O ID da habilidade a ser removida.
 * @returns O objeto de habilidade removido.
 */
export async function deleteSkill(id: string): Promise<Skill> {
  return deleteData(`/skills/${id}`);
}
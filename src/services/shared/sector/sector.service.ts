// src/services/sector/sector.service.ts

// Assumindo a importação de tipos comuns da sua camada de cliente de API
import {
  type FilterParams,
  fetchDataWithFilter,
  fetchData,
  sendData,
  deleteData,
} from '../../api-client';

// Define a interface para o objeto Sector
export interface Sector {
  id: string;
  name: string;
  label: string;
  createdAt: string;
  updatedAt: string;
}

// Estende FilterParams para incluir 'name' ou 'label' como parâmetros de filtro
interface GetSectorsParams extends FilterParams {
  name?: string;
  label?: string;
}

// Define a interface para a resposta paginada da API para setores
export interface PaginatedSectorsResponse {
  data: Sector[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Busca uma lista paginada e filtrada de setores.
 * Corresponde ao endpoint GET /sectors.
 * @param params Parâmetros de paginação e filtro.
 */
export async function getSectors(
  params: GetSectorsParams = {},
): Promise<PaginatedSectorsResponse> {
  return fetchDataWithFilter('/sectors', params);
}

/**
 * Busca uma lista completa de setores, sem paginação.
 * Corresponde ao endpoint GET /sectors/list.
 * @returns Um array com todos os objetos de setor.
 */
export async function getSectorsList(): Promise<Sector[]> {
  return fetchData('/sectors/list');
}

// Define o DTO para a criação de um novo setor
export interface CreateSectorDto {
  name: string;
  label: string;
}

/**
 * Cria um novo setor.
 * Corresponde ao endpoint POST /sectors.
 * @param data O objeto de dados do novo setor.
 * @returns O objeto de setor criado.
 */
export async function createSector(data: CreateSectorDto): Promise<Sector> {
  return sendData('/sectors', 'POST', data);
}

/**
 * Busca um setor específico pelo ID.
 * Corresponde ao endpoint GET /sectors/:id.
 * @param id O ID do setor.
 * @returns O objeto de setor encontrado.
 */
export async function getSectorById(id: string): Promise<Sector> {
  return fetchData(`/sectors/${id}`);
}

// Define o DTO para a atualização de um setor
export interface UpdateSectorDto {
  name?: string;
  label?: string;
}

/**
 * Atualiza um setor existente.
 * Corresponde ao endpoint PATCH /sectors/:id.
 * @param id O ID do setor a ser atualizado.
 * @param data O objeto com os dados a serem atualizados.
 * @returns O objeto de setor atualizado.
 */
export async function updateSector(
  id: string,
  data: UpdateSectorDto,
): Promise<Sector> {
  return sendData(`/sectors/${id}`, 'PATCH', data);
}

/**
 * Remove um setor existente.
 * Corresponde ao endpoint DELETE /sectors/:id.
 * @param id O ID do setor a ser removido.
 * @returns O objeto de setor removido.
 */
export async function deleteSector(id: string): Promise<Sector> {
  return deleteData(`/sectors/${id}`);
}
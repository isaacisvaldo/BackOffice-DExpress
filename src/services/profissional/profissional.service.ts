// src/services/professional/professional.service.ts

import {
  type FilterParams,
  fetchDataWithFilter,
  fetchData,
  sendData,
  deleteData,
} from "../api-client"; 


export interface Professional {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  identityNumber?: string;
  availabilityTypeId: string;
  experienceLevelId: string;
  applicationId?: string; // Pode ser opcional se o profissional puder existir sem aplicação inicial
  description?: string;
  expectedAvailability?: string; // Formato ISO 8601 string (e.g., "2025-12-31T23:59:59Z")
  hasCriminalRecord: boolean;
  hasMedicalCertificate: boolean;
  hasTrainingCertificate: boolean;
  locationId: string;
  genderId: string;
  birthDate: string; 
  maritalStatusId: string;
  hasChildren: boolean;
  knownDiseases?: string;
  desiredPositionId: string;
  expectedSalary: number;
  highestDegreeId: string;
  profileImage?: string; // URL da imagem ou similar
  isAvailable:boolean;
  location:any
  createdAt: string;
  updatedAt: string;
  // Arrays de IDs para relacionamentos muitos-para-muitos
  courseIds: string[];
  languageIds: string[];
  skillIds: string[];
}

// DTO para criação de um profissional (alinhado com CreateProfessionalDto do backend)
export interface CreateProfessionalDto {
  fullName: string;
  email: string;
  phoneNumber: string;
  identityNumber?: string;
  availabilityTypeId: string;
  experienceLevelId: string;
  applicationId?: string;
  description?: string;
  expectedAvailability?: string;
  hasCriminalRecord: boolean;
  hasMedicalCertificate: boolean;
  hasTrainingCertificate: boolean;
  locationId: string;
  genderId: string;
  birthDate: string;
  maritalStatusId: string;
  hasChildren: boolean;
  knownDiseases?: string;
  desiredPositionId: string;
  expectedSalary: number;
  highestDegreeId: string;
  profileImage?: any; // Blob, File, ou string de base64/URL, dependendo do upload
  courseIds: string[];
  languageIds: string[];
  skillIds: string[];
}

// DTO para atualização de um profissional (alinhado com UpdateProfessionalDto do backend)
export interface UpdateProfessionalDto {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  identityNumber?: string;
  availabilityTypeId?: string;
  experienceLevelId?: string;
  applicationId?: string;
  description?: string;
  expectedAvailability?: string;
  hasCriminalRecord?: boolean;
  hasMedicalCertificate?: boolean;
  hasTrainingCertificate?: boolean;
  locationId?: string;
  genderId?: string;
  birthDate?: string;
  maritalStatusId?: string;
  hasChildren?: boolean;
  knownDiseases?: string;
  desiredPositionId?: string;
  expectedSalary?: number;
  highestDegreeId?: string;
  profileImage?: any;
  courseIds?: string[];
  languageIds?: string[];
  skillIds?: string[];
}

// DTO de filtro para buscar profissionais (alinhado com FilterProfessionalDto do backend)
export interface FilterProfessionalDto extends FilterParams {
  name?: string;
  cityId?: string;
  districtId?: string;
  availabilityTypeId?: string;
  experienceLevelId?: string;
  specialtyId?: string;
  desiredPositionId?: string;
  genderId?: string;
  maritalStatusId?: string;
  highestDegreeId?: string;
  courseId?: string; // para buscar profissionais que tenham um curso específico
  languageId?: string; // para buscar profissionais que falem um idioma específico
  skillId?: string; // para buscar profissionais que tenham uma habilidade específica
  experienceId?: string; // Adicionado para filtrar experiência por um único ID
  hasCriminalRecord?: boolean;
  hasMedicalCertificate?: boolean;
  hasTrainingCertificate?: boolean;
  hasChildren?: boolean;
  // page e limit já estão em FilterParams
}

// Interface para a resposta paginada de profissionais
export interface PaginatedProfessionalsResponse {
  data: Professional[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}


/**
 * Cria um novo profissional.
 * Corresponde ao endpoint POST /professionals.
 * @param data O objeto de dados do novo profissional.
 * @returns O objeto de profissional criado.
 */
export async function createProfessional(
  data: CreateProfessionalDto,
): Promise<Professional> {
  return sendData("/professionals", "POST", data);
}

/**
 * Busca uma lista paginada e filtrada de profissionais.
 * Corresponde ao endpoint GET /professionals.
 * @param params Parâmetros de paginação e filtro.
 */
export async function getProfessionals(
  params: FilterProfessionalDto = {},
): Promise<PaginatedProfessionalsResponse> {
  return fetchDataWithFilter("/professionals", params);
}

/**
 * Busca um profissional específico pelo ID.
 * Corresponde ao endpoint GET /professionals/:id.
 * @param id O ID do profissional.
 * @returns O objeto de profissional encontrado.
 */
export async function getProfessionalById(id: string): Promise<Professional> {
  return fetchData(`/professionals/${id}`);
}

/**
 * Atualiza um profissional existente.
 * Corresponde ao endpoint PATCH /professionals/:id.
 * @param id O ID do profissional a ser atualizado.
 * @param data O objeto com os dados a serem atualizados.
 * @returns O objeto de profissional atualizado.
 */
export async function updateProfessional(
  id: string,
  data: UpdateProfessionalDto,
): Promise<Professional> {
  return sendData(`/professionals/${id}`, "PATCH", data);
}
/**
 * Atualiza o status de disponibilidade de um profissional.
 * Corresponde ao endpoint PATCH /professionals/:id.
 * @param id O ID do profissional a ser atualizado.
 * @param isAvailable O novo status de disponibilidade (true ou false).
 * @returns O objeto de profissional atualizado.
 */
export async function updateProfessionalAvailability(
  id: string,
  isAvailable: boolean,
): Promise<Professional> {
  return sendData(`/professionals/${id}/availability/${isAvailable}`, "PATCH", { });
}

/**
 * Remove um profissional existente.
 * Corresponde ao endpoint DELETE /professionals/:id.
 * @param id O ID do profissional a ser removido.
 * @returns O objeto de profissional removido.
 */
export async function deleteProfessional(id: string): Promise<Professional> {
  return deleteData(`/professionals/${id}`);
}
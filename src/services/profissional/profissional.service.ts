// src/services/professional/professional.service.ts

import type { Course, DesiredPosition, ExperienceLevel, Location, Gender, HighestDegree, Language, MaritalStatus, Skill } from "@/types/types";
import {
  type FilterParams,
  fetchDataWithFilter,
  fetchData,
  sendData,
  deleteData,
} from "../api-client";

export interface ProfessionalSkill {
  professionalId: string;
  skillId: string;
  createdAt: string;
  updatedAt: string;
  skill: Skill;
}

export interface ProfessionalLanguage {
  professionalId: string;
  languageId: string;
  level?: string;
  language: Language;
}

export interface ProfessionalCourse {
  professionalId: string;
  courseId: string;
  createdAt: string;
  updatedAt: string;
  course: Course;
}
interface ProfessionalExperience {
  id?: string;
  professionalId?: string;
  localTrabalho: string;
  tempo: string;
  cargo: string;
  description?: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
}
export interface Professional {
  id: string;
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
  profileImage?: string;
  isAvailable: boolean;

  createdAt: string;
  updatedAt: string;

  desiredPosition?: DesiredPosition;
  gender?: Gender;
  location: Location;
  experienceLevel: ExperienceLevel;
  maritalStatus: MaritalStatus;
  highestDegree: HighestDegree;

  // AQUI está a correção: use as interfaces de ligação
  professionalSkills: ProfessionalSkill[];
  professionalLanguages: ProfessionalLanguage[];
  professionalCourses: ProfessionalCourse[];

  ProfessionalExperience: ProfessionalExperience[];
  contracts: any;
}

export interface CreateProfessionalExperienceDto {
  localTrabalho: string ;
  cargo: string;
  tempo?: string ;
  description?: string; // Adicione o '?' aqui
  startDate?: string ; // Adicione o '?' aqui

  endDate?: string ; // Adicione o '?' aqui
}
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
  profileImage?: any;
  courseIds: string[];
  languageIds: string[];
  skillIds: string[];
}

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

export interface FilterProfessionalDto extends FilterParams {
  name?: string;
  email?: string;
  cityId?: string;
  districtId?: string;
  availabilityTypeId?: string;
  experienceLevelId?: string;
  specialtyId?: string;
  desiredPositionId?: string;
  genderId?: string;
  maritalStatusId?: string;
  highestDegreeId?: string;
  courseId?: string;
  languageId?: string;
  skillId?: string;
  experienceId?: string;
  hasCriminalRecord?: boolean;
  hasMedicalCertificate?: boolean;
  hasTrainingCertificate?: boolean;
  hasChildren?: boolean;
  createdAtStart?: string;
  createdAtEnd?: string;
}

export interface PaginatedProfessionalsResponse {
  data: Professional[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}


export async function createProfessional(
  data: CreateProfessionalDto,
): Promise<Professional> {
  return sendData("/professionals", "POST", data);
}
export async function dropdownProfessionals(): Promise<Professional[]> {
  return fetchData("/professionals/dropdown");
}

export async function addExperienceToProfessional(
  data: CreateProfessionalExperienceDto,
  id: string
): Promise<Professional> {
  return sendData(`/professionals/${id}/experiences`, "POST", data);
}

export async function getProfessionals(
  params: FilterProfessionalDto = {},
): Promise<PaginatedProfessionalsResponse> {
  return fetchDataWithFilter("/professionals", params);
}

export async function getProfessionalById(id: string): Promise<Professional> {
  return fetchData(`/professionals/${id}`);
}

export async function getProfessionalByEmail(email: string): Promise<Professional> {
  return fetchData(`/professionals/by-email/${email}`);
}

export async function updateProfessional(
  id: string,
  data: UpdateProfessionalDto,
): Promise<Professional> {
  return sendData(`/professionals/${id}`, "PATCH", data);
}

export async function updateProfessionalAvailability(
  id: string,
  isAvailable: boolean,
): Promise<Professional> {
  return sendData(`/professionals/${id}/availability/${isAvailable}`, "PATCH", {});
}

export async function deleteProfessional(id: string): Promise<Professional> {
  return deleteData(`/professionals/${id}`);
}

/**
 * Atualiza a URL da imagem de perfil de um profissional.
 * @param id O ID do profissional.
 * @param imageUrl A nova URL da imagem.
 * @returns O objeto Professional atualizado.
 */
export async function updateProfessionalImageUrl(
  id: string,
  imageUrl: string,
): Promise<Professional> {
  return sendData(`/professionals/${id}/image-url`, "PATCH", { imageUrl });
}

/**
 * Remove uma experiência de um profissional.
 * @param professionalId O ID do profissional.
 * @param experienceId O ID da experiência a ser removida.
 * @returns O objeto da experiência removida.
 */
export async function removeExperienceFromProfessional(
  professionalId: string,
  experienceId: string,
): Promise<ProfessionalExperience> {
  return deleteData(`/professionals/${professionalId}/experiences/${experienceId}`);
}

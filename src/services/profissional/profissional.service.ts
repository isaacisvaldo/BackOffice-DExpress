// src/services/professional/professional.service.ts

import type { DesiredPosition } from "@/types/types";
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
  desiredPosition:DesiredPosition
  expectedSalary: number;
  highestDegreeId: string;
  profileImage?: string;
  isAvailable:boolean;
  location:any;
  createdAt: string;
  updatedAt: string;
  courseIds: string[];
  languageIds: string[];
  skillIds: string[];
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
  return sendData(`/professionals/${id}/availability/${isAvailable}`, "PATCH", { });
}

export async function deleteProfessional(id: string): Promise<Professional> {
  return deleteData(`/professionals/${id}`);
}
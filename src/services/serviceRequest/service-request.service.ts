

import type { Location } from "@/types/types";
import {
  type FilterParams,
  fetchDataWithFilter,
  fetchData,
  sendData,
  deleteData,
} from "../api-client";
import type { Package } from "../client/company/package/package.service";
import type { Contract } from "../contract/contract.service";
import type { Professional } from "../profissional/profissional.service";
import type { Sector } from "../sector/sector.service";

const API_BASE_PATH = "/service-requests";
// src/types/types.ts (ou onde você define seus tipos)


export const UserType = {
  INDIVIDUAL: 'INDIVIDUAL',
  CORPORATE: 'CORPORATE',
} as const;

export type UserType = typeof UserType[keyof typeof UserType];

export const StatusRequest = {
  PENDING: 'PENDING',
  IN_REVIEW: 'IN_REVIEW',
  PLAN_OFFERED: 'PLAN_OFFERED',
  CONTRACT_GENERATED: 'CONTRACT_GENERATED',
  COMPLETED: 'COMPLETED',
  REJECTED: 'REJECTED',
  APPROVED: 'APPROVED',

} as const;
export const ServiceFrequency = {
    MONTHLY: 'MONTHLY',
    BIMONTHLY: 'BIMONTHLY',
    QUARTERLY: 'QUARTERLY',
    SEMIANNUALLY: 'SEMIANNUALLY',
    ANNUALLY: 'ANNUALLY',
    BIENNIALLY: 'BIENNIALLY',
} as const;

// Extrair os tipos do objeto
export type ServiceFrequency = typeof ServiceFrequency[keyof typeof ServiceFrequency];

export type StatusRequest = typeof StatusRequest[keyof typeof StatusRequest];

export interface ServiceRequest {
  id: string;
  requesterType: UserType;
  requesterEmail: string;
  requesterPhoneNumber?: string;
  individualRequesterName?: string;
  individualIdentityNumber?: string;
  individualAddress?: string;
  individualUserId?: string;
  companyRequesterName?: string;
  companyNif?: string;
  companyAddress?: string;
  companyDistrictId?: string;
  companySectorId?: string;
  description: string;
  serviceFrequency:ServiceFrequency 
  createdAt: string;
  status: StatusRequest;
  planId?: string;
  professional:Professional;
  package:Package
  location:Location
  companySector:Sector
  professionalId?: string;
  individualClientId?: string;
  companyClientId?: string;
}

export interface CreateServiceRequestDto {
  requesterType: UserType;
  requesterEmail: string;
  requesterPhoneNumber?: string;
  individualRequesterName?: string;
  individualIdentityNumber?: string;
  individualAddress?: string;
  individualUserId?: string;
  companyRequesterName?: string;
  companyNif?: string;
  companyAddress?: string;
  companyDistrictId?: string;
  companySectorId?: string;
  description: string;
  startDate: string;
  endDate: string;
  planId?: string;
  professionalId?: string;
}
interface CreateContractInRequestDto{
    companyName: string
  nif: string
  phone: string
  fullName: string
  identityNumber: string
  title: string
  description: string
  clientType: UserType
  individualClientId?: string
  companyClientId?: string
  professionalId?: string
  professionalIds: string[]
  packageId?: string
  desiredPositionId?: string
  location: { cityId: string; districtId: string; street: string }
  agreedValue: number
  discountPercentage: number
  finalValue: number
  paymentTerms: string
  startDate: string
  endDate: string
  notes: string
  status: string

}

export interface UpdateServiceRequestDto {
  status?: StatusRequest;
  requesterEmail?: string;
  // Outros campos que podem ser atualizados
}

export interface PaginatedServiceRequestsResponse {
  data: ServiceRequest[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FilterServiceRequestsDto extends FilterParams {
  search?: string;
  requesterType?: UserType;
  status?: StatusRequest;
  description?: string;
  // Adicione outros parâmetros de filtro aqui
}

/**
 * Cria uma nova solicitação de serviço.
 * @param data O DTO com os dados da solicitação.
 * @returns Uma Promise com a solicitação criada.
 */
export async function createServiceRequest(
  data: CreateServiceRequestDto,
): Promise<ServiceRequest> {
  return sendData(`${API_BASE_PATH}`, "POST", data);
}

/**
 * Busca todas as solicitações de serviço com filtros e paginação.
 * @param params Os parâmetros de filtro (opcionais).
 * @returns Uma Promise com a resposta paginada de solicitações.
 */
export async function getServiceRequests(
  params: FilterServiceRequestsDto = {},
): Promise<PaginatedServiceRequestsResponse> {
  return fetchDataWithFilter(`${API_BASE_PATH}`, params);
}

/**
 * Busca uma solicitação de serviço pelo seu ID.
 * @param id O ID da solicitação.
 * @returns Uma Promise com a solicitação encontrada.
 */
export async function getServiceRequestById(id: string): Promise<ServiceRequest> {
  return fetchData(`${API_BASE_PATH}/${id}`);
}

/**
 * Atualiza uma solicitação de serviço existente.
 * @param id O ID da solicitação a ser atualizada.
 * @param data O DTO com os dados para atualização.
 * @returns Uma Promise com a solicitação atualizada.
 */
export async function updateServiceRequest(
  id: string,
  data: UpdateServiceRequestDto,
): Promise<ServiceRequest> {
  return sendData(`${API_BASE_PATH}/${id}`, "PATCH", data);
}

export async function updateStatusServiceRequest(id: string, status: StatusRequest) {
  return sendData(`${API_BASE_PATH}/${id}/status`, "PATCH", { status });
  
}

export async function createContractInRequest(
  id: string,
  data: CreateContractInRequestDto,
):Promise<Contract> {
  return sendData(`${API_BASE_PATH}/${id}/contract`, "POST", data);
}


/**
 * Remove uma solicitação de serviço.
 * @param id O ID da solicitação a ser removida.
 * @returns Uma Promise com a solicitação removida.
 */
export async function deleteServiceRequest(id: string): Promise<ServiceRequest> {
  return deleteData(`${API_BASE_PATH}/${id}`);
}
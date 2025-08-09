// src/services/location/districts.service.ts
import { fetchDataWithFilter, fetchData, sendData } from "../api-client";
import type { FilterParams } from "../api-client";

// ✅ O tipo de dado do Distrito com o objeto da Cidade
export interface DistrictWithCity {
  id: string;
  name: string;
  cityId: string;
  createdAt: string;
  updatedAt: string;
  city: {
    id: string;
    name: string;
  }
}

// Define a interface para a resposta paginada
export interface PaginatedDistrictsResponse {
  data: DistrictWithCity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface GetDistrictsParams extends FilterParams {
  search?: string;
  cityId?: string;
}

export async function getDistricts(
  params: GetDistrictsParams = {},
): Promise<PaginatedDistrictsResponse> {
  return fetchDataWithFilter("/districts", params);
}

export async function getDistrictsList(): Promise<DistrictWithCity[]> {
  return fetchData("/districts/list");
}

export interface CreateDistrictDto {
  name: string;
  cityId: string;
}

export async function createDistrict(data: CreateDistrictDto): Promise<DistrictWithCity> {
  return sendData("/districts", "POST", data);
}

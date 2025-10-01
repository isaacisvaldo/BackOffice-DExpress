import { fetchData, fetchDataWithFilter } from "../api-client";

// Define a interface para os dados do sumário do dashboard
export interface IDashboardSummary {
    totalProfessionals: number,
    totalClients: number,
    activeServices: number,
    canceledRequests: number,
}

// Define a interface para os dados de crescimento
export interface IGrowthData {
    date: string;
    profissionais: number;
    clientes_fisica: number;
    clientes_empresa: number;
}

// Define a interface para a resposta da API de crescimento
export interface IGrowthDataResponse {
    success: boolean;
    data: IGrowthData[];
}

// Interfaces para a nova função:
// 1. O tipo de dado para cada item do array de empresas
export interface ICompaniesBySector {
    sector: string;
    companies: number;
}

// 2. O tipo de dado para a resposta completa da API
export interface ICompaniesBySectorResponse {
    success: boolean;
    data: ICompaniesBySector[];
}


/**
 * Busca o sumário geral do dashboard.
 * Usa a função genérica `fetchData` para uma requisição GET simples.
 */
export async function getDashboardSummary(): Promise<IDashboardSummary> {
    return fetchData("/dashboard/summary");
}

/**
 * Busca os dados de crescimento de clientes e profissionais em um determinado período.
 * Usa a função genérica `fetchDataWithFilter` para lidar com o parâmetro de query 'range'.
 */
export async function getGrowthData(range: string): Promise<IGrowthDataResponse> {
    return fetchDataWithFilter("/dashboard/growth/clients-profissionals/registrations", { range });
}

/**
 * Busca a contagem de empresas por setor.
 * Usa a função genérica `fetchData` para uma requisição GET simples.
 */
export async function getCompaniesBySector(): Promise<ICompaniesBySectorResponse> {
    return fetchData("/dashboard/companies-by-sector");
}

export async function getClientsBySegment(): Promise<any> {
    return fetchData("/dashboard/clients-by-segment");
}
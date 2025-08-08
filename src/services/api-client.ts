// src/services/api-client.ts

// NOTA: Certifique-se de que a biblioteca de toast
// que você está usando (como 'react-hot-toast') esteja instalada em seu projeto.
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || "";

/**
 * Interface genérica para parâmetros de consulta, incluindo paginação.
 * @param page O número da página (opcional, padrão 1).
 * @param limit O limite de itens por página (opcional, padrão 10).
 * @param key Qualquer outro parâmetro de filtro.
 */
export interface FilterParams {
  page?: number;
  limit?: number;
  [key: string]: string | number | boolean | string[] | undefined | null;
}

/**
 * Função auxiliar para tratar a resposta da API de forma centralizada.
 * Exibe um toast de sucesso ou de erro e lança um erro, se necessário.
 * @param response A resposta do fetch.
 * @param successMessage A mensagem a ser exibida em caso de sucesso (opcional).
 * @returns A resposta se for bem-sucedida.
 */
async function handleResponse(response: Response, successMessage?: string, method?: string): Promise<Response> {
  if (response.ok) {
    // ✅ VERIFICA SE A REQUISIÇÃO NÃO É UM GET
    // Se a requisição foi bem-sucedida e não é um GET, exibe o toast.
    // O status 204 também é considerado uma operação bem-sucedida.
    if (method !== 'GET') {
      toast.success(successMessage || 'Operação concluída com sucesso!');
    }
  } else {
    try {
      const errorBody = await response.json();
      const errorMessage = errorBody?.message || "Ocorreu um erro desconhecido.";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } catch (e) {
      const errorMessage = "Ocorreu um erro inesperado ao se comunicar com a API.";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }
  return response;
}

/**
 * Função genérica para buscar dados de um endpoint com filtros de consulta (GET).
 * Perfeito para listagens paginadas e com pesquisa.
 * @param endpoint O caminho do endpoint da API (ex: '/cities', '/districts').
 * @param params Um objeto de parâmetros de filtro.
 * @returns Os dados JSON da resposta da API.
 */
export async function fetchDataWithFilter<T extends FilterParams>(
  endpoint: string,
  params: T = {} as T,
) {
  const query = new URLSearchParams();

  for (const key in params) {
    const value = params[key];
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => query.append(key, String(item)));
      } else {
        query.append(key, String(value));
      }
    }
  }

  const response = await fetch(`${API_URL}${endpoint}?${query.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: 'include'
  });

  await handleResponse(response);
  return response.json();
}

/**
 * Função genérica para buscar dados de um endpoint sem filtros ou paginação (GET).
 * Ideal para buscar listas completas para dropdowns.
 * @param endpoint O caminho do endpoint da API (ex: '/cities/list').
 * @returns Os dados JSON da resposta da API.
 */
export async function fetchData(endpoint: string) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: 'include'
  });

  await handleResponse(response);
  return response.json();
}

/**
 * Função genérica para enviar dados à API (POST, PUT, PATCH).
 * @param endpoint O caminho do endpoint da API (ex: '/professionals').
 * @param method O método HTTP (POST, PUT, PATCH).
 * @param body Os dados a serem enviados.
 * @returns Os dados JSON da resposta da API.
 */
export async function sendData<T>(endpoint: string, method: "POST" | "PUT" | "PATCH", body: T) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: 'include'
  });

  await handleResponse(response, "Dados enviados com sucesso!");
  return response.json();
}

/**
 * Função genérica para deletar um recurso da API (DELETE).
 * Não envia um corpo de dados na requisição.
 * @param endpoint O caminho do endpoint da API (ex: '/professionals/123').
 * @returns Os dados JSON da resposta da API (geralmente um objeto de sucesso ou vazio).
 */
export async function deleteData(endpoint: string) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: 'include'
  });

  await handleResponse(response, "Recurso removido com sucesso!");

  // A resposta de um DELETE pode ser um 204 No Content, então é importante verificar
  // se há um corpo de resposta antes de tentar fazer o parse.
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  }

  return {};
}

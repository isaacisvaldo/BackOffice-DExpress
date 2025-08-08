// src/services/api-client.ts

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
    // ✅ Inclui cookies na requisição para autenticação.
    credentials: 'include'
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(errorBody.message || "Erro ao buscar dados da API");
  }

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
    // ✅ Inclui cookies na requisição para autenticação.
    credentials: 'include'
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(errorBody.message || "Erro ao buscar dados da API");
  }

  return response.json();
}

/**
 * Função genérica para enviar dados à API (POST, PUT, PATCH, DELETE).
 * @param endpoint O caminho do endpoint da API (ex: '/professionals').
 * @param method O método HTTP (POST, PUT, PATCH, DELETE).
 * @param body Os dados a serem enviados.
 * @returns Os dados JSON da resposta da API.
 */
export async function sendData<T>(endpoint: string, method: string, body: T) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    // ✅ Inclui cookies na requisição para autenticação.
    credentials: 'include'
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(errorBody.message || `Erro ao executar ${method}`);
  }

  return response.json();
}

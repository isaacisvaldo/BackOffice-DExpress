import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || "";

export interface FilterParams {
  page?: number;
  limit?: number;
  [key: string]: string | number | boolean | string[] | undefined | null;
}

async function handleResponse(
  response: Response,
  successMessage?: string,
  method?: string,
  showSuccessToastForGet: boolean = false
): Promise<Response> {
  if (response.ok) {
    if (method !== 'GET' || showSuccessToastForGet) {
      toast.success(successMessage || 'Operação concluída com sucesso!');
    }
  } else {
    try {
      const errorBody = await response.json();
      const errorMessage = errorBody?.message || "Ocorreu um erro desconhecido.";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } catch {
      const errorMessage = "Ocorreu um erro inesperado ao se comunicar com a API.";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }
  return response;
}

async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
  successMessage?: string,
  method?: string,
  showSuccessToastForGet: boolean = false
) {
  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  };

  const response = await fetch(`${API_URL}${endpoint}`, defaultOptions);
  await handleResponse(response, successMessage, method, showSuccessToastForGet);
  return response;
}

export async function fetchDataWithFilter<T extends FilterParams>(
  endpoint: string,
  params: T = {} as T,
  showSuccessToast: boolean = false
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

  const res = await apiFetch(
    `${endpoint}?${query.toString()}`,
    { method: 'GET' },
    "Dados listados com sucesso!",
    "GET",
    showSuccessToast
  );
  return res.json();
}

export async function fetchData(endpoint: string, showSuccessToast: boolean = false) {
  const res = await apiFetch(
    endpoint,
    { method: 'GET' },
    "Dados carregados com sucesso!",
    "GET",
    showSuccessToast
  );
  return res.json();
}

export async function sendData<T>(endpoint: string, method: "POST" | "PUT" | "PATCH", body: T) {
  const res = await apiFetch(
    endpoint,
    { method, body: JSON.stringify(body) },
    "Dados enviados com sucesso!",
    method
  );
  return res.json();
}

export async function deleteData(endpoint: string) {
  const res = await apiFetch(
    endpoint,
    { method: 'DELETE' },
    "Recurso removido com sucesso!",
    "DELETE"
  );

  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }
  return {};
}
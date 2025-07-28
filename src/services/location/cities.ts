const API_URL = import.meta.env.VITE_API_URL || ""

interface GetCitiesParams {
  page?: number
  limit?: number
  name?: string
}

export default async function getCities(params: GetCitiesParams = {}) {
  const query = new URLSearchParams()

  if (params.page) query.append("page", String(params.page))
  if (params.limit) query.append("limit", String(params.limit))
  if (params.name) query.append("name", params.name)

  const response = await fetch(`${API_URL}/cities?${query.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  if (!response.ok) {
    throw new Error("Erro ao buscar cidades")
  }

  return response.json()
}

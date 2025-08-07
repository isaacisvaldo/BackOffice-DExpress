
const API_URL = import.meta.env.VITE_API_URL 

export async function create(data: any): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/professionals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), 
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.message || "Erro ao criar profissional.";
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || "Erro inesperado ao criar profissional.");
  }
}



interface FilterProfessionalDto {
  name?: string;
  cityId?: string;
  districtId?: string;
  availabilityType?: string;
  experienceLevel?: string;
  desiredPosition?: string;
  email?: string;
  specialtyId?: string;
  page?: number;
  limit?: number;
}

export async function listAll(filters: FilterProfessionalDto): Promise<any> {
  try {
    const queryParams = new URLSearchParams();
    if (filters.email) {
      queryParams.append('email', filters.email);
    }
    if (filters.desiredPosition && filters.desiredPosition !== 'all') {
      queryParams.append('desiredPosition', filters.desiredPosition);
    }
    if (filters.name) {
      queryParams.append('name', filters.name);
    }
    
    if (filters.cityId) {
      queryParams.append('cityId', filters.cityId);
    }
    if (filters.districtId) {
      queryParams.append('districtId', filters.districtId);
    }
    
    if (filters.availabilityType && filters.availabilityType !== 'all') {
      queryParams.append('availabilityType', filters.availabilityType);
    }
    if (filters.experienceLevel && filters.experienceLevel !== 'all') {
      queryParams.append('experienceLevel', filters.experienceLevel);
    }

     if (filters.specialtyId && filters.specialtyId !== 'all') {
      queryParams.append('specialtyId', filters.specialtyId);
    }

    if (filters.page) {
      queryParams.append('page', String(filters.page));
    }
    if (filters.limit) {
      queryParams.append('limit', String(filters.limit));
    }

    const queryString = queryParams.toString();
    const url = `${API_URL}/professionals${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.message || "Erro ao listar profissionais.";
      throw new Error(errorMessage);
    }

    // Retorna a resposta completa da API, que deve incluir os dados e a paginação
    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || "Erro inesperado ao listar profissionais.");
  }
}
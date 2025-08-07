const API_BASE_URL = 'http://localhost:3000/api';

// Tipos e interfaces
export type EstadoDocumento = 'activo' | 'inactivo' | 'archivado';

export interface Documento {
  id_archivo: number;
  nombre_archivo: string;
  extension: string;
  estado: EstadoDocumento;
  fecha_subida: string;
  tamaño: string;
  url: string;
}

export interface User {
  id: string;
  nombre: string;
  email: string;
  // Agrega más campos según necesites
}

// Función base para llamadas API
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// API para documentos (existente)
export const documentsAPI = {
  getAll: async (): Promise<Documento[]> => {
    return fetchAPI('/archivo');
  },

  upload: async (formData: FormData): Promise<Documento> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/documents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al subir documento');
    }

    return response.json();
  },

  update: async (id: string, data: { nombre_archivo: string; estado: string }): Promise<Documento> => {
    return fetchAPI(`/documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    await fetchAPI(`/documents/${id}`, {
      method: 'DELETE',
    });
  },
};

// Nueva API para usuarios
export const usersAPI = {
  register: async (userData: {
    nombre: string;
    email: string;
    password: string;
  }): Promise<User> => {
    return fetchAPI('/usuario/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<{ token: string; user: User }> => {
    return fetchAPI('/usuario/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  getProfile: async (): Promise<User> => {
    return fetchAPI('/auth/profile');
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    return fetchAPI('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};
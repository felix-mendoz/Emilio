const API_BASE_URL = 'http://localhost:3000';

// Tipos e interfaces
export type EstadoDocumento = 'activo' | 'inactivo' | 'archivado';

export interface Documento {
  id: string;
  nombre_archivo: string;
  extension: string;
  estado: EstadoDocumento;
  fecha_subida: string;
  tamaño: string;
  url: string;
  usuario_id: string;
}

export interface User {
  id: string;
  nombre: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
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
    throw new Error(errorData.message || `Error ${response.status}`);
  }

  return response.json();
}

// API para documentos
export const documentsAPI = {
  getAll: async (): Promise<Documento[]> => {
    return fetchAPI('/documents');
  },

  upload: async (formData: FormData, userId: string): Promise<Documento> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/documents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error al subir documento');
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

// API para usuarios (completa con register y login)
export const usersAPI = {
  register: async (userData: {
    nombre: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    return fetchAPI('/api/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    return fetchAPI('/api/login', {
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

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> => {
    await fetchAPI('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  listUsers: async (): Promise<User[]> => {
    return fetchAPI('/users');
  }
};

// Función para verificar token
export const verifyToken = async (): Promise<boolean> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch (error) {
    return false;
  }
};
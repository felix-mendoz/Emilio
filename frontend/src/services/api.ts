// services/api.ts

const API_BASE_URL = 'http://localhost:3000';

/**
 * Tipos de datos unificados
 */
export type EstadoDocumento = 'activo' | 'inactivo' | 'archivado';

export interface Documento {
  id: string;
  nombre_archivo: string;
  extension: string;
  tamaño: string;
  estado: EstadoDocumento;
  fecha_subida: string;
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

export interface Materia {
  id: string;
  nombre: string;
  codigo: string;
  profesor_id: string | null;
  grupo_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Grupo {
  id: string;
  nombre: string;
  nivel: string;
  estudiantes?: Estudiante[]; 
  capacidad: number;
  created_at: string;
  updated_at: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'profesor' | 'estudiante' | 'admin';
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface Estudiante extends Usuario {
  grupo_id: string | null;
}

export interface MateriaWithRelations extends Materia {
  profesor?: Usuario;
  grupo?: Grupo;
}

export interface GrupoWithRelations extends Grupo {
  estudiantes?: Estudiante[];
  materias?: Materia[];
}

// Helper functions
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken') || localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

/**
 * API para gestión de documentos
 */
export const documentsAPI = {
  getAll: async (userId: string): Promise<Documento[]> => {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/documents`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Documento[]>(response);
  },

  getById: async (id: string): Promise<Documento> => {
    const response = await fetch(`${API_BASE_URL}/api/documents/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Documento>(response);
  },

  upload: async (formData: FormData, userId: string): Promise<Documento> => {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/documents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('token')}`,
      },
      body: formData,
    });
    return handleResponse<Documento>(response);
  },

  update: async (id: string, updates: Partial<Documento>): Promise<Documento> => {
    const response = await fetch(`${API_BASE_URL}/api/documents/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    return handleResponse<Documento>(response);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/documents/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  },

  download: async (id: string): Promise<Blob> => {
    const response = await fetch(`${API_BASE_URL}/api/documents/${id}/download`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.blob();
  },
};

/**
 * API para gestión académica (Materias y Grupos)
 */
export const academicAPI = {
  // Materias
  getMaterias: async (): Promise<MateriaWithRelations[]> => {
    const response = await fetch(`${API_BASE_URL}/api/materias`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<MateriaWithRelations[]>(response);
  },

  getMateriaById: async (id: string): Promise<MateriaWithRelations> => {
    const response = await fetch(`${API_BASE_URL}/api/materias/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<MateriaWithRelations>(response);
  },

  createMateria: async (materia: Omit<Materia, 'id' | 'created_at' | 'updated_at'>): Promise<Materia> => {
    const response = await fetch(`${API_BASE_URL}/api/materias`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(materia),
    });
    return handleResponse<Materia>(response);
  },

  updateMateria: async (
    id: string,
    updates: Partial<Omit<Materia, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<Materia> => {
    const response = await fetch(`${API_BASE_URL}/api/materias/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    return handleResponse<Materia>(response);
  },

  deleteMateria: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/materias/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  },

  // Grupos
  getGrupos: async (): Promise<GrupoWithRelations[]> => {
    const response = await fetch(`${API_BASE_URL}/api/grupos`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<GrupoWithRelations[]>(response);
  },

  getGrupoById: async (id: string): Promise<GrupoWithRelations> => {
    const response = await fetch(`${API_BASE_URL}/api/grupos/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<GrupoWithRelations>(response);
  },

  createGrupo: async (grupo: Omit<Grupo, 'id' | 'created_at' | 'updated_at'>): Promise<Grupo> => {
    const response = await fetch(`${API_BASE_URL}/api/grupos`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(grupo),
    });
    return handleResponse<Grupo>(response);
  },

  updateGrupo: async (
    id: string,
    updates: Partial<Omit<Grupo, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<Grupo> => {
    const response = await fetch(`${API_BASE_URL}/api/grupos/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    return handleResponse<Grupo>(response);
  },

  deleteGrupo: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/grupos/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  },

  addEstudiantesToGrupo: async (grupoId: string, estudiantesIds: string[]): Promise<GrupoWithRelations> => {
    const response = await fetch(`${API_BASE_URL}/api/grupos/${grupoId}/estudiantes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ estudiantesIds }),
    });
    return handleResponse<GrupoWithRelations>(response);
  },

  removeEstudianteFromGrupo: async (grupoId: string, estudianteId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/grupos/${grupoId}/estudiantes/${estudianteId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  },

  // Usuarios
  getProfesores: async (): Promise<Usuario[]> => {
    const response = await fetch(`${API_BASE_URL}/api/usuarios?rol=profesor`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Usuario[]>(response);
  },

  getEstudiantes: async (): Promise<Estudiante[]> => {
    const response = await fetch(`${API_BASE_URL}/api/usuarios?rol=estudiante`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Estudiante[]>(response);
  },

  getEstudiantesSinGrupo: async (): Promise<Estudiante[]> => {
    const response = await fetch(`${API_BASE_URL}/api/usuarios?rol=estudiante&sin_grupo=true`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Estudiante[]>(response);
  },

  // Relaciones
  asignarMateriaAGrupo: async (materiaId: string, grupoId: string): Promise<Materia> => {
    const response = await fetch(`${API_BASE_URL}/api/materias/${materiaId}/grupo`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ grupoId }),
    });
    return handleResponse<Materia>(response);
  },

  desasignarMateriaDeGrupo: async (materiaId: string): Promise<Materia> => {
    const response = await fetch(`${API_BASE_URL}/api/materias/${materiaId}/grupo`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<Materia>(response);
  },

  asignarProfesorAMateria: async (materiaId: string, profesorId: string): Promise<Materia> => {
    const response = await fetch(`${API_BASE_URL}/api/materias/${materiaId}/profesor`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ profesorId }),
    });
    return handleResponse<Materia>(response);
  },

  desasignarProfesorDeMateria: async (materiaId: string): Promise<Materia> => {
    const response = await fetch(`${API_BASE_URL}/api/materias/${materiaId}/profesor`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<Materia>(response);
  },
};

/**
 * API para autenticación
 */
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<AuthResponse>(response);
  },

  register: async (userData: Omit<Usuario, 'id' | 'created_at' | 'updated_at'> & { password: string }): Promise<Usuario> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse<Usuario>(response);
  },

  getCurrentUser: async (): Promise<Usuario> => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Usuario>(response);
  },

  updateUser: async (updates: Partial<Usuario>): Promise<Usuario> => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    return handleResponse<Usuario>(response);
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  },
};

/**
 * Helper para verificar token
 */
export const verifyToken = async (): Promise<boolean> => {
  try {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
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

/**
 * Helper para subida de archivos genérico
 */
export const uploadFile = async (file: File, endpoint: string, additionalData: Record<string, any> = {}): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  
  for (const key in additionalData) {
    formData.append(key, additionalData[key]);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('token')}`,
    },
    body: formData,
  });
  return handleResponse(response);
};
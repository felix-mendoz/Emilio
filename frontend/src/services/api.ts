// services/api.ts
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Tipos de datos unificados
 */
export type EstadoDocumento = 'activo' | 'inactivo' | 'archivado';

export interface Documento {
  id_archivo: string;
  nombre_archivo: string;
  extension: string;
  tamaño: string;
  estado: EstadoDocumento;
  fecha_subida: string;
  url: string;
  usuario_id: string;
  materia_id?: string | null; // Añadimos null como opción
}

export interface Tarea {
  id: string;
  titulo: string;
  descripcion: string;
  fecha_entrega: string;
  estado: boolean;
  usuario_id: string;
  materia_id: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  nombre: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    nombre: string;
    email: string;
  };
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

export interface Session {
  id: string;
  usuario_id: string;
  tarea_id?: string;
  materia_id?: string;
  duracion: number;
  fecha: string;
  completada: boolean;
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

const getAuthHeadersFormData = () => {
  const token = localStorage.getItem('authToken') || localStorage.getItem('token');
  return {
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

/**
 * API para autenticación y usuarios
 */
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/usuario/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<AuthResponse>(response);
  },

  register: async (userData: Omit<Usuario, 'id' | 'created_at' | 'updated_at'> & { password: string }): Promise<Usuario> => {
    const response = await fetch(`${API_BASE_URL}/usuario/register`, {
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
};

/**
 * API para gestión de documentos
 */
export const documentsAPI = {
  getByUser: async (userId: string): Promise<Documento[]> => {
    const response = await fetch(`${API_BASE_URL}/archivo/usuario/${userId}`, {
      headers: getAuthHeaders(),
    });
    const data = await handleResponse<Array<Record<string, any>>>(response);
    return data.map(doc => ({
      id_archivo: doc.id || doc.id_archivo,
      nombre_archivo: doc.nombre_archivo,
      extension: doc.extension,
      tamaño: doc.tamaño || doc.size,
      estado: doc.estado,
      fecha_subida: doc.fecha_subida || doc.upload_date,
      url: doc.url || doc.download_url,
      usuario_id: doc.usuario_id || doc.user_id,
      materia_id: doc.materia_id || doc.subject_id
    }));
  },

  getById: async (fileId: string): Promise<Documento> => {
    const response = await fetch(`${API_BASE_URL}/archivo/${fileId}`, {
      headers: getAuthHeaders(),
    });
    const doc = await handleResponse<Record<string, any>>(response);
    return {
      id_archivo: doc.id || doc.id_archivo,
      nombre_archivo: doc.nombre_archivo,
      extension: doc.extension,
      tamaño: doc.tamaño || doc.size,
      estado: doc.estado,
      fecha_subida: doc.fecha_subida || doc.upload_date,
      url: doc.url || doc.download_url,
      usuario_id: doc.usuario_id || doc.user_id,
      materia_id: doc.materia_id || doc.subject_id
    };
  },

  upload: async (formData: FormData, userId: string): Promise<Documento> => {
    const response = await fetch(`${API_BASE_URL}/archivo/${userId}`, {
      method: "POST",
      headers: getAuthHeadersFormData(),
      body: formData,
    });

    const doc = await handleResponse<Record<string, any>>(response);
    return {
      id_archivo: doc.id || doc.id_archivo,
      nombre_archivo: doc.nombre_archivo,
      extension: doc.extension,
      tamaño: doc.tamaño || doc.size,
      estado: doc.estado,
      fecha_subida: doc.fecha_subida || doc.upload_date,
      url: doc.url || doc.download_url,
      usuario_id: doc.usuario_id || doc.user_id,
      materia_id: doc.materia_id || doc.subject_id
    };
  },

  update: async (fileId: string, updates: Partial<Documento>): Promise<Documento> => {
    const response = await fetch(`${API_BASE_URL}/archivo/${fileId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    const doc = await handleResponse<Record<string, any>>(response);
    return {
      id_archivo: doc.id || doc.id_archivo,
      nombre_archivo: doc.nombre_archivo,
      extension: doc.extension,
      tamaño: doc.tamaño || doc.size,
      estado: doc.estado,
      fecha_subida: doc.fecha_subida || doc.upload_date,
      url: doc.url || doc.download_url,
      usuario_id: doc.usuario_id || doc.user_id,
      materia_id: doc.materia_id || doc.subject_id
    };
  },

  delete: async (fileId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/archivo/${fileId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  },

  download: async (id: string): Promise<Blob> => {
    const response = await fetch(`${API_BASE_URL}/archivo/${id}/download`, {
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
  getMaterias: async (): Promise<MateriaWithRelations[]> => {
    const response = await fetch(`${API_BASE_URL}/materias`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<MateriaWithRelations[]>(response);
  },

  getMateriaById: async (id: string): Promise<MateriaWithRelations> => {
    const response = await fetch(`${API_BASE_URL}/materias/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<MateriaWithRelations>(response);
  },

  createMateria: async (materia: Omit<Materia, 'id' | 'created_at' | 'updated_at'>): Promise<Materia> => {
    const response = await fetch(`${API_BASE_URL}/materias`, {
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
    const response = await fetch(`${API_BASE_URL}/materias/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    return handleResponse<Materia>(response);
  },

  deleteMateria: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/materias/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  },

  getGrupos: async (): Promise<GrupoWithRelations[]> => {
    const response = await fetch(`${API_BASE_URL}/grupos`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<GrupoWithRelations[]>(response);
  },

  getGrupoById: async (id: string): Promise<GrupoWithRelations> => {
    const response = await fetch(`${API_BASE_URL}/grupos/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<GrupoWithRelations>(response);
  },

  createGrupo: async (grupo: Omit<Grupo, 'id' | 'created_at' | 'updated_at'>): Promise<Grupo> => {
    const response = await fetch(`${API_BASE_URL}/grupos`, {
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
    const response = await fetch(`${API_BASE_URL}/grupos/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    return handleResponse<Grupo>(response);
  },

  deleteGrupo: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/grupos/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  },

  getProfesores: async (): Promise<Usuario[]> => {
    const response = await fetch(`${API_BASE_URL}/usuarios?rol=profesor`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Usuario[]>(response);
  },

  getEstudiantes: async (): Promise<Estudiante[]> => {
    const response = await fetch(`${API_BASE_URL}/usuarios?rol=estudiante`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Estudiante[]>(response);
  },

  getEstudiantesSinGrupo: async (): Promise<Estudiante[]> => {
    const response = await fetch(`${API_BASE_URL}/usuarios?rol=estudiante&sin_grupo=true`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Estudiante[]>(response);
  },
};

/**
 * API para gestión de tareas
 */
export const tasksAPI = {
  getByUser: async (userId: string): Promise<Tarea[]> => {
    const response = await fetch(`${API_BASE_URL}/tarea/por-usuario/${userId}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Tarea[]>(response);
  },

  getById: async (id: string): Promise<Tarea> => {
    const response = await fetch(`${API_BASE_URL}/tarea/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Tarea>(response);
  },

  create: async (taskData: Omit<Tarea, 'id' | 'created_at' | 'updated_at'>): Promise<Tarea> => {
    const response = await fetch(`${API_BASE_URL}/tarea`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    });
    return handleResponse<Tarea>(response);
  },

  update: async (id: string, updates: Partial<Tarea>): Promise<Tarea> => {
    const response = await fetch(`${API_BASE_URL}/tarea/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    return handleResponse<Tarea>(response);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/tarea/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  },
};

/**
 * API para gestión de sesiones de pomodoro
 */
export const sessionAPI = {
  create: async (sessionData: Omit<Session, 'id'>): Promise<Session> => {
    const response = await fetch(`${API_BASE_URL}/session`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(sessionData),
    });
    return handleResponse<Session>(response);
  },

  getByUser: async (userId: string): Promise<Session[]> => {
    const response = await fetch(`${API_BASE_URL}/session/${userId}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Session[]>(response);
  },

  getByMateria: async (materiaId: string): Promise<Session[]> => {
    const response = await fetch(`${API_BASE_URL}/session/por-materia/${materiaId}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Session[]>(response);
  },

  getByTarea: async (tareaId: string): Promise<Session[]> => {
    const response = await fetch(`${API_BASE_URL}/session/por-tarea/${tareaId}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Session[]>(response);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/session/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
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
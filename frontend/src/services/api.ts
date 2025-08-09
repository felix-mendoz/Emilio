// services/api.ts
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Tipos de datos unificados
 */
export type EstadoDocumento = 'activo' | 'inactivo' | 'archivado';

export interface Documento {
  id_archivo: number;
  nombre_archivo: string;
  extension: string;
  tamaño: string;
  estado: EstadoDocumento;
  fecha_subida: string;
  url: string;
  usuario_id: string;
  materia_id?: string | null;
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
  if (!token) {
    console.warn("No se encontró token de autenticación");
  }
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

  updateUser: async (userId: string, updates: Partial<Usuario>): Promise<Usuario> => {
    const response = await fetch(`${API_BASE_URL}/usuario/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    return handleResponse<Usuario>(response);
  },

  deleteUser: async (userId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/usuario/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }
};

/**
 * API para gestión de documentos
 */
export const documentsAPI = {
  getByUser: async (userId: string): Promise<Documento[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/archivo/usuario/${userId}`, {
        headers: getAuthHeaders(),
      });

      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error en getByUser:", errorData);
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      const data = await response.json();
      console.log("Datos recibidos en getByUser:", data);

      if (!Array.isArray(data)) {
        console.error("La respuesta no es un array:", data);
        throw new Error("Formato de datos inválido: se esperaba un array");
      }

      return data.map(doc => ({
        id_archivo: doc.id || doc.id_archivo || "",
        nombre_archivo: doc.nombre_archivo || "",
        extension: doc.extension || "",
        tamaño: doc.tamaño || doc.size || "0 KB",
        estado: doc.estado || "activo",
        fecha_subida: doc.fecha_subida || doc.upload_date || new Date().toISOString(),
        url: doc.url || doc.download_url || "",
        usuario_id: doc.usuario_id || doc.user_id || "",
        materia_id: doc.materia_id || doc.subject_id || null
      }));
    } catch (error) {
      console.error("Error en documentsAPI.getByUser:", error);
      throw error;
    }
  },

  getById: async (fileId: string): Promise<Documento> => {
    const response = await fetch(`${API_BASE_URL}/archivo/${fileId}`, {
      headers: getAuthHeaders(),
    });
    const doc = await handleResponse<Record<string, any>>(response);
    return {
      id_archivo: doc.id || doc.id_archivo || "",
      nombre_archivo: doc.nombre_archivo || "",
      extension: doc.extension || "",
      tamaño: doc.tamaño || doc.size || "0 KB",
      estado: doc.estado || "activo",
      fecha_subida: doc.fecha_subida || doc.upload_date || new Date().toISOString(),
      url: doc.url || doc.download_url || "",
      usuario_id: doc.usuario_id || doc.user_id || "",
      materia_id: doc.materia_id || doc.subject_id || null
    };
  },

  upload: async (formData: FormData, userId: string): Promise<Documento> => {
    try {
      console.log("Enviando archivo a:", `${API_BASE_URL}/archivo/${userId}`);
      
      const response = await fetch(`${API_BASE_URL}/archivo/${userId}`, {
        method: "POST",
        headers: getAuthHeadersFormData(),
        body: formData,
      });

      console.log("Respuesta del servidor:", response);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error en upload:", errorData);
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      const doc = await response.json();
      console.log("Documento subido:", doc);

      return {
        id_archivo: doc.id || doc.id_archivo || "",
        nombre_archivo: doc.nombre_archivo || "",
        extension: doc.extension || "",
        tamaño: doc.tamaño || doc.size || "0 KB",
        estado: doc.estado || "activo",
        fecha_subida: doc.fecha_subida || doc.upload_date || new Date().toISOString(),
        url: doc.url || doc.download_url || "",
        usuario_id: doc.usuario_id || doc.user_id || "",
        materia_id: doc.materia_id || doc.subject_id || null
      };
    } catch (error) {
      console.error("Error en documentsAPI.upload:", error);
      throw error;
    }
  },

  update: async (fileId: string, updates: Partial<Documento>): Promise<Documento> => {
    const response = await fetch(`${API_BASE_URL}/archivo/${fileId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    const doc = await handleResponse<Record<string, any>>(response);
    return {
      id_archivo: doc.id || doc.id_archivo || "",
      nombre_archivo: doc.nombre_archivo || "",
      extension: doc.extension || "",
      tamaño: doc.tamaño || doc.size || "0 KB",
      estado: doc.estado || "activo",
      fecha_subida: doc.fecha_subida || doc.upload_date || new Date().toISOString(),
      url: doc.url || doc.download_url || "",
      usuario_id: doc.usuario_id || doc.user_id || "",
      materia_id: doc.materia_id || doc.subject_id || null
    };
  },

  delete: async (fileId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/archivo/${fileId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
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
  getMaterias: async (): Promise<Materia[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/materias`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error("Formato de datos inválido: se esperaba un array");
      }

      return data.map(materia => ({
        id: materia.id || "",
        nombre: materia.nombre || "",
        codigo: materia.codigo || "",
        profesor_id: materia.profesor_id || null,
        grupo_id: materia.grupo_id || null,
        created_at: materia.created_at || new Date().toISOString(),
        updated_at: materia.updated_at || new Date().toISOString()
      }));
    } catch (error) {
      console.error("Error en academicAPI.getMaterias:", error);
      throw error;
    }
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

  addEstudianteToGrupo: async (estudianteId: string, grupoId: string): Promise<Estudiante> => {
    const response = await fetch(`${API_BASE_URL}/grupos/${grupoId}/estudiantes/${estudianteId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse<Estudiante>(response);
  },

  removeEstudianteFromGrupo: async (estudianteId: string): Promise<Estudiante> => {
    const response = await fetch(`${API_BASE_URL}/grupos/estudiantes/${estudianteId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<Estudiante>(response);
  }
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

  getByMateria: async (materiaId: string): Promise<Tarea[]> => {
    const response = await fetch(`${API_BASE_URL}/tarea/por-materia/${materiaId}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Tarea[]>(response);
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

  completeTask: async (id: string): Promise<Tarea> => {
    const response = await fetch(`${API_BASE_URL}/tarea/${id}/completar`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    return handleResponse<Tarea>(response);
  }
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

  getStatsByUser: async (userId: string): Promise<{totalSessions: number, totalTime: number}> => {
    const response = await fetch(`${API_BASE_URL}/session/${userId}/stats`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{totalSessions: number, totalTime: number}>(response);
  }
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
    console.error("Error en verifyToken:", error);
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

/**
 * Helper para manejar errores de API
 */
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return "Ocurrió un error desconocido";
};
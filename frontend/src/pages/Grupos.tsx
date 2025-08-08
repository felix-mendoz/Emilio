import React, { useState, useEffect } from 'react';
import { academicAPI, type Grupo, type Estudiante } from '../services/api';

interface GruposProps {
  userRole: string;
  userId: string;
}

const Grupos: React.FC<GruposProps> = ({ userRole, userId }) => {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [filter, setFilter] = useState('');
  const [nuevoGrupo, setNuevoGrupo] = useState({
    nombre: '',
    nivel: '',
    capacidad: 30
  });
  const [estudiantesSeleccionados, setEstudiantesSeleccionados] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadData();
    }
  }, [userId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [gruposData, estudiantesData] = await Promise.all([
        academicAPI.getGrupos(),
        academicAPI.getEstudiantes()
      ]);
      setGrupos(gruposData);
      setEstudiantes(estudiantesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!nuevoGrupo.nombre || !nuevoGrupo.nivel) {
      setError('Nombre y nivel son requeridos');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const createdGrupo = await academicAPI.createGrupo(nuevoGrupo);
      
      if (estudiantesSeleccionados.length > 0) {
        await academicAPI.addEstudiantesToGrupo(createdGrupo.id, estudiantesSeleccionados);
        // Recargar los datos para obtener los estudiantes actualizados
        await loadData();
      }
      
      setSuccessMessage('Grupo creado correctamente');
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear grupo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const updatedGrupo = await academicAPI.updateGrupo(editingId, nuevoGrupo);
      
      if (estudiantesSeleccionados.length > 0) {
        await academicAPI.addEstudiantesToGrupo(editingId, estudiantesSeleccionados);
      }
      
      setGrupos(grupos.map(g => 
        g.id === editingId ? { ...updatedGrupo, estudiantes: grupos.find(gr => gr.id === editingId)?.estudiantes } : g
      ));
      setSuccessMessage('Grupo actualizado');
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar este grupo?')) return;

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await academicAPI.deleteGrupo(id);
      setGrupos(grupos.filter(g => g.id !== id));
      setSuccessMessage('Grupo eliminado');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (grupo: Grupo) => {
    setEditingId(grupo.id);
    setNuevoGrupo({
      nombre: grupo.nombre,
      nivel: grupo.nivel,
      capacidad: grupo.capacidad
    });
    setEstudiantesSeleccionados(grupo.estudiantes?.map(e => e.id) || []);
  };

  const resetForm = () => {
    setNuevoGrupo({
      nombre: '',
      nivel: '',
      capacidad: 30
    });
    setEstudiantesSeleccionados([]);
    setEditingId(null);
  };

  const toggleEstudiante = (id: string) => {
    setEstudiantesSeleccionados(prev => 
      prev.includes(id) 
        ? prev.filter(e => e !== id) 
        : [...prev, id]
    );
  };

  const filteredGrupos = grupos.filter(g =>
    g.nombre.toLowerCase().includes(filter.toLowerCase()) ||
    g.nivel.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Grupos Académicos</h2>
        <p className="text-gray-600">Total: {grupos.length} grupos registrados</p>
        {userRole && <p className="text-sm text-gray-500">Rol: {userRole}</p>}
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar grupos..."
          className="w-full p-2 border rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">
          {editingId ? 'Editar Grupo' : 'Nuevo Grupo'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block mb-2 font-medium">Nombre:</label>
            <input
              type="text"
              value={nuevoGrupo.nombre}
              onChange={(e) => setNuevoGrupo({
                ...nuevoGrupo,
                nombre: e.target.value
              })}
              className="w-full p-2 border rounded"
              disabled={isLoading}
              placeholder="Ej: 4to A"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Nivel:</label>
            <input
              type="text"
              value={nuevoGrupo.nivel}
              onChange={(e) => setNuevoGrupo({
                ...nuevoGrupo,
                nivel: e.target.value
              })}
              className="w-full p-2 border rounded"
              disabled={isLoading}
              placeholder="Ej: Secundaria"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Capacidad:</label>
            <input
              type="number"
              value={nuevoGrupo.capacidad}
              onChange={(e) => setNuevoGrupo({
                ...nuevoGrupo,
                capacidad: parseInt(e.target.value) || 0
              })}
              className="w-full p-2 border rounded"
              disabled={isLoading}
              min="1"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Estudiantes:</label>
          <div className="max-h-60 overflow-y-auto border rounded p-2">
            {estudiantes.length === 0 ? (
              <p className="text-gray-500">No hay estudiantes registrados</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {estudiantes.map(estudiante => (
                  <label key={estudiante.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={estudiantesSeleccionados.includes(estudiante.id)}
                      onChange={() => toggleEstudiante(estudiante.id)}
                      className="rounded"
                    />
                    <span>
                      {estudiante.nombre} {estudiante.apellido}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        <div className="flex gap-4">
          {editingId ? (
            <>
              <button
                onClick={handleUpdate}
                disabled={isLoading}
                className="bg-blue-500 text-white px-4 py-2 rounded flex-1 disabled:opacity-50"
              >
                {isLoading ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                onClick={resetForm}
                className="bg-gray-200 px-4 py-2 rounded flex-1"
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={handleCreate}
              disabled={isLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded flex-1 disabled:opacity-50"
            >
              {isLoading ? 'Creando...' : 'Crear Grupo'}
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">
          Lista de Grupos ({filteredGrupos.length})
        </h3>

        {isLoading && !grupos.length ? (
          <div className="text-center py-8">
            <p>Cargando grupos...</p>
          </div>
        ) : filteredGrupos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>{filter ? 'No hay resultados' : 'No hay grupos registrados'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">Nombre</th>
                  <th className="px-6 py-3 text-left">Nivel</th>
                  <th className="px-6 py-3 text-left">Capacidad</th>
                  <th className="px-6 py-3 text-left">Estudiantes</th>
                  <th className="px-6 py-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredGrupos.map((grupo) => (
                  <tr key={grupo.id}>
                    <td className="px-6 py-4 font-medium">{grupo.nombre}</td>
                    <td className="px-6 py-4">{grupo.nivel}</td>
                    <td className="px-6 py-4">
                      {grupo.estudiantes?.length || 0} / {grupo.capacidad}
                    </td>
                    <td className="px-6 py-4">
                      <details className="cursor-pointer">
                        <summary className="text-blue-500 hover:underline">
                          Ver estudiantes ({grupo.estudiantes?.length || 0})
                        </summary>
                        <ul className="mt-2 pl-4 list-disc">
                          {grupo.estudiantes?.map(e => (
                            <li key={e.id}>{e.nombre} {e.apellido}</li>
                          ))}
                        </ul>
                      </details>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => startEditing(grupo)}
                        className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(grupo.id)}
                        className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Grupos;
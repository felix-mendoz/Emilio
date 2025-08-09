import React, { useState, useEffect } from 'react';
import { academicAPI, type Materia, type Grupo, type Usuario } from '../services/api';

interface MateriasProps {
  userRole: string;
  userId: string;
}

const Materias: React.FC<MateriasProps> = ({ userRole, userId }) => {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [profesores, setProfesores] = useState<Usuario[]>([]);
  const [filter, setFilter] = useState('');
  const [nuevaMateria, setNuevaMateria] = useState({
    nombre: '',
    codigo: '',
    profesor_id: '',
    grupo_id: '',
    id_user: userId
  });
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
      const [materiasData, gruposData, profesoresData] = await Promise.all([
        academicAPI.getMaterias(),
        academicAPI.getGrupos(),
        academicAPI.getProfesores()
      ]);
      setMaterias(materiasData);
      setGrupos(gruposData);
      setProfesores(profesoresData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!nuevaMateria.nombre || !nuevaMateria.codigo) {
      setError('Nombre y código son requeridos');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const createdMateria = await academicAPI.createMateria(nuevaMateria);
      setMaterias([...materias, createdMateria]);
      setSuccessMessage('Materia creada correctamente');
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear materia');
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
      const updatedMateria = await academicAPI.updateMateria(editingId, nuevaMateria);
      setMaterias(materias.map(m => 
        m.id === editingId ? updatedMateria : m
      ));
      setSuccessMessage('Materia actualizada');
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar esta materia?')) return;

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await academicAPI.deleteMateria(id);
      setMaterias(materias.filter(m => m.id !== id));
      setSuccessMessage('Materia eliminada');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (materia: Materia) => {
    setEditingId(materia.id);
    setNuevaMateria({
      nombre: materia.nombre,
      codigo: materia.codigo,
      profesor_id: materia.profesor_id || '',
      grupo_id: materia.grupo_id || '',
      id_user: userId
    });
  };

  const resetForm = () => {
    setNuevaMateria({
      nombre: '',
      codigo: '',
      profesor_id: '',
      grupo_id: '',
      id_user: userId
    });
    setEditingId(null);
  };

  const filteredMaterias = materias.filter(m =>
    m.nombre.toLowerCase().includes(filter.toLowerCase()) ||
    m.codigo.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Materias</h2>
        <p className="text-gray-600">Total: {materias.length} materias registradas</p>
        {userRole && <p className="text-sm text-gray-500">Rol: {userRole}</p>}
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar materias..."
          className="w-full p-2 border rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">
          {editingId ? 'Editar Materia' : 'Nueva Materia'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2 font-medium">Nombre:</label>
            <input
              type="text"
              value={nuevaMateria.nombre}
              onChange={(e) => setNuevaMateria({
                ...nuevaMateria,
                nombre: e.target.value
              })}
              className="w-full p-2 border rounded"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Código:</label>
            <input
              type="text"
              value={nuevaMateria.codigo}
              onChange={(e) => setNuevaMateria({
                ...nuevaMateria,
                codigo: e.target.value
              })}
              className="w-full p-2 border rounded"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2 font-medium">Profesor:</label>
            <select
              value={nuevaMateria.profesor_id}
              onChange={(e) => setNuevaMateria({
                ...nuevaMateria,
                profesor_id: e.target.value
              })}
              className="w-full p-2 border rounded"
              disabled={isLoading}
            >
              <option value="">Seleccionar profesor</option>
              {profesores.map(prof => (
                <option key={prof.id} value={prof.id}>
                  {prof.nombre} {prof.apellido}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Grupo:</label>
            <select
              value={nuevaMateria.grupo_id}
              onChange={(e) => setNuevaMateria({
                ...nuevaMateria,
                grupo_id: e.target.value
              })}
              className="w-full p-2 border rounded"
              disabled={isLoading}
            >
              <option value="">Seleccionar grupo</option>
              {grupos.map(grupo => (
                <option key={grupo.id} value={grupo.id}>
                  {grupo.nombre}
                </option>
              ))}
            </select>
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
              {isLoading ? 'Creando...' : 'Crear Materia'}
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">
          Lista de Materias ({filteredMaterias.length})
        </h3>

        {isLoading && !materias.length ? (
          <div className="text-center py-8">
            <p>Cargando materias...</p>
          </div>
        ) : filteredMaterias.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>{filter ? 'No hay resultados' : 'No hay materias registradas'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">Código</th>
                  <th className="px-6 py-3 text-left">Nombre</th>
                  <th className="px-6 py-3 text-left">Profesor</th>
                  <th className="px-6 py-3 text-left">Grupo</th>
                  <th className="px-6 py-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMaterias.map((materia) => {
                  const profesor = profesores.find(p => p.id === materia.profesor_id);
                  const grupo = grupos.find(g => g.id === materia.grupo_id);
                  
                  return (
                    <tr key={materia.id}>
                      <td className="px-6 py-4 font-medium">{materia.codigo}</td>
                      <td className="px-6 py-4">{materia.nombre}</td>
                      <td className="px-6 py-4">
                        {profesor ? `${profesor.nombre} ${profesor.apellido}` : 'No asignado'}
                      </td>
                      <td className="px-6 py-4">
                        {grupo ? grupo.nombre : 'No asignado'}
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        <button
                          onClick={() => startEditing(materia)}
                          className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(materia.id)}
                          className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Materias;
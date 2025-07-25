import React, { useState, useEffect } from 'react';
import { documentsAPI, type Documento, type EstadoDocumento } from '../services/api';

interface GestionArchivosProps {
  userName: string;
  userId: string;
}

const GestionArchivos: React.FC<GestionArchivosProps> = ({ userName, userId }) => {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [filter, setFilter] = useState('');
  const [nuevoDocumento, setNuevoDocumento] = useState({
    nombre_archivo: '',
    extension: '',
    estado: 'activo' as EstadoDocumento
  });
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setError('Usuario no identificado');
      return;
    }
    loadDocuments();
  }, [userId]);

  const loadDocuments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await documentsAPI.getAll(userId);
      setDocumentos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar documentos');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const fileNameParts = selectedFile.name.split('.');
      setNuevoDocumento({
        nombre_archivo: fileNameParts.slice(0, -1).join('.'),
        extension: fileNameParts.pop()?.toUpperCase() || '',
        estado: 'activo'
      });
    }
  };

  const handleUpload = async () => {
    if (!userId) {
      setError('Usuario no identificado');
      return;
    }

    if (!file) {
      setError('Selecciona un archivo');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append('archivo', file);
      formData.append('nombre_archivo', nuevoDocumento.nombre_archivo);
      formData.append('extension', nuevoDocumento.extension);
      formData.append('estado', nuevoDocumento.estado);

      const createdDocument = await documentsAPI.upload(formData, userId);
      setDocumentos([...documentos, createdDocument]);
      setSuccessMessage('Documento subido correctamente');
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir documento');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingId || !userId) return;

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const updatedDocument = await documentsAPI.update(editingId, {
        nombre_archivo: nuevoDocumento.nombre_archivo,
        estado: nuevoDocumento.estado,
        usuario_id: userId
      });

      setDocumentos(documentos.map(doc => 
        doc.id === editingId ? updatedDocument : doc
      ));
      setSuccessMessage('Documento actualizado');
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar documento?')) return;

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await documentsAPI.delete(id);
      setDocumentos(documentos.filter(doc => doc.id !== id));
      setSuccessMessage('Documento eliminado');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (doc: Documento) => {
    setEditingId(doc.id);
    setNuevoDocumento({
      nombre_archivo: doc.nombre_archivo,
      extension: doc.extension,
      estado: doc.estado
    });
  };

  const resetForm = () => {
    setNuevoDocumento({
      nombre_archivo: '',
      extension: '',
      estado: 'activo'
    });
    setFile(null);
    setEditingId(null);
  };

  const filteredDocuments = documentos.filter(doc =>
    doc.nombre_archivo.toLowerCase().includes(filter.toLowerCase()) ||
    doc.extension.toLowerCase().includes(filter.toLowerCase())
  );

  // Estilos completos (sin CSS-in-JS para mayor claridad)
  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Documentos</h2>
        <p className="text-gray-600">Usuario: {userName}</p>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar documentos..."
          className="w-full p-2 border rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">
          {editingId ? 'Editar Documento' : 'Nuevo Documento'}
        </h3>

        {!editingId && (
          <div className="mb-4">
            <label className="block mb-2 font-medium">Archivo:</label>
            <input
              type="file"
              onChange={handleFileChange}
              disabled={isLoading}
              className="block w-full"
              id="file-upload"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-2 font-medium">Nombre:</label>
          <input
            type="text"
            value={nuevoDocumento.nombre_archivo}
            onChange={(e) => setNuevoDocumento({
              ...nuevoDocumento,
              nombre_archivo: e.target.value
            })}
            className="w-full p-2 border rounded"
            disabled={isLoading}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Estado:</label>
          <select
            value={nuevoDocumento.estado}
            onChange={(e) => setNuevoDocumento({
              ...nuevoDocumento,
              estado: e.target.value as EstadoDocumento
            })}
            className="w-full p-2 border rounded"
            disabled={isLoading}
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="archivado">Archivado</option>
          </select>
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
              onClick={handleUpload}
              disabled={isLoading || !file}
              className="bg-blue-500 text-white px-4 py-2 rounded flex-1 disabled:opacity-50"
            >
              {isLoading ? 'Subiendo...' : 'Subir Documento'}
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">
          Documentos ({filteredDocuments.length})
        </h3>

        {isLoading && !documentos.length ? (
          <div className="text-center py-8">
            <p>Cargando documentos...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>{filter ? 'No hay resultados' : 'No hay documentos'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">Nombre</th>
                  <th className="px-6 py-3 text-left">Extensión</th>
                  <th className="px-6 py-3 text-left">Tamaño</th>
                  <th className="px-6 py-3 text-left">Estado</th>
                  <th className="px-6 py-3 text-left">Fecha</th>
                  <th className="px-6 py-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id}>
                    <td className="px-6 py-4">
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {doc.nombre_archivo}
                      </a>
                    </td>
                    <td className="px-6 py-4">{doc.extension}</td>
                    <td className="px-6 py-4">{doc.tamaño}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        doc.estado === 'activo' ? 'bg-green-100 text-green-800' :
                        doc.estado === 'inactivo' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {doc.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(doc.fecha_subida).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => startEditing(doc)}
                        className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
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

export default GestionArchivos;
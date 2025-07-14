import React, { useState, useEffect } from 'react';

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
  url: string;
}

interface GestionArchivosProps {
  userName: string;
}

const API_BASE_URL = 'http://localhost:3000/api/documents';

const GestionArchivos: React.FC<GestionArchivosProps> = ({ userName }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filter, setFilter] = useState('');
  const [newDocument, setNewDocument] = useState<Omit<Document, 'id' | 'uploadDate'>>({ 
    name: '', 
    type: '', 
    size: '', 
    url: '' 
  });
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchDocuments = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(API_BASE_URL, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setDocuments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar documentos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      setNewDocument({
        ...newDocument,
        name: selectedFile.name,
        type: selectedFile.type.split('/')[1].toUpperCase(),
        size: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
      });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Por favor selecciona un archivo');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', newDocument.name);
      formData.append('type', newDocument.type);

      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const createdDocument = await response.json();
      setDocuments([...documents, createdDocument]);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir documento');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingId || !newDocument.name || !newDocument.type) {
      setError('Nombre y tipo son requeridos');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newDocument.name,
          type: newDocument.type
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const updatedDocument = await response.json();
      setDocuments(documents.map(doc => 
        doc.id === editingId ? updatedDocument : doc
      ));
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar documento');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este documento?')) {
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      setDocuments(documents.filter(doc => doc.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar documento');
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (doc: Document) => {
    setEditingId(doc.id);
    setNewDocument({
      name: doc.name,
      type: doc.type,
      size: doc.size,
      url: doc.url
    });
  };

  const resetForm = () => {
    setNewDocument({ name: '', type: '', size: '', url: '' });
    setFile(null);
    setEditingId(null);
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(filter.toLowerCase()) ||
    doc.type.toLowerCase().includes(filter.toLowerCase())
  );

  // Estilos siguiendo exactamente tu estructura original
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      maxWidth: 1200,
      margin: '40px auto',
      padding: '0 20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: '#333',
    },
    title: {
      fontSize: '2rem',
      marginBottom: 10,
      color: '#004e89',
    },
    subtitle: {
      fontSize: '1rem',
      marginBottom: 30,
      lineHeight: 1.6,
    },
    filterContainer: {
      marginBottom: 20,
    },
    filterInput: {
      width: '100%',
      padding: '10px 15px',
      borderRadius: 5,
      border: '1px solid #ddd',
      fontSize: '1rem',
    },
    formContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      padding: '20px',
      borderRadius: 10,
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
      marginBottom: 30,
    },
    formGroup: {
      marginBottom: 15,
    },
    label: {
      display: 'block',
      marginBottom: 5,
      fontWeight: '600',
    },
    fileInput: {
      width: '100%',
    },
    textInput: {
      width: '100%',
      padding: '8px 12px',
      borderRadius: 5,
      border: '1px solid #ddd',
    },
    errorMessage: {
      color: '#d9534f',
      margin: '10px 0',
    },
    buttonGroup: {
      display: 'flex',
      gap: 10,
      marginTop: 15,
    },
    uploadButton: {
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: 5,
      cursor: 'pointer',
    },
    saveButton: {
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: 5,
      cursor: 'pointer',
    },
    cancelButton: {
      backgroundColor: '#6c757d',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: 5,
      cursor: 'pointer',
    },
    documentsContainer: {
      backgroundColor: 'rgba(255,255,255,0.85)',
      borderRadius: 10,
      padding: '20px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    },
    documentTable: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: 15,
    },
    tableHeader: {
      textAlign: 'left',
      padding: '12px 15px',
      borderBottom: '2px solid #ddd',
      backgroundColor: '#f8f9fa',
    },
    tableCell: {
      padding: '12px 15px',
      borderBottom: '1px solid #ddd',
    },
    documentLink: {
      color: '#007bff',
      textDecoration: 'none',
    },
    editButton: {
      backgroundColor: '#ffc107',
      color: '#212529',
      border: 'none',
      padding: '5px 10px',
      borderRadius: 3,
      cursor: 'pointer',
      marginRight: 5,
    },
    deleteButton: {
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      padding: '5px 10px',
      borderRadius: 3,
      cursor: 'pointer',
    },
  };

  return (
    <main style={styles.container}>
      <h2 style={styles.title}>Gestión de Documentos Académicos</h2>
      <p style={styles.subtitle}>Bienvenido, {userName}. Aquí puedes administrar tus documentos.</p>

      <div style={styles.filterContainer}>
        <input
          type="text"
          placeholder="Filtrar por nombre o tipo..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={styles.filterInput}
        />
      </div>

      <div style={styles.formContainer}>
        <h3>{editingId ? 'Editar Documento' : 'Subir Nuevo Documento'}</h3>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Archivo:</label>
          <input
            type="file"
            onChange={handleFileChange}
            disabled={!!editingId}
            style={styles.fileInput}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Nombre:</label>
          <input
            type="text"
            value={newDocument.name}
            onChange={(e) => setNewDocument({...newDocument, name: e.target.value})}
            style={styles.textInput}
            placeholder="Nombre del documento"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Tipo:</label>
          <input
            type="text"
            value={newDocument.type}
            onChange={(e) => setNewDocument({...newDocument, type: e.target.value})}
            style={styles.textInput}
            placeholder="PDF, DOCX, etc."
          />
        </div>

        {error && <div style={styles.errorMessage}>{error}</div>}

        <div style={styles.buttonGroup}>
          {editingId ? (
            <>
              <button 
                onClick={handleUpdate}
                style={styles.saveButton}
                disabled={isLoading}
              >
                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button 
                onClick={resetForm}
                style={styles.cancelButton}
                disabled={isLoading}
              >
                Cancelar
              </button>
            </>
          ) : (
            <button 
              onClick={handleUpload}
              style={styles.uploadButton}
              disabled={isLoading || !file}
            >
              {isLoading ? 'Subiendo...' : 'Subir Documento'}
            </button>
          )}
        </div>
      </div>

      <div style={styles.documentsContainer}>
        <h3>Tus Documentos ({filteredDocuments.length})</h3>
        
        {isLoading && !documents.length ? (
          <p>Cargando documentos...</p>
        ) : filteredDocuments.length === 0 ? (
          <p>No hay documentos {filter ? 'que coincidan con tu búsqueda' : 'disponibles'}</p>
        ) : (
          <table style={styles.documentTable}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Nombre</th>
                <th style={styles.tableHeader}>Tipo</th>
                <th style={styles.tableHeader}>Tamaño</th>
                <th style={styles.tableHeader}>Fecha</th>
                <th style={styles.tableHeader}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((doc) => (
                <tr key={doc.id}>
                  <td style={styles.tableCell}>
                    <a 
                      href={doc.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={styles.documentLink}
                    >
                      {doc.name}
                    </a>
                  </td>
                  <td style={styles.tableCell}>{doc.type}</td>
                  <td style={styles.tableCell}>{doc.size}</td>
                  <td style={styles.tableCell}>{new Date(doc.uploadDate).toLocaleDateString()}</td>
                  <td style={styles.tableCell}>
                    <button 
                      onClick={() => startEditing(doc)}
                      style={styles.editButton}
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(doc.id)}
                      style={styles.deleteButton}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
};

export default GestionArchivos;
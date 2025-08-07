import React, { useState, useEffect } from "react";
import {
  documentsAPI,
  type Documento,
  type EstadoDocumento,
} from "../services/api";

interface GestionArchivosProps {
  userName: string;
  userId: string;
}

const GestionArchivos: React.FC<GestionArchivosProps> = ({
  userName,
  userId,
}) => {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [filter, setFilter] = useState("");
  const [nuevoDocumento, setNuevoDocumento] = useState<{
    nombre_archivo: string;
    extension: string;
    estado: EstadoDocumento;
  }>({
    nombre_archivo: "",
    extension: "",
    estado: "activo",
  });
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadDocuments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await documentsAPI.getAll(userId);
        setDocumentos(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar documentos"
        );
        console.error("Error loading documents:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDocuments();
  }, [userId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      const fileNameParts = selectedFile.name.split(".");
      setNuevoDocumento({
        nombre_archivo: fileNameParts.slice(0, -1).join("."),
        extension: fileNameParts.pop()?.toUpperCase() || "",
        estado: "activo",
      });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Por favor selecciona un archivo");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append("guarda_archivo", file);
      formData.append("nombre_archivo", nuevoDocumento.nombre_archivo);
      formData.append("extension", nuevoDocumento.extension);
      formData.append("estado", nuevoDocumento.estado);
      formData.append("id_usuario", userId);

      const createdDocument = await documentsAPI.upload(formData, userId);
      setDocumentos([...documentos, createdDocument]);
      setSuccessMessage("Documento subido correctamente");
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir documento");
      console.error("Upload error:", err);
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
      const updatedDocument = await documentsAPI.update(editingId, {
        nombre_archivo: nuevoDocumento.nombre_archivo,
        estado: nuevoDocumento.estado,
      });

      setDocumentos(
        documentos.map((doc) =>
          doc.id_archivo === editingId ? updatedDocument : doc
        )
      );
      setSuccessMessage("Documento actualizado correctamente");
      resetForm();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar documento"
      );
      console.error("Update error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro de eliminar este documento?")) return;

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await documentsAPI.delete(id);
      setDocumentos(documentos.filter((doc) => doc.id_archivo !== id));
      setSuccessMessage("Documento eliminado correctamente");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al eliminar documento"
      );
      console.error("Delete error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (doc: Documento) => {
    setEditingId(doc.id_archivo);
    setNuevoDocumento({
      nombre_archivo: doc.nombre_archivo,
      extension: doc.extension,
      estado: doc.estado,
    });
    setFile(null);
  };

  const resetForm = () => {
    setNuevoDocumento({
      nombre_archivo: "",
      extension: "",
      estado: "activo",
    });
    setFile(null);
    setEditingId(null);
  };

  const filteredDocuments = documentos.filter(
    (doc) =>
      doc.nombre_archivo?.toLowerCase().includes(filter.toLowerCase()) ||
      doc.extension?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Gestión de Documentos</h2>
        <p style={styles.welcome}>
          Bienvenido, <span style={styles.userName}>{userName}</span>
        </p>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>
          {editingId ? "Editar Documento" : "Subir Nuevo Documento"}
        </h3>

        {!editingId && (
          <div style={styles.formGroup}>
            <label style={styles.label}>Archivo:</label>
            <div style={styles.fileUpload}>
              <input
                type="file"
                onChange={handleFileChange}
                disabled={isLoading}
                style={styles.fileInput}
                id="file-upload"
              />
              <label htmlFor="file-upload" style={styles.fileUploadLabel}>
                {file ? file.name : "Seleccionar archivo"}
              </label>
            </div>
          </div>
        )}

        <div style={styles.formGroup}>
          <label style={styles.label}>Nombre del documento:</label>
          <input
            type="text"
            value={nuevoDocumento.nombre_archivo}
            onChange={(e) =>
              setNuevoDocumento({
                ...nuevoDocumento,
                nombre_archivo: e.target.value,
              })
            }
            placeholder="Ingrese el nombre del documento"
            style={styles.input}
            disabled={isLoading}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Estado:</label>
          <select
            value={nuevoDocumento.estado}
            onChange={(e) =>
              setNuevoDocumento({
                ...nuevoDocumento,
                estado: e.target.value as EstadoDocumento,
              })
            }
            style={styles.select}
            disabled={isLoading || !editingId}
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="archivado">Archivado</option>
          </select>
        </div>

        {error && (
          <div style={styles.errorMessage}>
            <svg style={styles.errorIcon} viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"
              />
            </svg>
            {error}
          </div>
        )}

        {successMessage && (
          <div style={styles.successMessage}>
            <svg style={styles.successIcon} viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
              />
            </svg>
            {successMessage}
          </div>
        )}

        <div style={styles.buttonGroup}>
          {editingId ? (
            <>
              <button
                onClick={handleUpdate}
                disabled={isLoading}
                style={
                  isLoading ? styles.primaryButtonLoading : styles.primaryButton
                }
              >
                {isLoading ? (
                  <>
                    <svg style={styles.spinner} viewBox="0 0 50 50">
                      <circle
                        cx="25"
                        cy="25"
                        r="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="5"
                      ></circle>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  "Guardar Cambios"
                )}
              </button>
              <button
                onClick={resetForm}
                disabled={isLoading}
                style={styles.secondaryButton}
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={handleUpload}
              disabled={isLoading || !file}
              style={
                isLoading ? styles.primaryButtonLoading : styles.primaryButton
              }
            >
              {isLoading ? "Subiendo..." : "Subir Documento"}
            </button>
          )}
        </div>
      </div>

      <div style={styles.filterContainer}>
        <input
          type="text"
          placeholder="🔍 Filtrar por nombre o extensión..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={styles.filterInput}
        />
      </div>

      <div style={styles.documentsContainer}>
        <div style={styles.documentsHeader}>
          <h3 style={styles.documentsTitle}>
            Documentos ({filteredDocuments.length})
          </h3>
        </div>

        {isLoading && !documentos.length ? (
          <div style={styles.loadingContainer}>
            <svg style={styles.spinner} viewBox="0 0 50 50">
              <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
              ></circle>
            </svg>
            <p>Cargando documentos...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div style={styles.emptyState}>
            <svg style={styles.emptyIcon} viewBox="0 0 24 24">
              <path fill="currentColor" d="M19,13H5V11H19V13Z" />
            </svg>
            <p>
              {filter
                ? "No hay documentos que coincidan con tu búsqueda"
                : "No hay documentos disponibles"}
            </p>
          </div>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead style={styles.tableHeader}>
                <tr>
                  <th style={styles.tableHeaderCell}>Nombre</th>
                  <th style={styles.tableHeaderCell}>Extensión</th>
                  <th style={styles.tableHeaderCell}>Tamaño</th>
                  <th style={styles.tableHeaderCell}>Estado</th>
                  <th style={styles.tableHeaderCell}>Fecha</th>
                  <th style={styles.tableHeaderCell}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id_archivo} style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.documentLink}
                      >
                        {doc.nombre_archivo}
                      </a>
                    </td>
                    <td style={styles.tableCell}>{doc.extension}</td>
                    <td style={styles.tableCell}>{doc.tamaño}</td>
                    <td style={styles.tableCell}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          ...(doc.estado === "activo"
                            ? styles.activeBadge
                            : doc.estado === "inactivo"
                            ? styles.inactiveBadge
                            : styles.archivedBadge),
                        }}
                      >
                        {doc.estado}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      {new Date(doc.fecha_subida).toLocaleDateString()}
                    </td>
                    <td style={styles.tableCell}>
                      <button
                        onClick={() => startEditing(doc)}
                        style={{ ...styles.actionButton, ...styles.editButton }}
                        disabled={isLoading}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id_archivo)}
                        style={{
                          ...styles.actionButton,
                          ...styles.deleteButton,
                        }}
                        disabled={isLoading}
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

// Estilos en objeto TypeScript
const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: "12px",
    backdropFilter: "blur(10px)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
  },
  header: {
    marginBottom: "2rem",
    textAlign: "center" as const,
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: "0.5rem",
  },
  welcome: {
    fontSize: "1rem",
    color: "#7f8c8d",
  },
  userName: {
    fontWeight: "bold",
    color: "#3498db",
  },
  filterContainer: {
    marginBottom: "2rem",
  },
  filterInput: {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    border: "1px solid #dfe6e9",
    fontSize: "1rem",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "2rem",
    marginBottom: "2rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
  },
  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    marginBottom: "1.5rem",
    color: "#2c3e50",
  },
  formGroup: {
    marginBottom: "1.5rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "600",
    color: "#34495e",
    fontSize: "0.9rem",
  },
  fileUpload: {
    position: "relative" as const,
    marginBottom: "1rem",
  },
  fileInput: {
    position: "absolute" as const,
    width: "1px",
    height: "1px",
    padding: "0",
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    border: "0",
  },
  fileUploadLabel: {
    display: "block",
    padding: "0.75rem 1rem",
    backgroundColor: "#f8f9fa",
    border: "1px dashed #bdc3c7",
    borderRadius: "8px",
    textAlign: "center" as const,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  input: {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    border: "1px solid #dfe6e9",
    fontSize: "1rem",
    transition: "border 0.3s ease",
  },
  select: {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    border: "1px solid #dfe6e9",
    fontSize: "1rem",
    backgroundColor: "white",
    cursor: "pointer",
  },
  errorMessage: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    fontSize: "0.9rem",
  },
  errorIcon: {
    width: "20px",
    height: "20px",
    marginRight: "0.5rem",
  },
  successMessage: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    fontSize: "0.9rem",
  },
  successIcon: {
    width: "20px",
    height: "20px",
    marginRight: "0.5rem",
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
    marginTop: "1rem",
  },
  primaryButton: {
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    flex: 1,
  },
  primaryButtonLoading: {
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "not-allowed",
    opacity: 0.8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    flex: 1,
  },
  secondaryButton: {
    backgroundColor: "white",
    color: "#3b82f6",
    border: "1px solid #3b82f6",
    padding: "0.75rem 1.5rem",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    flex: 1,
  },
  spinner: {
    width: "20px",
    height: "20px",
    animation: "spin 1s linear infinite",
  },
  documentsContainer: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "2rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
  },
  documentsHeader: {
    marginBottom: "1.5rem",
  },
  documentsTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#2c3e50",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    color: "#7f8c8d",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    color: "#7f8c8d",
    textAlign: "center" as const,
  },
  emptyIcon: {
    width: "48px",
    height: "48px",
    marginBottom: "1rem",
    color: "#bdc3c7",
  },
  tableContainer: {
    overflowX: "auto" as const,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
  },
  tableHeader: {
    backgroundColor: "#f8f9fa",
  },
  tableHeaderCell: {
    padding: "1rem",
    textAlign: "left" as const,
    fontWeight: "600",
    color: "#2c3e50",
    fontSize: "0.9rem",
    borderBottom: "1px solid #dfe6e9",
  },
  tableRow: {
    borderBottom: "1px solid #dfe6e9",
    transition: "background-color 0.3s ease",
  },
  tableCell: {
    padding: "1rem",
    fontSize: "0.9rem",
    color: "#34495e",
  },
  statusBadge: {
    display: "inline-block",
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: "600",
  },
  activeBadge: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },
  inactiveBadge: {
    backgroundColor: "#fef9c3",
    color: "#854d0e",
  },
  archivedBadge: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
  actionButton: {
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    fontSize: "0.8rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginRight: "0.5rem",
  },
  editButton: {
    backgroundColor: "#fef9c3",
    color: "#854d0e",
    border: "none",
  },
  deleteButton: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    border: "none",
  },
  documentLink: {
    color: "#3b82f6",
    textDecoration: "none",
    fontWeight: "500",
    transition: "color 0.3s ease",
  },
};
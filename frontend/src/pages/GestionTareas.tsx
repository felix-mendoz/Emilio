import React, { useState, useEffect, useRef } from "react";
import { tasksAPI, type Tarea } from "../services/api";

interface GestionTareasProps {
  userName: string;
  userId: string;
}

const GestionTareas: React.FC<GestionTareasProps> = ({ userName, userId }) => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [filter, setFilter] = useState("");
  const [nuevaTarea, setNuevaTarea] = useState<{
    titulo: string;
    descripcion: string;
    fecha_entrega: string;
  }>({
    titulo: "",
    descripcion: "",
    fecha_entrega: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Pomodoro
  const [selectedTarea, setSelectedTarea] = useState<Tarea | null>(null);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 min
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const loadTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await tasksAPI.getByUser(userId);
      setTareas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar tareas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [userId]);

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          handlePomodoroFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [isRunning]);

  const handlePomodoroFinish = async () => {
    if (!selectedTarea) return;
    const updated = await tasksAPI.update(selectedTarea.id, {
      estado: "completada",
    });
    setTareas((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
    setSuccessMessage("Tarea completada. Tiempo registrado.");
    setSelectedTarea(null);
    setIsRunning(false);
    setTimeLeft(25 * 60);
  };

  const handleCreateOrUpdate = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const payload = {
        ...nuevaTarea,
        usuario_id: userId,
        estado: "pendiente" as const,
      };

      if (editingId) {
        const updated = await tasksAPI.update(editingId, payload);
        setTareas((prev) =>
          prev.map((t) => (t.id === updated.id ? updated : t))
        );
        setSuccessMessage("Tarea actualizada correctamente");
      } else {
        const created = await tasksAPI.create(payload);
        setTareas((prev) => [...prev, created]);
        setSuccessMessage("Tarea creada correctamente");
      }
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar tarea");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro de eliminar esta tarea?")) return;
    try {
      await tasksAPI.delete(id);
      setTareas((prev) => prev.filter((t) => t.id !== id));
      setSuccessMessage("Tarea eliminada correctamente");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar tarea");
    }
  };

  const startEditing = (tarea: Tarea) => {
    setEditingId(tarea.id);
    setNuevaTarea({
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      fecha_entrega: tarea.fecha_entrega,
    });
  };

  const resetForm = () => {
    setNuevaTarea({ titulo: "", descripcion: "", fecha_entrega: "" });
    setEditingId(null);
  };

  const filtered = tareas.filter((t) =>
    t.titulo.toLowerCase().includes(filter.toLowerCase())
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Gestión de Tareas</h2>
        <p style={styles.welcome}>
          Bienvenido, <span style={styles.userName}>{userName}</span>
        </p>
      </div>

      {/* Formulario */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>{editingId ? "Editar Tarea" : "Nueva Tarea"}</h3>

        <div style={styles.formGroup}>
          <label style={styles.label}>Título</label>
          <input
            style={styles.input}
            value={nuevaTarea.titulo}
            onChange={(e) =>
              setNuevaTarea({ ...nuevaTarea, titulo: e.target.value })
            }
            placeholder="Título de la tarea"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Descripción</label>
          <textarea
            style={{ ...styles.input, minHeight: "80px" }}
            value={nuevaTarea.descripcion}
            onChange={(e) =>
              setNuevaTarea({ ...nuevaTarea, descripcion: e.target.value })
            }
            placeholder="Describe la tarea"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Fecha de entrega</label>
          <input
            type="date"
            style={styles.input}
            value={nuevaTarea.fecha_entrega}
            onChange={(e) =>
              setNuevaTarea({ ...nuevaTarea, fecha_entrega: e.target.value })
            }
          />
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
          <button
            onClick={handleCreateOrUpdate}
            disabled={isLoading}
            style={isLoading ? styles.primaryButtonLoading : styles.primaryButton}
          >
            {editingId ? "Guardar Cambios" : "Crear Tarea"}
          </button>
          {editingId && (
            <button onClick={resetForm} style={styles.secondaryButton}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Pomodoro */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Pomodoro</h3>
        {selectedTarea ? (
          <>
            <p>
              Tarea seleccionada: <strong>{selectedTarea.titulo}</strong>
            </p>
            <h2 style={{ textAlign: "center", fontSize: "3rem", margin: "1rem 0" }}>
              {formatTime(timeLeft)}
            </h2>
            <div style={styles.buttonGroup}>
              <button
                onClick={() => setIsRunning(!isRunning)}
                style={styles.primaryButton}
              >
                {isRunning ? "Pausar" : "Iniciar"}
              </button>
              <button
                onClick={() => {
                  setSelectedTarea(null);
                  setIsRunning(false);
                  setTimeLeft(25 * 60);
                }}
                style={styles.secondaryButton}
              >
                Cancelar
              </button>
            </div>
          </>
        ) : (
          <p>Selecciona una tarea para iniciar el pomodoro.</p>
        )}
      </div>

      {/* Listado */}
      <div style={styles.filterContainer}>
        <input
          type="text"
          placeholder="🔍 Filtrar tareas..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={styles.filterInput}
        />
      </div>

      <div style={styles.documentsContainer}>
        <h3 style={styles.documentsTitle}>Tareas ({filtered.length})</h3>
        {isLoading && !tareas.length ? (
          <div style={styles.loadingContainer}>
            <svg style={styles.spinner} viewBox="0 0 50 50">
              <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
              />
            </svg>
            <p>Cargando tareas...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No hay tareas disponibles</p>
          </div>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead style={styles.tableHeader}>
                <tr>
                  <th style={styles.tableHeaderCell}>Título</th>
                  <th style={styles.tableHeaderCell}>Descripción</th>
                  <th style={styles.tableHeaderCell}>Fecha</th>
                  <th style={styles.tableHeaderCell}>Estado</th>
                  <th style={styles.tableHeaderCell}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} style={styles.tableRow}>
                    <td style={styles.tableCell}>{t.titulo}</td>
                    <td style={styles.tableCell}>{t.descripcion}</td>
                    <td style={styles.tableCell}>
                      {new Date(t.fecha_entrega).toLocaleDateString()}
                    </td>
                    <td style={styles.tableCell}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          ...(t.estado === "completada"
                            ? styles.activeBadge
                            : t.estado === "cancelada"
                            ? styles.archivedBadge
                            : styles.inactiveBadge),
                        }}
                      >
                        {t.estado}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      <button
                        onClick={() => startEditing(t)}
                        style={{ ...styles.actionButton, ...styles.editButton }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        style={{ ...styles.actionButton, ...styles.deleteButton }}
                      >
                        Eliminar
                      </button>
                      {t.estado === "pendiente" && (
                        <button
                          onClick={() => setSelectedTarea(t)}
                          style={{
                            ...styles.actionButton,
                            backgroundColor: "#e0f2fe",
                            color: "#0369a1",
                          }}
                        >
                          Pomodoro
                        </button>
                      )}
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
  input: {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    border: "1px solid #dfe6e9",
    fontSize: "1rem",
    transition: "border 0.3s ease",
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
  documentsContainer: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "2rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
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

  // Añadidos que faltaban
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
  spinner: {
    width: "20px",
    height: "20px",
    animation: "spin 1s linear infinite",
  },
};

export default GestionTareas;
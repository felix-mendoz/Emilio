import React from "react";

interface NewsItem {
  id: number;
  title: string;
  date: string;
  description: string;
  imgUrl?: string;
  details?: string;
  tags?: string[];
}

const novedadesData: NewsItem[] = [
  {
    id: 1,
    title: "Nuevo lector de PDFs integrado",
    date: "2025-06-25",
    description:
      "Ahora puedes abrir y leer PDFs directamente desde la plataforma con navegación rápida y modo oscuro.",
    imgUrl: "https://cdn-icons-png.flaticon.com/512/3377/3377982.png",
    details:
      "Soporte completo para múltiples formatos (PDF, DOCX, TXT). Navega páginas fácilmente, ajusta brillo, zoom y cambia entre modo claro y oscuro para máxima comodidad.",
    tags: ["PDF", "Lector", "Modo Oscuro", "Navegación"],
  },
  {
    id: 2,
    title: "Sistema de tarjetas de memoria",
    date: "2025-06-20",
    description:
      "Convierte tus anotaciones en flashcards para estudiar de manera más efectiva con preguntas y respuestas.",
    imgUrl: "https://cdn-icons-png.flaticon.com/512/2921/2921222.png",
    details:
      "Crea tarjetas personalizadas a partir de tus apuntes, organiza por temas o etiquetas y usa el modo repaso para maximizar la retención.",
    tags: ["Flashcards", "Estudio", "Organización", "Memoria"],
  },
  {
    id: 3,
    title: "Recordatorios y alertas",
    date: "2025-06-15",
    description:
      "Gestiona tus tareas y recibe avisos para no olvidar fechas importantes.",
    imgUrl: "https://cdn-icons-png.flaticon.com/512/1827/1827392.png",
    details:
      "Configura alertas para entregas, exámenes o reuniones. Visualiza tus próximas fechas en un calendario interactivo integrado.",
    tags: ["Recordatorios", "Calendario", "Alertas", "Tareas"],
  },
  {
    id: 4,
    title: "Interfaz renovada",
    date: "2025-06-10",
    description:
      "Hemos mejorado el diseño para una experiencia más limpia, intuitiva y rápida.",
    imgUrl: "https://cdn-icons-png.flaticon.com/512/1006/1006559.png",
    details:
      "Navegación más fluida, botones redondeados, tipografía optimizada y colores armoniosos para facilitar el uso diario.",
    tags: ["UI", "Diseño", "Experiencia de usuario"],
  },
  {
    id: 5,
    title: "Modo oscuro automático",
    date: "2025-06-05",
    description:
      "El sistema detecta la hora y activa el modo oscuro automáticamente para cuidar tu vista.",
    imgUrl: "https://cdn-icons-png.flaticon.com/512/581/581601.png",
    details:
      "Reduce la fatiga visual durante estudios nocturnos y mejora la concentración.",
    tags: ["Modo Oscuro", "Accesibilidad", "Estudios nocturnos"],
  },
];

const Gallery: React.FC = () => {
  return (
    <section
      style={{
        padding: "30px 15px",
        maxWidth: "900px",
        margin: "auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#222",
      }}
    >
      <h2
        style={{
          fontSize: "28px",
          fontWeight: "800",
          marginBottom: "35px",
          textAlign: "center",
          color: "#0056b3",
          textShadow: "0 1px 2px rgba(0,0,0,0.1)",
        }}
      >
        Novedades y Actualizaciones
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "18px",
        }}
      >
        {novedadesData.map(
          ({ id, title, date, description, imgUrl, details, tags }) => (
            <article
              key={id}
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                borderRadius: "12px",
                boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                padding: "18px 15px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                cursor: "default",
                userSelect: "none",
                fontSize: "14px",
                lineHeight: 1.4,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.transform = "scale(1.04)";
                el.style.boxShadow = "0 10px 26px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = "scale(1)";
                el.style.boxShadow = "0 6px 18px rgba(0,0,0,0.1)";
              }}
            >
              {imgUrl && (
                <img
                  src={imgUrl}
                  alt={title}
                  style={{
                    width: "50px",
                    height: "50px",
                    marginBottom: "12px",
                    filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.1))",
                  }}
                />
              )}
              <h3
                style={{
                  fontSize: "18px",
                  marginBottom: "6px",
                  color: "#007bff",
                  fontWeight: "700",
                }}
              >
                {title}
              </h3>
              <time
                style={{
                  fontSize: "12px",
                  color: "#555",
                  marginBottom: "12px",
                  fontStyle: "italic",
                }}
                dateTime={date}
              >
                {new Date(date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
              <p style={{ fontSize: "14px", color: "#444", marginBottom: "10px" }}>
                {description}
              </p>
              {details && (
                <p
                  style={{
                    fontSize: "12px",
                    color: "#666",
                    marginBottom: "15px",
                    fontStyle: "italic",
                  }}
                >
                  {details}
                </p>
              )}
              {tags && tags.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        fontSize: "11px",
                        backgroundColor: "#007bff",
                        color: "white",
                        padding: "3px 8px",
                        borderRadius: "10px",
                        fontWeight: "600",
                        userSelect: "none",
                        boxShadow: "0 1px 4px rgba(0, 123, 255, 0.4)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          )
        )}
      </div>
    </section>
  );
};

export default Gallery;

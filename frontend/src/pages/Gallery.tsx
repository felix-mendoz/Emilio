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
    description: "Ahora puedes abrir y leer PDFs directamente desde la plataforma con navegación rápida y modo oscuro.",
    imgUrl: "https://cdn-icons-png.flaticon.com/512/3377/3377982.png",
    details: "Soporte completo para múltiples formatos (PDF, DOCX, TXT). Navega páginas fácilmente, ajusta brillo, zoom y cambia entre modo claro y oscuro para máxima comodidad.",
    tags: ["PDF", "Lector", "Modo Oscuro", "Navegación"],
  },
  {
    id: 2,
    title: "Sistema de tarjetas de memoria",
    date: "2025-06-20",
    description: "Convierte tus anotaciones en flashcards para estudiar de manera más efectiva con preguntas y respuestas.",
    imgUrl: "https://cdn-icons-png.flaticon.com/512/2921/2921222.png",
    details: "Crea tarjetas personalizadas a partir de tus apuntes, organiza por temas o etiquetas y usa el modo repaso para maximizar la retención.",
    tags: ["Flashcards", "Estudio", "Organización", "Memoria"],
  },
  {
    id: 3,
    title: "Recordatorios y alertas",
    date: "2025-06-15",
    description: "Gestiona tus tareas y recibe avisos para no olvidar fechas importantes.",
    imgUrl: "https://cdn-icons-png.flaticon.com/512/1827/1827392.png",
    details: "Configura alertas para entregas, exámenes o reuniones. Visualiza tus próximas fechas en un calendario interactivo integrado.",
    tags: ["Recordatorios", "Calendario", "Alertas", "Tareas"],
  },
  {
    id: 4,
    title: "Interfaz renovada",
    date: "2025-06-10",
    description: "Hemos mejorado el diseño para una experiencia más limpia, intuitiva y rápida.",
    imgUrl: "https://cdn-icons-png.flaticon.com/512/1006/1006559.png",
    details: "Navegación más fluida, botones redondeados, tipografía optimizada y colores armoniosos para facilitar el uso diario.",
    tags: ["UI", "Diseño", "Experiencia de usuario"],
  },
  {
    id: 5,
    title: "Modo oscuro automático",
    date: "2025-06-05",
    description: "El sistema detecta la hora y activa el modo oscuro automáticamente para cuidar tu vista.",
    imgUrl: "https://cdn-icons-png.flaticon.com/512/581/581601.png",
    details: "Reduce la fatiga visual durante estudios nocturnos y mejora la concentración.",
    tags: ["Modo Oscuro", "Accesibilidad", "Estudios nocturnos"],
  },
];

const Gallery: React.FC = () => {
  // Estilos en objeto TypeScript
  const styles = {
    section: {
      padding: "40px 20px",
      maxWidth: "1200px",
      margin: "0 auto",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: "#2d3748",
    },
    header: {
      textAlign: "center" as const,
      marginBottom: "48px",
    },
    title: {
      fontSize: "32px",
      fontWeight: 800,
      color: "#1a365d",
      marginBottom: "16px",
      background: "linear-gradient(90deg, #2b6cb0, #4299e1)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      display: "inline-block",
    },
    subtitle: {
      fontSize: "18px",
      color: "#718096",
      maxWidth: "700px",
      margin: "0 auto",
      lineHeight: 1.6,
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "24px",
    },
    card: {
      background: "rgba(255, 255, 255, 0.92)",
      backdropFilter: "blur(10px)",
      borderRadius: "16px",
      padding: "24px",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      cursor: "default",
      userSelect: "none" as const,
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      textAlign: "center" as const,
      height: "100%",
    },
    cardHover: {
      transform: "translateY(-5px)",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    },
    icon: {
      width: "64px",
      height: "64px",
      marginBottom: "20px",
      filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))",
    },
    cardTitle: {
      fontSize: "20px",
      fontWeight: 700,
      color: "#2d3748",
      marginBottom: "12px",
      lineHeight: 1.3,
    },
    date: {
      fontSize: "14px",
      color: "#718096",
      marginBottom: "16px",
      fontStyle: "italic" as const,
    },
    description: {
      fontSize: "15px",
      color: "#4a5568",
      marginBottom: "16px",
      lineHeight: 1.6,
    },
    details: {
      fontSize: "14px",
      color: "#718096",
      marginBottom: "20px",
      fontStyle: "italic" as const,
      lineHeight: 1.6,
    },
    tagsContainer: {
      display: "flex",
      flexWrap: "wrap" as const,
      justifyContent: "center",
      gap: "8px",
      marginTop: "auto",
    },
    tag: {
      fontSize: "12px",
      backgroundColor: "#4299e1",
      color: "white",
      padding: "4px 12px",
      borderRadius: "9999px",
      fontWeight: 600,
      boxShadow: "0 2px 4px rgba(66, 153, 225, 0.3)",
      transition: "all 0.2s ease",
    },
    tagHover: {
      transform: "scale(1.05)",
      boxShadow: "0 4px 6px rgba(66, 153, 225, 0.4)",
    },
  };

  return (
    <section style={styles.section}>
      <div style={styles.header}>
        <h2 style={styles.title}>Novedades y Actualizaciones</h2>
        <p style={styles.subtitle}>Descubre las últimas mejoras y funcionalidades que hemos implementado para ti</p>
      </div>

      <div style={styles.grid}>
        {novedadesData.map(({ id, title, date, description, imgUrl, details, tags }) => {
          const [isHovered, setIsHovered] = React.useState(false);

          return (
            <article
              key={id}
              style={{
                ...styles.card,
                ...(isHovered ? styles.cardHover : {}),
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {imgUrl && (
                <img
                  src={imgUrl}
                  alt={title}
                  style={styles.icon}
                />
              )}
              <h3 style={styles.cardTitle}>{title}</h3>
              <time 
                style={styles.date}
                dateTime={date}
              >
                {new Date(date).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </time>
              <p style={styles.description}>{description}</p>
              {details && (
                <p style={styles.details}>{details}</p>
              )}
              {tags && tags.length > 0 && (
                <div style={styles.tagsContainer}>
                  {tags.map((tag, index) => (
                    <span 
                      key={index}
                      style={{
                        ...styles.tag,
                        ...(isHovered ? styles.tagHover : {}),
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Gallery;
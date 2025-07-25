import React from "react";

const About: React.FC = () => {
  // Estilos en objeto TypeScript
  const styles = {
    section: {
      padding: "80px 20px",
      maxWidth: "1200px",
      margin: "0 auto",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: "#2d3748",
      position: "relative" as const,
      background: "rgba(255, 255, 255, 0.85)",
      backdropFilter: "blur(5px)",
      borderRadius: "16px",
      boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
    },
    container: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "0 20px",
    },
    title: {
      fontSize: "36px",
      fontWeight: 800,
      color: "#1a365d",
      marginBottom: "24px",
      textAlign: "center" as const,
      position: "relative" as const,
      background: "linear-gradient(90deg, #2b6cb0, #4299e1)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    titleUnderline: {
      display: "block",
      width: "80px",
      height: "4px",
      background: "linear-gradient(90deg, #2b6cb0, #4299e1)",
      margin: "16px auto",
      borderRadius: "2px",
    },
    text: {
      fontSize: "16px",
      lineHeight: 1.8,
      marginBottom: "32px",
      color: "#4a5568",
      textAlign: "center" as const,
    },
    subtitle: {
      fontSize: "24px",
      fontWeight: 700,
      margin: "48px 0 24px",
      color: "#2c3e50",
      textAlign: "center" as const,
      background: "linear-gradient(90deg, #2b6cb0, #4299e1)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    featuresList: {
      listStyle: "none" as const,
      padding: 0,
      maxWidth: "700px",
      margin: "0 auto 48px",
    },
    featureItem: {
      background: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(5px)",
      padding: "20px 24px",
      marginBottom: "16px",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
      fontSize: "16px",
      lineHeight: 1.6,
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    featureItemHover: {
      transform: "translateY(-5px)",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    },
    featureIcon: {
      fontSize: "24px",
      flexShrink: 0,
    },
    featureText: {
      flex: 1,
    },
    strongText: {
      color: "#2b6cb0",
      fontWeight: 600,
    },
    quote: {
      fontSize: "20px",
      fontStyle: "italic" as const,
      color: "#4a5568",
      textAlign: "center" as const,
      maxWidth: "600px",
      margin: "48px auto",
      padding: "24px",
      borderLeft: "4px solid #4299e1",
      background: "rgba(255, 255, 255, 0.8)",
      borderRadius: "0 12px 12px 0",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
    },
  };

  const [hoveredItem, setHoveredItem] = React.useState<number | null>(null);

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <h2 style={styles.title}>Sobre nosotros</h2>
        <div style={styles.titleUnderline} />
        <p style={styles.text}>
          La vida universitaria puede ser abrumadora: clases, apuntes, fechas límite, trabajos en grupo y archivos por todas partes. Por eso creamos <strong style={styles.strongText}>AcadexPro</strong>, una plataforma digital pensada para ayudarte a tomar el control de tu vida académica.
        </p>

        <h3 style={styles.subtitle}>¿Qué puedes hacer con AcadexPro?</h3>
        <ul style={styles.featuresList}>
          {[
            { icon: "📂", text: "<strong>Subir y gestionar archivos:</strong> Organiza tus documentos por materia o curso." },
            { icon: "📝", text: "<strong>Crear recordatorios y tareas:</strong> Recibe avisos y cumple tus fechas importantes." },
            { icon: "🗂️", text: "<strong>Construir tu expediente de estudio:</strong> Visualiza tu progreso académico fácilmente." }
          ].map((item, index) => (
            <li 
              key={index}
              style={{
                ...styles.featureItem,
                ...(hoveredItem === index ? styles.featureItemHover : {}),
              }}
              onMouseEnter={() => setHoveredItem(index)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <span style={styles.featureIcon}>{item.icon}</span>
              <span 
                style={styles.featureText}
                dangerouslySetInnerHTML={{ __html: item.text }}
              />
            </li>
          ))}
        </ul>

        <h3 style={styles.subtitle}>Nuestra misión</h3>
        <p style={styles.text}>
          Simplificar y centralizar tus materiales de estudio para que tengas más tiempo y claridad para lo que realmente importa: aprender.
        </p>

        <blockquote style={styles.quote}>
          "Tú enfócate en aprender. Nosotros te ayudamos a organizar."
        </blockquote>
      </div>
    </section>
  );
};

export default About;
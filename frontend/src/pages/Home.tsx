import React from 'react';

interface HomeProps {
  userName: string;
}

const Home: React.FC<HomeProps> = ({ userName }) => {
  // Estilos en objeto TypeScript
  const styles = {
    main: {
      padding: "40px 20px",
      maxWidth: "1200px",
      margin: "0 auto",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: "#2d3748",
    },
    welcomeSection: {
      textAlign: "center" as const,
      padding: "60px 20px",
      marginBottom: "60px",
      background: "linear-gradient(135deg, rgba(66, 153, 225, 0.1) 0%, rgba(255, 255, 255, 0.9) 100%)",
      borderRadius: "20px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      backdropFilter: "blur(10px)",
    },
    welcomeTitle: {
      fontSize: "42px",
      fontWeight: 800,
      marginBottom: "20px",
      background: "linear-gradient(90deg, #2b6cb0, #4299e1)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      display: "inline-block",
    },
    welcomeSubtitle: {
      fontSize: "18px",
      color: "#4a5568",
      maxWidth: "700px",
      margin: "0 auto 30px",
      lineHeight: 1.6,
    },
    ctaButton: {
      padding: "14px 32px",
      fontSize: "16px",
      fontWeight: 600,
      color: "white",
      background: "linear-gradient(90deg, #2b6cb0, #4299e1)",
      border: "none",
      borderRadius: "50px",
      cursor: "pointer",
      boxShadow: "0 4px 15px rgba(43, 108, 176, 0.3)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      outline: "none",
    },
    ctaButtonHover: {
      transform: "translateY(-3px)",
      boxShadow: "0 8px 20px rgba(43, 108, 176, 0.4)",
    },
    featuresSection: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "30px",
      marginBottom: "60px",
    },
    featureCard: {
      background: "rgba(255, 255, 255, 0.92)",
      backdropFilter: "blur(10px)",
      borderRadius: "16px",
      padding: "30px 25px",
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
    featureCardHover: {
      transform: "translateY(-5px)",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    },
    featureIcon: {
      width: "80px",
      height: "80px",
      marginBottom: "25px",
      filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))",
      transition: "transform 0.3s ease",
    },
    featureIconHover: {
      transform: "scale(1.1)",
    },
    featureCardTitle: {
      fontSize: "22px",
      fontWeight: 700,
      color: "#2d3748",
      marginBottom: "15px",
      lineHeight: 1.3,
    },
    featureCardText: {
      fontSize: "16px",
      color: "#4a5568",
      lineHeight: 1.6,
    },
  };

  const [hoverStates, setHoverStates] = React.useState({
    button: false,
    cards: [false, false, false],
  });

  return (
    <main style={styles.main}>
      {/* Sección de bienvenida */}
      <section style={styles.welcomeSection}>
        <h1 style={styles.welcomeTitle}>¡Hola, {userName}!</h1>
        <p style={styles.welcomeSubtitle}>
          Bienvenido a tu espacio académico digital, diseñado para ayudarte a organizar tus archivos, 
          tomar notas y mantener tus recordatorios al día.
        </p>
        <button 
          style={{
            ...styles.ctaButton,
            ...(hoverStates.button ? styles.ctaButtonHover : {}),
          }}
          onClick={() => window.location.href = '/gestionArchivos'}
          onMouseEnter={() => setHoverStates({...hoverStates, button: true})}
          onMouseLeave={() => setHoverStates({...hoverStates, button: false})}
        >
          Gestionar Documentos
        </button>
      </section>

      {/* Sección de funcionalidades */}
      <section style={styles.featuresSection}>
        {/* Tarjeta de Gestión de Archivos */}
        <div 
          style={{
            ...styles.featureCard,
            ...(hoverStates.cards[0] ? styles.featureCardHover : {}),
          }}
          onMouseEnter={() => setHoverStates({...hoverStates, cards: [true, false, false]})}
          onMouseLeave={() => setHoverStates({...hoverStates, cards: [false, false, false]})}
        >
          <img 
            src="https://cdn-icons-png.flaticon.com/512/833/833524.png" 
            alt="Archivos" 
            style={{
              ...styles.featureIcon,
              ...(hoverStates.cards[0] ? styles.featureIconHover : {}),
            }} 
          />
          <h3 style={styles.featureCardTitle}>Gestión de Archivos</h3>
          <p style={styles.featureCardText}>
            Sube, organiza y accede fácilmente a todos tus documentos académicos desde un solo lugar.
          </p>
        </div>

        {/* Tarjeta de Anotaciones Inteligentes */}
        <div 
          style={{
            ...styles.featureCard,
            ...(hoverStates.cards[1] ? styles.featureCardHover : {}),
          }}
          onMouseEnter={() => setHoverStates({...hoverStates, cards: [false, true, false]})}
          onMouseLeave={() => setHoverStates({...hoverStates, cards: [false, false, false]})}
        >
          <img 
            src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" 
            alt="Notas" 
            style={{
              ...styles.featureIcon,
              ...(hoverStates.cards[1] ? styles.featureIconHover : {}),
            }} 
          />
          <h3 style={styles.featureCardTitle}>Anotaciones Inteligentes</h3>
          <p style={styles.featureCardText}>
            Toma notas rápidas, crea listas y organiza tus ideas con facilidad.
          </p>
        </div>

        {/* Tarjeta de Recordatorios */}
        <div 
          style={{
            ...styles.featureCard,
            ...(hoverStates.cards[2] ? styles.featureCardHover : {}),
          }}
          onMouseEnter={() => setHoverStates({...hoverStates, cards: [false, false, true]})}
          onMouseLeave={() => setHoverStates({...hoverStates, cards: [false, false, false]})}
        >
          <img 
            src="https://cdn-icons-png.flaticon.com/512/2921/2921222.png" 
            alt="Recordatorios" 
            style={{
              ...styles.featureIcon,
              ...(hoverStates.cards[2] ? styles.featureIconHover : {}),
            }} 
          />
          <h3 style={styles.featureCardTitle}>Recordatorios</h3>
          <p style={styles.featureCardText}>
            Planifica y recibe alertas para tus fechas importantes y tareas pendientes.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Home;
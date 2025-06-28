import React from 'react';

interface HomeProps {
  userName: string;
}

const Home: React.FC<HomeProps> = ({ userName }) => {
  return (
    <main style={styles.container}>
      {/* Sección de bienvenida con saludo personalizado y botón CTA */}
      <section style={styles.welcomeSection}>
        <h1 style={styles.title}>¡Hola, {userName}!</h1>
        <p style={styles.subtitle}>
          Bienvenido a tu espacio académico digital, diseñado para ayudarte a organizar tus archivos, tomar notas y mantener tus recordatorios al día.
        </p>
        {/* Botón con llamada a la acción para comenzar */}
        <button style={styles.ctaButton} onClick={() => alert('Vamos a comenzar!')}>
          Comenzar Ahora
        </button>
      </section>

      {/* Sección de funcionalidades principales con íconos y descripción */}
      <section style={styles.featuresSection}>
        {/* Tarjeta de función: Gestión de archivos */}
        <div style={styles.featureCard}>
          <img src="https://cdn-icons-png.flaticon.com/512/833/833524.png" alt="Archivos" style={styles.icon} />
          <h3>Gestión de Archivos</h3>
          <p>Sube, organiza y accede fácilmente a todos tus documentos académicos desde un solo lugar.</p>
        </div>

        {/* Tarjeta de función: Anotaciones inteligentes */}
        <div style={styles.featureCard}>
          <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Notas" style={styles.icon} />
          <h3>Anotaciones Inteligentes</h3>
          <p>Toma notas rápidas, crea listas y organiza tus ideas con facilidad.</p>
        </div>

        {/* Tarjeta de función: Recordatorios */}
        <div style={styles.featureCard}>
          <img src="https://cdn-icons-png.flaticon.com/512/2921/2921222.png" alt="Recordatorios" style={styles.icon} />
          <h3>Recordatorios</h3>
          <p>Planifica y recibe alertas para tus fechas importantes y tareas pendientes.</p>
        </div>
      </section>
    </main>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  // Contenedor principal con margen y fuente estilizada
  container: {
    maxWidth: 1200,
    margin: '40px auto',
    padding: '0 20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#333',
  },

  // Sección de bienvenida con fondo semitransparente y sombra suave
  welcomeSection: {
    textAlign: 'center' as const,
    marginBottom: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: '40px 30px',
    borderRadius: 20,
    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
  },

  // Título principal grande y con color azul oscuro
  title: {
    fontSize: '2.8rem',
    marginBottom: 15,
    color: '#004e89',
  },

  // Texto de subtítulo con buena legibilidad
  subtitle: {
    fontSize: '1.2rem',
    marginBottom: 30,
    lineHeight: 1.6,
  },

  // Botón llamativo con sombra y efecto hover (se puede agregar luego)
  ctaButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '14px 30px',
    fontSize: '1.1rem',
    borderRadius: 30,
    cursor: 'pointer',
    boxShadow: '0 6px 15px rgba(0,123,255,0.4)',
    transition: 'background-color 0.3s ease',
  },

  // Sección que contiene las tarjetas de funcionalidades, responsiva con flexbox
  featuresSection: {
    display: 'flex',
    justifyContent: 'space-around',
    gap: 30,
    flexWrap: 'wrap' as const,
  },

  // Estilo de cada tarjeta: fondo semi transparente, bordes redondeados y sombra suave
  featureCard: {
    flex: '1 1 300px',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 20,
    padding: 25,
    textAlign: 'center' as const,
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  },

  // Íconos grandes y con margen inferior para separar del texto
  icon: {
    width: 70,
    height: 70,
    marginBottom: 20,
  },
};

export default Home;

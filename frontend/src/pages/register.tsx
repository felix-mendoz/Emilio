import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usersAPI } from "../services/api";
import loginImage from "../assets/login.png";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);
    
    try {
      await usersAPI.register({
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message 
          : "Error al registrar usuario. Por favor, inténtalo de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.loginPage}>
      <div style={styles.loginContainer}>
        <div style={styles.leftPanel}>
          <img 
            src={loginImage} 
            alt="Register" 
            style={styles.loginImage}
          />
          <h2 style={styles.brandTitle}>AcadexPro</h2>
          <p style={styles.brandSubtitle}>Gestión académica integral</p>
        </div>
        
        <form onSubmit={handleSubmit} style={styles.loginForm}>
          <h2 style={styles.formTitle}>Registro de Usuario</h2>
          
          {error && (
            <div style={styles.errorMessage}>
              <svg style={styles.errorIcon} viewBox="0 0 24 24">
                <path fill="currentColor" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
              </svg>
              {error}
            </div>
          )}
          
          {success && (
            <div style={styles.successMessage}>
              <svg style={styles.successIcon} viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
              </svg>
              ¡Registro exitoso! Redirigiendo al login...
            </div>
          )}
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Nombre Completo</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              style={styles.input}
              placeholder="Tu nombre completo"
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Correo Electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="tu@email.com"
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Confirmar Contraseña</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={styles.input}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          
          <button 
            type="submit" 
            style={isLoading || success ? styles.submitButtonLoading : styles.submitButton}
            disabled={isLoading || success}
          >
            {isLoading ? (
              <>
                <svg style={styles.spinner} viewBox="0 0 50 50">
                  <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="5"></circle>
                </svg>
                Registrando...
              </>
            ) : 'Registrarse'}
          </button>
          
          <div style={styles.registerPrompt}>
            ¿Ya tienes una cuenta?{' '}
            <a 
              href="#" 
              style={styles.registerLink}
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
            >
              Inicia sesión aquí
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

// Estilos en objeto TypeScript (los mismos que en Login con algunos añadidos)
const styles = {
    loginPage: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'Transparent',
        padding: '20px',
    },
    loginContainer: {
        display: 'flex',
        width: '900px',
        borderRadius: '15px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'white',
    },
    leftPanel: {
        flex: 1,
        background: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
        padding: '50px',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center' as const,
    },
    loginImage: {
        width: '200px',
        marginBottom: '30px',
    },
    brandTitle: {
        fontSize: '28px',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    brandSubtitle: {
        fontSize: '16px',
        opacity: 0.8,
    },
    loginForm: {
        flex: 1,
        padding: '50px',
        display: 'flex',
        flexDirection: 'column' as const,
    },
    formTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '30px',
        color: '#333',
    },
    formGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontSize: '14px',
        fontWeight: '600',
        color: '#555',
    },
    input: {
        width: '100%',
        padding: '12px 15px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '16px',
        transition: 'border 0.3s',
    },
    inputFocus: {
        outline: 'none',
        borderColor: '#4b6cb7',
        boxShadow: '0 0 0 3px rgba(75, 108, 183, 0.2)',
    },
    errorMessage: {
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        padding: '12px 15px',
        borderRadius: '8px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px',
    },
    successMessage: {
        backgroundColor: '#d1fae5',
        color: '#065f46',
        padding: '12px 15px',
        borderRadius: '8px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px',
    },
    errorIcon: {
        width: '20px',
        height: '20px',
        marginRight: '10px',
    },
    successIcon: {
        width: '20px',
        height: '20px',
        marginRight: '10px',
    },
    submitButton: {
        backgroundColor: '#4b6cb7',
        color: 'white',
        border: 'none',
        padding: '14px',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        marginBottom: '20px',
    },
    submitButtonLoading: {
        backgroundColor: '#4b6cb7',
        color: 'white',
        border: 'none',
        padding: '14px',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'not-allowed',
        opacity: 0.8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
    },
    spinner: {
        width: '20px',
        height: '20px',
        animation: 'spin 1s linear infinite',
    },
    registerPrompt: {
        textAlign: 'center' as const,
        fontSize: '14px',
        color: '#666',
    },
    registerLink: {
        color: '#4b6cb7',
        fontWeight: '600',
        textDecoration: 'none',
    },
};

export default Register;
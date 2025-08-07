import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/login.png";
import { authAPI } from "../services/api";

interface LoginProps {
    setIsAuthenticated: (value: boolean) => void;
    setUserData: (data: { name: string; id: string }) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated, setUserData }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        if (!email || !password) {
            setError("Por favor completa todos los campos");
            return;
        }

        setIsLoading(true);
        try {
            const { token, user } = await authAPI.login(email, password);

            localStorage.setItem('token', token);
            setIsAuthenticated(true);
            setUserData({ name: user.nombre, id: user.id });
            navigate("/");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Credenciales incorrectas");
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
                        alt="Login" 
                        style={styles.loginImage}
                    />
                    <h2 style={styles.brandTitle}>AcadexPro</h2>
                    <p style={styles.brandSubtitle}>Gestión académica integral</p>
                </div>
                
                <form onSubmit={handleSubmit} style={styles.loginForm}>
                    <h2 style={styles.formTitle}>Iniciar Sesión</h2>
                    
                    {error && (
                        <div style={styles.errorMessage}>
                            <svg style={styles.errorIcon} viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
                            </svg>
                            {error}
                        </div>
                    )}
                    
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Correo Electrónico</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                            placeholder="tu@email.com"
                            required
                        />
                    </div>
                    
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    
                    <div style={styles.optionsContainer}>
                        <label style={styles.rememberMe}>
                            <input type="checkbox" style={styles.checkbox} />
                            Recordar sesión
                        </label>
                        <a href="#" style={styles.forgotPassword}>¿Olvidaste tu contraseña?</a>
                    </div>
                    
                    <button 
                        type="submit" 
                        style={isLoading ? styles.submitButtonLoading : styles.submitButton}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <svg style={styles.spinner} viewBox="0 0 50 50">
                                    <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="5"></circle>
                                </svg>
                                Procesando...
                            </>
                        ) : 'Ingresar'}
                    </button>
                    
                    <div style={styles.registerPrompt}>
                        ¿No tienes una cuenta?{' '}
                        <a 
                            href="#" 
                            style={styles.registerLink}
                            onClick={(e) => {
                                e.preventDefault();
                                navigate("/register");
                            }}
                        >
                            Regístrate aquí
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Estilos completos (sin omisiones)
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
    errorIcon: {
        width: '20px',
        height: '20px',
        marginRight: '10px',
    },
    optionsContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '25px',
    },
    rememberMe: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px',
        color: '#555',
    },
    checkbox: {
        marginRight: '8px',
        accentColor: '#4b6cb7',
    },
    forgotPassword: {
        fontSize: '14px',
        color: '#4b6cb7',
        textDecoration: 'none',
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

export default Login;
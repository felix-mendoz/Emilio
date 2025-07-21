import React, { useState } from "react";
import "./styles.css";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Usuario registrado con éxito");
        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-image" />
          <h2 className="login-title">Crear Cuenta</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label>Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)} 
                required
                className="input-field"
                placeholder="Tu nombre completo"
              />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                required
                className="input-field"
                placeholder="you@example.com"
              />
            </div>
            <div className="input-group">
              <label>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required
                className="input-field"
                placeholder="Elige una contraseña"
              />
            </div>
            <button type="submit" className="login-button">
              Crear Cuenta
            </button>
          </form>
          <div className="login-links">
            <a href="/login">¿Ya tienes cuenta? Inicia sesión</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
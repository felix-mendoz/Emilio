import React, { useState } from "react";
import "./styles.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/login", { // Billy aqui esta el fetch Tienes que adaptarlo
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login exitoso");
        // Aqui puedes redireccionar billy si deseas redireccionar, para que lo mande a la pagina de bienvenida 
        console.log(data);
      } else {
        alert(`Error: ${data.message || "Credenciales inválidas"}`);
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
          <h2 className="login-title">AcadexPro</h2>
          <form onSubmit={handleSubmit} className="login-form">
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
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required
                className="input-field"
                placeholder="Enter Password"
              />
            </div>
            <button type="submit" className="login-button"> 
              Sign In
            </button>
          </form>
          <div className="login-links">
  <a href="/forgot-password">Forgot password?</a>
  <a href="/register">Create account</a> 
</div>
        </div>
      </div>
    </div>
  );
};

export default Login;

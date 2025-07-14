import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./register"; 
import Home from "./Home";
import Navbar from "./Navbar";
import About from "./About";
import Faqs from "./question";
import Gallery from "./Gallery";
import GestionArchivos from "./gestionArchivos"; 
import "./styles.css";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:3000/api/login", { // Api
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        setUserName(data.name);
        localStorage.setItem("token", data.token);
      } else {
        alert(data.message || "Credenciales incorrectas.");
      }
    } catch (error) {
      alert("Error de conexión con el servidor.");
      console.error(error);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserName("");
    localStorage.removeItem("token");
  };

  return (
    <Router>
      {isAuthenticated && <Navbar onLogout={handleLogout} userName={userName} />}

      <div className="content-container">
        <div className="content">
          <Routes>
            {!isAuthenticated ? (
              <>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Home userName={userName} />} />
                <Route path="/about" element={<About />} />
                <Route path="/faqs" element={<Faqs />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/documents" element={<GestionArchivos userName={userName} />} /> {/* Ruta añadida */}
                <Route path="*" element={<Navigate to="/" />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
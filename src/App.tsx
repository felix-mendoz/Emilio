import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./Login";
import Register from "./register";
import Home from "./Home";
import Navbar from "./Navbar";
import About from "./About";
import Faqs from "./question";
import Gallery from "./Gallery";
import "./styles.css";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");

  const onLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        return false;
      }
      const data = await response.json();
  
      setUserName(data.user.name);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Error en login:", error);
      return false;
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserName("");
    localStorage.removeItem("token");
  };

  return (
    <Router>
      {isAuthenticated && (
        <Navbar onLogout={handleLogout} userName={userName} />
      )}

      <div className="content-container">
        <div className="content">
          <Routes>
            {!isAuthenticated ? (
              <>
                <Route path="/login" element={<Login onLogin={onLogin} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/*" element={<Login onLogin={onLogin} />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Home userName={userName} />} />
                <Route path="/about" element={<About />} />
                <Route path="/faqs" element={<Faqs />} />
                <Route path="/gallery" element={<Gallery />} />
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
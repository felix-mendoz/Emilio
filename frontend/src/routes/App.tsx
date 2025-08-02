import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/register';
import Home from '../pages/Home';
import GestionArchivos from '../pages/gestionArchivos';
import Materias from '../pages/materias';
import Grupos from '../pages/Grupos';
import About from '../pages/About';
import FAQ from '../pages/question';
import Gallery from '../pages/Gallery';
import Navbar from '../components/Navbar';
import '../css/styles.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState({ name: '', id: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserData({ name: '', id: '' });
  };

  return (
    <Router>
      {isAuthenticated && <Navbar 
        onLogout={handleLogout} 
        userName={userData.name} 
        userId={userData.id} 
      />}
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/" /> : 
            <Login setIsAuthenticated={setIsAuthenticated} setUserData={setUserData} />
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? <Navigate to="/" /> : <Register />
          } 
        />
        <Route 
          path="/" 
          element={
            isAuthenticated ? <Home userName={userData.name} /> : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/gestionArchivos" 
          element={
            isAuthenticated ? <GestionArchivos userName={userData.name} userId={userData.id} /> : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/materias" 
          element={
            isAuthenticated ? <Materias userRole="admin" userId={userData.id} /> : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/grupos" 
          element={
            isAuthenticated ? <Grupos userRole="admin" userId={userData.id} /> : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/about" 
          element={
            isAuthenticated ? <About /> : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/question" 
          element={
            isAuthenticated ? <FAQ /> : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/Gallery" 
          element={
            isAuthenticated ? <Gallery /> : <Navigate to="/login" />
          } 
        />
        <Route 
          path="*" 
          element={<Navigate to={isAuthenticated ? "/" : "/login"} />} 
        />
      </Routes>
    </Router>
  );
};

export default App;
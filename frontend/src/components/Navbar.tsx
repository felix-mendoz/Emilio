import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../assets/AcadexPro.png";
import "../css/styles.css";

interface NavbarProps {
    onLogout: () => void;
    userName: string;
    userId: string;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout, userName }) => {
    return (
        <nav className='navbar'>
            <div className='navbar-left'>
                <img src={logo} alt="Logo" className='logo'/>
                <h1 className='page-title'>AcadexPro</h1>
                <span className='userName'>{userName}</span>
            </div>
            <ul className='navbar-menu'>
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/documents">Documentos</Link></li>
                <li><Link to="/about">Sobre nosotros</Link></li>
                <li><Link to="/question">FAQ</Link></li>
                <li><Link to="/Gallery">Novedades</Link></li>
                <li><button onClick={onLogout} className='logout-button'>Logout</button></li>
            </ul>
        </nav>
    );
};

export default Navbar;
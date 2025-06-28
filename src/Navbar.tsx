import React from 'react';
import { Link } from 'react-router-dom';
import logo from "./AcadexPro.png";

interface NavbarProps {
    onLogout: () => void;
    userName: string; 
}

const Navbar: React.FC<NavbarProps> = ({onLogout, userName}) => {
    return (
        <nav className='navbar'>
            <div className='navbar-left'>
                <img src={logo} alt="Logo" className='logo'/>
                <h1 className='page-title'>AcadexPro</h1> {/* Aquí el título */}
                <span className='userName'>{userName}</span>
            </div>
            <ul className='navbar-menu'>
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/about">Sobre nosotros</Link></li>
                <li><Link to="/faqs">FAQ</Link></li>
                <li><button onClick={onLogout} className='logout-button'>Logout</button></li>
            </ul>
        </nav>
    )
}

export default Navbar;
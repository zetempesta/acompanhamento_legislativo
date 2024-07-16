// src/components/Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo_mini.png';


const Header = ({ activeItem, onNavClick }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleLogoClick = () => {
    navigate('/home');
  };
  

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-lg">
      <div className="flex items-center space-x-4">
        <img
          src={logo}
          alt="Logo"
          style={{ width: '211px', height: '67px' }}
          className="cursor-pointer"
          onClick={handleLogoClick}
        />
      </div>
      <nav className="flex-grow flex justify-center space-x-6">
        <button
          className={`text-blue-600 hover:text-blue-800 transition-colors duration-300 ${
            activeItem === 'Dashboard' ? 'font-bold border-b-2 border-blue-600' : ''
          }`}
          onClick={() => onNavClick('Dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`text-blue-600 hover:text-blue-800 transition-colors duration-300 ${
            activeItem === 'Mensagens' ? 'font-bold border-b-2 border-blue-600' : ''
          }`}
          onClick={() => onNavClick('Mensagens')}
        >
          Mensagens
        </button>
        <button
          className={`text-blue-600 hover:text-blue-800 transition-colors duration-300 ${
            activeItem === 'Proposituras' ? 'font-bold border-b-2 border-blue-600' : ''
          }`}
          onClick={() => onNavClick('Proposituras')}
        >
          Proposituras
        </button>
        <button
          className={`text-blue-600 hover:text-blue-800 transition-colors duration-300 ${
            activeItem === 'Usuários' ? 'font-bold border-b-2 border-blue-600' : ''
          }`}
          onClick={() => onNavClick('Usuários')}
        >
          Usuários
        </button>
        <button
          className={`text-blue-600 hover:text-blue-800 transition-colors duration-300 ${
            activeItem === 'Configurações' ? 'font-bold border-b-2 border-blue-600' : ''
          }`}
          onClick={() => onNavClick('Configurações')}
        >
          Configurações
        </button>
      </nav>
      <button onClick={handleLogout} className="px-6 py-2  text-red-600 rounded-lg text-lg font-semibold hover:text-white hover:bg-red-600 transition-colors duration-300">
        Sair
      </button>
    </header>
  );
};

export default Header;

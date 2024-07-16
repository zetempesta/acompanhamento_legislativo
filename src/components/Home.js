// src/components/Home.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const Home = () => {
  const [activeItem, setActiveItem] = useState('');
  const navigate = useNavigate();

  const handleNavClick = (item) => {
    setActiveItem(item);
    if (item === 'Usuários') {
      navigate('/users');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header activeItem={activeItem} onNavClick={handleNavClick} />
      <main className="p-4">
        {/* Conteúdo da página principal */}
      </main>
    </div>
  );
};

export default Home;

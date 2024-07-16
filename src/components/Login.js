// src/components/Login.js
import axios from 'axios';
import CryptoJS from 'crypto-js';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo_login.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const hashedPassword = CryptoJS.SHA256(password).toString();
    try {
      const response = await axios.post('http://localhost:8080/login', {
        usuario: username,
        senha: hashedPassword
      });
      const { user_id, id } = response.data;
      localStorage.setItem('user_id', user_id);
      localStorage.setItem('token', id);
      navigate('/home');
    } catch (err) {
      setError('Falha no login. Verifique seu nome de usuário e senha.');
    }
  };

  const handleClear = () => {
    setUsername('');
    setPassword('');
    setError('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <img src={logo} alt="Logo" className="mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4 text-center"> </h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Usuário"
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          className="w-full p-2 mb-4 border rounded"
        />
        <button onClick={handleLogin} className="w-full p-2 bg-blue-800 text-white rounded mb-2">Entrar</button>
        <button onClick={handleClear} className="w-full p-2 bg-gray-500 text-white rounded">Limpar</button>
      </div>
    </div>
  );
};

export default Login;

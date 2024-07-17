// src/components/EditUserModal.js
import axios from 'axios';
import CryptoJS from 'crypto-js';
import React, { useEffect, useState } from 'react';

const EditUserModal = ({ userId, onClose }) => {
  const [userData, setUserData] = useState(null);
  const [senha, setSenha] = useState('');
  const [ativo, setAtivo] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/usuario/${userId}`);
        setUserData(response.data);
        setAtivo(response.data.ativo !== undefined ? response.data.ativo : true); // Assumindo que o campo ativo pode vir do backend
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setAtivo(e.target.checked);
  };

  const validate = () => {
    const newErrors = {};
    if (!userData.nome) newErrors.nome = 'Nome é obrigatório';
    if (!userData.usuario) newErrors.usuario = 'Usuário é obrigatório';
    if (!userData.email) newErrors.email = 'Email é obrigatório';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updatedData = {
      id: userId,
      email: userData.email,
      nome: userData.nome,
      usuario: userData.usuario,
      senha:CryptoJS.SHA256(senha).toString(),
      ativo,
    };

    // Lógica para enviar dados atualizados
    try {
      await axios.patch(`http://localhost:8080/usuario/${userId}`, updatedData);
      onClose(); // Fechar modal após a atualização
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  };

  if (!userData) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Editar Usuário</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Nome</label>
            <input
              type="text"
              name="nome"
              value={userData.nome}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            {errors.nome && <p className="text-red-500 text-sm">{errors.nome}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Usuário</label>
            <input
              type="text"
              name="usuario"
              value={userData.usuario}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            {errors.usuario && <p className="text-red-500 text-sm">{errors.usuario}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Senha</label>
            <input
              type="password"
              name="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4 flex items-center">
            <label className="block text-sm font-medium mr-2">Ativo</label>
            <input
              type="checkbox"
              name="ativo"
              checked={ativo}
              onChange={handleCheckboxChange}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300 mr-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;

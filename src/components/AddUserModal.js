import axios from "axios";
import CryptoJS from "crypto-js";
import React, { useState } from "react";
import Modal from "react-modal";

const AddUserModal = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const validateFields = () => {
    const errors = {};
    if (!name) errors.name = "Nome é obrigatório";
    if (!email) errors.email = "Email é obrigatório";
    if (!username) errors.username = "Usuário é obrigatório";
    if (!password) errors.password = "Senha é obrigatória";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddUser = async () => {
    setError(null);
    if (!validateFields()) {
      return;
    }
    try {
      // Criptografa a senha com SHA-256
      const encryptedPassword = CryptoJS.SHA256(password).toString();

      const response = await axios.put("http://localhost:8080/usuario", {
        nome: name,
        email: email,
        usuario: username,
        senha: encryptedPassword,
      });
      console.log("Usuário adicionado:", response.data);
      onAdd();
      onClose();
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
      setError("Erro ao adicionar usuário");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Add User"
      className="fixed inset-0 flex items-center justify-center p-4"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Adicionar Usuário</h2>
        <div>
          <label className="block mb-2">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg mb-1"
          />
          {fieldErrors.name && (
            <p className="text-red-500 text-sm mb-4">{fieldErrors.name}</p>
          )}
        </div>
        <div>
          <label className="block mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg mb-1"
          />
          {fieldErrors.email && (
            <p className="text-red-500 text-sm mb-4">{fieldErrors.email}</p>
          )}
        </div>
        <div>
          <label className="block mb-2">Usuário</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg mb-1"
          />
          {fieldErrors.username && (
            <p className="text-red-500 text-sm mb-4">{fieldErrors.username}</p>
          )}
        </div>
        <div>
          <label className="block mb-2">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg mb-1"
          />
          {fieldErrors.password && (
            <p className="text-red-500 text-sm mb-4">{fieldErrors.password}</p>
          )}
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300 mr-2"
          >
            Cancelar
          </button>
          <button
            onClick={handleAddUser}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            Adicionar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddUserModal;

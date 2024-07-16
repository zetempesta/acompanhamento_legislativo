import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import AddUserModal from "./AddUserModal";
import ConfirmModal from "./ConfirmModal";
import EditUserModal from "./EditUserModal";
import Header from "./Header";

const Users = () => {
  const [activeItem, setActiveItem] = useState("Usuários");
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentInputPagination, setCurrentInputPagination] = useState(1);
  const [itemsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [totalElements, setTotalElements] = useState(0);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);

  const handleNavClick = (item) => {
    setActiveItem(item);
  };

  const fetchUsers = useCallback(
    async (page = 1, filter = "") => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:8080/usuarios`, {
          params: {
            page: page,
            size: itemsPerPage,
            filter: filter,
          },
        });
        if (response.data) {
          setUsers(response.data.content);
          setTotalElements(response.data.totalElements);
          setTotalPages(Math.ceil(response.data.totalElements / itemsPerPage));
          setCurrentInputPagination(page);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        setError("Erro ao buscar usuários");
        setUsers([]);
      }
      setIsLoading(false);
    },
    [itemsPerPage]
  );

  useEffect(() => {
    fetchUsers(currentPage, searchValue);
  }, [currentPage, fetchUsers, searchValue]);

  const handleKeyDown = (event) => {
    setCurrentPage(1);
    fetchUsers(1, searchValue);
  };

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleEdit = (userId) => {
    setEditingUserId(userId);
  };

  const handleDelete = (userId) => {
    setUserIdToDelete(userId);
    setConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(userIdToDelete);
    setConfirmModalOpen(false);
    try {
      const response = await axios.delete(`/usuario/${userIdToDelete}`);
      console.log("Usuário excluído:", response.data);
      fetchUsers(currentPage, searchValue);
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      setError("Erro ao excluir usuário");
    }
    setIsDeleting(null);
  };

  const handleCloseModal = () => {
    setEditingUserId(null);
    fetchUsers(currentPage);
  };

  const handleNewUser = () => {
    setAddUserModalOpen(true);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages && pageNumber) {
      if (pageNumber !== currentPage) {
        setCurrentInputPagination(pageNumber);
        setCurrentPage(pageNumber);
      }
    }
  };

  const handleInputPageChange = (event) => {
    const pageNumber = parseInt(event.target.value, 10);
    if (!isNaN(pageNumber)) {
      setCurrentInputPagination(pageNumber);
    }
  };

  const handlePageInputKeyDown = (event) => {
    const pageNumber = parseInt(event.target.value, 10);
    if (event.key === "Enter") {
      if (!isNaN(pageNumber)) {
        handlePageChange(pageNumber);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header activeItem={activeItem} onNavClick={handleNavClick} />
      <main className="p-4">
        <div className="flex items-center ">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">Usuários</h2>
          </div>
          <div className="flex items-right">
            <input
              className="text-gray-500 px-6 py-1 border border-gray-300 rounded-lg mb-4"
              placeholder="Pesquisar"
              value={searchValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="max-w-full mx-auto">
            <div className="max-h-[70vh] overflow-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-blue-800 text-white sticky top-0">
                  <tr>
                    <th className="py-3 px-4 text-left">ID</th>
                    <th className="py-3 px-4 text-left">Nome</th>
                    <th className="py-3 px-4 text-left">Usuário</th>
                    <th className="py-3 px-4 text-left">Email</th>
                    <th className="py-3 px-4 text-right">
                      <div className="items-right text-blue-900 space-x-2">
                        <button
                          onClick={() => handlePageChange(1)}
                          disabled={currentPage === 1}
                          className={`px-3 py-1 border border-gray-300 text-blue-500 rounded-md ${
                            currentPage === 1
                              ? "bg-gray-200 cursor-not-allowed"
                              : "bg-white hover:bg-gray-100"
                          }`}
                          aria-label="First Page"
                        >
                          <i className="fas fa-angle-double-left"></i>
                        </button>
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-3 py-1 border border-gray-300 text-blue-500 rounded-md ${
                            currentPage === 1
                              ? "bg-gray-200 cursor-not-allowed"
                              : "bg-white hover:bg-gray-100"
                          }`}
                          aria-label="Previous Page"
                        >
                          <i className="fas fa-angle-left"></i>
                        </button>
                        <input
                          value={currentInputPagination}
                          onChange={handleInputPageChange}
                          onKeyDown={handlePageInputKeyDown}
                          className="w-16 h-8 text-center border border-gray-300 rounded-md"
                          aria-label="Page Number"
                        />
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-1 border border-gray-300 text-blue-500 rounded-md ${
                            currentPage === totalPages
                              ? "bg-gray-200 cursor-not-allowed"
                              : "bg-white hover:bg-gray-100"
                          }`}
                          aria-label="Next Page"
                        >
                          <i className="fas fa-angle-right"></i>
                        </button>
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-1 border border-gray-300 text-blue-500 rounded-md ${
                            currentPage === totalPages
                              ? "bg-gray-200 cursor-not-allowed"
                              : "bg-white hover:bg-gray-100"
                          }`}
                          aria-label="Last Page"
                        >
                          <i className="fas fa-angle-double-right"></i>
                        </button>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="5" className="py-3 px-4 text-center">
                        Carregando...
                      </td>
                    </tr>
                  ) : users.length > 0 ? (
                    users.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-100 transition-colors duration-200"
                      >
                        <td className="py-3 px-4 border-b border-gray-200">
                          {user.id}
                        </td>
                        <td className="py-3 px-4 border-b border-gray-200">
                          {user.nome}
                        </td>
                        <td className="py-3 px-4 border-b border-gray-200">
                          {user.usuario}
                        </td>
                        <td className="py-3 px-4 border-b border-gray-200">
                          {user.email}
                        </td>
                        <td className="py-3 px-4 border-b border-gray-200 text-right">
                          <button
                            className="px-3 py-1 text-blue-500 rounded-lg hover:text-white hover:bg-blue-600 transition-colors duration-300 mr-2"
                            onClick={() => handleEdit(user.id)}
                          >
                            Editar
                          </button>
                          <button
                            className={`px-3 py-1 text-red-500 rounded-lg hover:text-white hover:bg-red-600 transition-colors duration-300 ${
                              isDeleting === user.id ? "cursor-not-allowed" : ""
                            }`}
                            onClick={() => handleDelete(user.id)}
                            disabled={isDeleting === user.id}
                          >
                            {isDeleting === user.id
                              ? "Excluindo..."
                              : "Excluir"}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-3 px-4 text-center">
                        Nenhum usuário encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-2 mb-4">
              <div className="flex items-center space-x-2">
                <button
                  className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
                  onClick={handleNewUser}
                >
                  <span>Novo</span>
                </button>
              </div>
              <span className="text-gray-500">Registros: {totalElements}</span>
            </div>
          </div>
        </div>
        {editingUserId !== null && (
          <EditUserModal userId={editingUserId} onClose={handleCloseModal} />
        )}
        {confirmModalOpen && (
          <ConfirmModal
            isOpen={confirmModalOpen}
            onClose={() => setConfirmModalOpen(false)}
            onConfirm={confirmDelete}
            message="Tem certeza de que deseja excluir este usuário?"
          />
        )}
        {addUserModalOpen && (
          <AddUserModal
            isOpen={addUserModalOpen}
            onClose={() => setAddUserModalOpen(false)}
            onAdd={() => fetchUsers(currentPage, searchValue)}
          />
        )}
        {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      </main>
    </div>
  );
};

export default Users;

// Users.js
import axios from "axios";
import React, { Component } from "react";
import AddUserModal from "./AddUserModal";
import ConfirmModal from "./ConfirmModal";
import EditUserModal from "./EditUserModal";
import Header from "./Header";

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: props.initialActiveItem || "Usuários",
      users: [],
      editingUserId: null,
      searchValue: props.initialSearchValue || "",
      isLoading: false,
      isDeleting: null,
      currentPage: 1,
      currentInputPagination: 1,
      itemsPerPage: 20,
      totalPages: 1,
      error: null,
      totalElements: 0,
      confirmModalOpen: false,
      userIdToDelete: null,
      addUserModalOpen: false,
      sortColumn: '',
      sortDirection: "asc",
      service_api: "http://localhost:8080/usuarios",
      columns: [
        {
          column: "id",
          title: "ID",
        },
        {
          column: "nome",
          title: "Nome",
        },
        {
          column: "usuario",
          title: "Usuário",
        },
        {
          column: "email",
          title: "Email",
        },
      ],
    };
  }

  componentDidMount() {
    this.fetchUsers(this.state.currentPage, this.state.searchValue);
  }

  handleNavClick = (item) => {
    this.setState({ activeItem: item });
  };

  getColumnByTitle = (title) => {
    const item = this.state.columns.find(
      (obj) => obj.title.toLowerCase() === title.toLowerCase()
    );
    return item ? item.column : null;
  };

  fetchUsers = async (
    page = 1,
    filter = "",
    sortColumn = this.state.sortColumn,
    sortDirection = this.state.sortDirection
  ) => {
    this.setState({ isLoading: true, error: null });
    try {
      const params =  {
        "page": page,
        "size": this.state.itemsPerPage,
        "filter": filter,
        "sort":{"sortColumn":sortColumn,"sortDirection":sortDirection},
      };


      const response = await axios.post(this.state.service_api, params);
      if (response.data) {
        this.setState({
          users: response.data.content,
          totalElements: response.data.totalElements,
          totalPages: Math.ceil(
            response.data.totalElements / this.state.itemsPerPage
          ),
          currentInputPagination: page,
        });
      } else {
        this.setState({ users: [] });
      }
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      this.setState({ error: "Erro ao buscar usuários", users: [] });
    }
    this.setState({ isLoading: false });
  };

  handleSort = (column) => {
    const { sortColumn, sortDirection } = this.state;

    

    let newSortDirection = "asc";
    if (sortColumn === column && sortDirection === "asc") {
      newSortDirection = "desc";
    }
    this.setState(
      {
        sortColumn: column,
        sortDirection: newSortDirection,
      },
      () => {
        this.fetchUsers(
          this.state.currentPage,
          this.state.searchValue,
          column,
          newSortDirection
        );
      }
    );
  };

  handleKeyDown = (event) => {
    this.setState({ currentPage: 1 });
    this.fetchUsers(1, this.state.searchValue);
  };

  handleInputChange = (event) => {
    this.setState({ searchValue: event.target.value });
  };

  handleEdit = (userId) => {
    this.setState({ editingUserId: userId });
  };

  handleDelete = (userId) => {
    this.setState({ userIdToDelete: userId, confirmModalOpen: true });
  };

  confirmDelete = async () => {
    const { userIdToDelete, currentPage, searchValue } = this.state;
    this.setState({ isDeleting: userIdToDelete, confirmModalOpen: false });
    try {
      const response = await axios.delete(`/usuario/${userIdToDelete}`);
      console.log("Usuário excluído:", response.data);
      this.fetchUsers(currentPage, searchValue);
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      this.setState({ error: "Erro ao excluir usuário" });
    }
    this.setState({ isDeleting: null });
  };

  handleCloseModal = () => {
    this.setState({ editingUserId: null });
    this.fetchUsers(this.state.currentPage);
  };

  handleNewUser = () => {
    this.setState({ addUserModalOpen: true });
  };

  handlePageChange = (pageNumber) => {
    const { totalPages, currentPage } = this.state;
    if (
      pageNumber >= 1 &&
      pageNumber <= totalPages &&
      pageNumber !== currentPage
    ) {
      this.setState({
        currentInputPagination: pageNumber,
        currentPage: pageNumber,
      });
      this.fetchUsers(pageNumber, this.state.searchValue);
    }
  };

  handleInputPageChange = (event) => {
    const pageNumber = parseInt(event.target.value, 10);
    if (!isNaN(pageNumber)) {
      this.setState({ currentInputPagination: pageNumber });
    }
  };

  handlePageInputKeyDown = (event) => {
    const pageNumber = parseInt(event.target.value, 10);
    if (event.key === "Enter" && !isNaN(pageNumber)) {
      this.handlePageChange(pageNumber);
    }
  };

  render() {
    const {
      activeItem,
      users,
      editingUserId,
      searchValue,
      isLoading,
      isDeleting,
      currentPage,
      currentInputPagination,
      totalPages,
      totalElements,
      confirmModalOpen,
      addUserModalOpen,
      error,
      sortColumn,
      sortDirection,
      columns,
    } = this.state;

    return (
      <div className="min-h-screen bg-gray-100">
        <Header activeItem={activeItem} onNavClick={this.handleNavClick} />
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
                onChange={this.handleInputChange}
                onKeyDown={this.handleKeyDown}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="max-w-full mx-auto">
              <div className="max-h-[70vh] overflow-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                  <thead className="bg-blue-800 text-white sticky top-0 rounded-md">
                    <tr>
                      {columns.map((item) => (
                        <th
                          key={item.column}
                          className="py-3 px-4 text-left cursor-pointer"
                          onClick={() => this.handleSort(item.column)}
                        >
                          {item.title}{" "}
                          {sortColumn === item.column
                            ? sortDirection === "asc"
                              ? "▲"
                              : "▼"
                            : ""}
                        </th>
                      ))}
                      {/* <th
                        className="py-3 px-4 text-left cursor-pointer"
                        onClick={() => this.handleSort("id")}
                      >
                        ID{" "}
                        {sortColumn === "id"
                          ? sortDirection === "asc"
                            ? "▲"
                            : "▼"
                          : ""}
                      </th>
                      <th
                        className="py-3 px-4 text-left cursor-pointer"
                        onClick={() => this.handleSort("nome")}
                      >
                        Nome{" "}
                        {sortColumn === "nome"
                          ? sortDirection === "asc"
                            ? "▲"
                            : "▼"
                          : ""}
                      </th>
                      <th
                        className="py-3 px-4 text-left cursor-pointer"
                        onClick={() => this.handleSort("usuario")}
                      >
                        Usuário{" "}
                        {sortColumn === "usuario"
                          ? sortDirection === "asc"
                            ? "▲"
                            : "▼"
                          : ""}
                      </th>
                      <th
                        className="py-3 px-4 text-left cursor-pointer"
                        onClick={() => this.handleSort("email")}
                      >
                        Email{" "}
                        {sortColumn === "email"
                          ? sortDirection === "asc"
                            ? "▲"
                            : "▼"
                          : ""}
                      </th> */}
                      <th className="py-3 px-4 text-right">
                        <div className="items-right text-blue-900 space-x-2">
                          <button
                            onClick={() => this.handlePageChange(1)}
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
                            onClick={() =>
                              this.handlePageChange(currentPage - 1)
                            }
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
                            onChange={this.handleInputPageChange}
                            onKeyDown={this.handlePageInputKeyDown}
                            className="w-16 h-8 text-center border border-gray-300 rounded-md"
                            aria-label="Page Number"
                          />
                          <button
                            onClick={() =>
                              this.handlePageChange(currentPage + 1)
                            }
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
                            onClick={() => this.handlePageChange(totalPages)}
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
                  <tbody className="rounded-md">
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
                              onClick={() => this.handleEdit(user.id)}
                            >
                              Editar
                            </button>
                            <button
                              className={`px-3 py-1 text-red-500 rounded-lg hover:text-white hover:bg-red-600 transition-colors duration-300 ${
                                isDeleting === user.id
                                  ? "cursor-not-allowed"
                                  : ""
                              }`}
                              onClick={() => this.handleDelete(user.id)}
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
                    className="mr-2 px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
                    onClick={this.handleNewUser}
                  >
                    <span>Novo</span>
                  </button>
                </div>
                <span className="text-gray-500 mr-2">
                  Registros: {totalElements}
                </span>
              </div>
            </div>
          </div>
          {editingUserId !== null && (
            <EditUserModal
              userId={editingUserId}
              onClose={this.handleCloseModal}
            />
          )}
          {confirmModalOpen && (
            <ConfirmModal
              isOpen={confirmModalOpen}
              onClose={() => this.setState({ confirmModalOpen: false })}
              onConfirm={this.confirmDelete}
              message="Tem certeza de que deseja excluir este usuário?"
            />
          )}
          {addUserModalOpen && (
            <AddUserModal
              isOpen={addUserModalOpen}
              onClose={() => this.setState({ addUserModalOpen: false })}
              onAdd={() =>
                this.fetchUsers(this.state.currentPage, this.state.searchValue)
              }
            />
          )}
          {error && (
            <div className="text-red-500 text-center mt-4">{error}</div>
          )}
        </main>
      </div>
    );
  }
}

export default Users;

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
      records: [],
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
      sortColumn: "",
      sortDirection: "asc",
      service_api: "http://localhost:8080/usuarios",
      tableTitle: "Usuários",
      showTitle: true,
      showSearch: true,
      showEdit: true,
      showDelete: true,
      showAdd: true,
      showCounter: true,
      showPagination: true,
      columns: {
        pk: "id",
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
      },
    };
  }

  componentDidMount() {
    this.fetchUsers(this.state.currentPage, this.state.searchValue);
  }

  handleNavClick = (item) => {
    this.setState({ activeItem: item });
  };

  fetchUsers = async (
    page = 1,
    filter = "",
    sortColumn = this.state.sortColumn,
    sortDirection = this.state.sortDirection
  ) => {
    this.setState({ isLoading: true, error: null });
    try {
      const params = {
        page: page,
        size: this.state.itemsPerPage,
        filter: filter,
        sort: { sortColumn: sortColumn, sortDirection: sortDirection },
      };

      const response = await axios.post(this.state.service_api, params);
      if (response.data) {
        this.setState({
          records: response.data.content,
          totalElements: response.data.totalElements,
          totalPages: Math.ceil(
            response.data.totalElements / this.state.itemsPerPage
          ),
          currentInputPagination: page,
        });
      } else {
        this.setState({ records: [] });
      }
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      this.setState({ error: "Erro ao buscar usuários", records: [] });
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
      records,
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
      tableTitle,
      showTitle,
      showSearch,
      showEdit,
      showDelete,
      showAdd,
      showCounter,
      showPagination,
    } = this.state;

    return (
      <div className="min-h-screen bg-gray-100">
        <Header activeItem={activeItem} onNavClick={this.handleNavClick} />
        <main className="p-4">
          {showTitle || showSearch ? (
            <div className="flex items-center ">
              {showTitle ? (
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-4">{tableTitle}</h2>
                </div>
              ) : null}

              {showSearch ? (
                <div className="flex items-right">
                  <input
                    className="text-gray-500 px-6 py-1 border border-gray-300 rounded-lg mb-4"
                    placeholder="Pesquisar"
                    value={searchValue}
                    onChange={this.handleInputChange}
                    onKeyDown={this.handleKeyDown}
                  />
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="overflow-x-auto">
            <div className="max-w-full mx-auto">
              <div className="max-h-[70vh] overflow-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                  <thead className="bg-blue-800 text-white sticky top-0 rounded-md">
                    <tr>
                      {columns.columns.map((item) => (
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
                      {showPagination||showEdit||showDelete? <th className="py-3 px-4 text-right">
                        {showPagination ? (
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
                        ) : null}
                      </th>:null}
                    </tr>
                  </thead>
                  <tbody className="rounded-md">
                    {isLoading ? (
                      <tr>
                        <td colSpan="5" className="py-3 px-4 text-center">
                          Carregando...
                        </td>
                      </tr>
                    ) : records.length > 0 ? (
                      records.map((record) => (
                        <tr
                          key={record[columns.pk]}
                          className="hover:bg-gray-100 transition-colors duration-200"
                        >
                          {columns.columns.map((column) => (
                            <td className="py-3 px-4 border-b border-gray-200">
                              {record[column.column]}
                            </td>
                          ))}
                          {showPagination||showEdit||showDelete?(<td className="py-3 px-4 border-b border-gray-200 text-right">
                            {showEdit ? (
                              <button
                                className="px-3 py-1 text-blue-500 rounded-lg hover:text-white hover:bg-blue-600 transition-colors duration-300 mr-2"
                                onClick={() =>
                                  this.handleEdit(record[columns.pk])
                                }
                              >
                                Editar
                              </button>
                            ) : null}
                            {showDelete ? (
                              <button
                                className={`px-3 py-1 text-red-500 rounded-lg hover:text-white hover:bg-red-600 transition-colors duration-300 ${
                                  isDeleting === record[columns.pk]
                                    ? "cursor-not-allowed"
                                    : ""
                                }`}
                                onClick={() =>
                                  this.handleDelete(record[columns.pk])
                                }
                                disabled={isDeleting === record[columns.pk]}
                              >
                                {isDeleting === record[columns.pk]
                                  ? "Excluindo..."
                                  : "Excluir"}
                              </button>
                            ) : null}
                          </td>):null}
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
                {showAdd ? (
                  <div className="flex items-center space-x-2">
                    <button
                      className="mr-2 px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
                      onClick={this.handleNewUser}
                    >
                      <span>Novo</span>
                    </button>
                  </div>
                ) : null}
                {showCounter ? (
                  <span className="text-gray-500 mr-2">
                    Registros: {totalElements}
                  </span>
                ) : null}
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

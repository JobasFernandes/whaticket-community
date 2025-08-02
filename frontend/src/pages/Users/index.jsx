import { useState, useEffect, useReducer } from "react";
import { toast } from "react-toastify";
import openSocket from "../../services/socket-io.js";
import {
  Search,
  Edit,
  Trash2,
  Plus,
  User,
  Mail,
  Shield,
  MessageCircle
} from "lucide-react";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";

import api from "../../services/api.js";
import { i18n } from "../../translate/i18n.js";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import UserModal from "../../components/UserModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError.js";

const reducer = (state, action) => {
  if (action.type === "LOAD_USERS") {
    const users = action.payload;
    const newUsers = [];

    users.forEach(user => {
      const userIndex = state.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        state[userIndex] = user;
      } else {
        newUsers.push(user);
      }
    });

    return [...state, ...newUsers];
  }

  if (action.type === "UPDATE_USERS") {
    const user = action.payload;
    const userIndex = state.findIndex(u => u.id === user.id);

    if (userIndex !== -1) {
      state[userIndex] = user;
      return [...state];
    } else {
      return [user, ...state];
    }
  }

  if (action.type === "DELETE_USER") {
    const userId = action.payload;

    const userIndex = state.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      state.splice(userIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }
};

const Users = () => {
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [users, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchUsers = async () => {
        try {
          const { data } = await api.get("/users/", {
            params: { searchParam, pageNumber }
          });
          dispatch({ type: "LOAD_USERS", payload: data.users });
          setHasMore(data.hasMore);
          setLoading(false);
        } catch (err) {
          toastError(err);
        }
      };
      fetchUsers();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam, pageNumber]);

  useEffect(() => {
    const socket = openSocket();
    if (!socket) return;

    socket.on("user", data => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_USERS", payload: data.user });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_USER", payload: +data.userId });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleOpenUserModal = () => {
    setSelectedUser(null);
    setUserModalOpen(true);
  };

  const handleCloseUserModal = () => {
    setSelectedUser(null);
    setUserModalOpen(false);
  };

  const handleSearch = event => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleEditUser = user => {
    setSelectedUser(user);
    setUserModalOpen(true);
  };

  const handleDeleteUser = async userId => {
    try {
      await api.delete(`/users/${userId}`);
      toast.success(i18n.t("users.toasts.deleted"));
    } catch (err) {
      toastError(err);
    }
    setDeletingUser(null);
    setSearchParam("");
    setPageNumber(1);
  };

  const loadMore = () => {
    setPageNumber(prevState => prevState + 1);
  };

  const handleScroll = e => {
    if (!hasMore || loading) return;
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - (scrollTop + 100) < clientHeight) {
      loadMore();
    }
  };

  return (
    <MainContainer>
      <ConfirmationModal
        title={
          deletingUser &&
          `${i18n.t("users.confirmationModal.deleteTitle")} ${
            deletingUser.name
          }?`
        }
        open={confirmModalOpen}
        onClose={setConfirmModalOpen}
        onConfirm={() => handleDeleteUser(deletingUser.id)}
      >
        {i18n.t("users.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <UserModal
        open={userModalOpen}
        onClose={handleCloseUserModal}
        aria-labelledby="form-dialog-title"
        userId={selectedUser && selectedUser.id}
      />

      {/* Title for mobile - outside header */}
      <div className="md:hidden px-4 py-2">
        <Title className="text-center">{i18n.t("users.title")}</Title>
      </div>

      <MainHeader>
        {/* Title for desktop - inside header */}
        <div className="hidden md:block">
          <Title>{i18n.t("users.title")}</Title>
        </div>

        <MainHeaderButtonsWrapper>
          {/* Search Input */}
          <div className="relative flex-1 md:flex-none md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="search"
              placeholder={i18n.t("contacts.searchPlaceholder")}
              value={searchParam}
              onChange={handleSearch}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm transition-all duration-200"
            />
          </div>

          {/* Add User Button */}
          <button
            onClick={handleOpenUserModal}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-lg transition-all duration-200 md:px-4 sm:px-3 sm:w-auto"
            title={i18n.t("users.buttons.add")}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">
              {i18n.t("users.buttons.add")}
            </span>
          </button>
        </MainHeaderButtonsWrapper>
      </MainHeader>

      {/* Users Table */}
      <div className="flex-1 overflow-hidden bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700">
        <div
          className="h-full overflow-y-auto custom-scrollbar"
          onScroll={handleScroll}
        >
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800/50 sticky top-0">
              <tr>
                {/* Name column */}
                <th className="px-4 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider max-w-0 w-full">
                  {i18n.t("users.table.name")}
                </th>
                {/* Email column - hidden on mobile */}
                <th className="hidden md:table-cell px-4 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {i18n.t("users.table.email")}
                </th>
                {/* Profile column - hidden on mobile */}
                <th className="hidden lg:table-cell px-4 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {i18n.t("users.table.profile")}
                </th>
                {/* WhatsApp column - hidden on mobile */}
                <th className="hidden lg:table-cell px-4 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[180px]">
                  {i18n.t("users.table.whatsapp")}
                </th>
                {/* Actions column */}
                <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">
                  {i18n.t("users.table.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-[#1e1e1e] divide-y divide-gray-200 dark:divide-gray-700">
              {users.map(user => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                >
                  {/* Name with user info on mobile */}
                  <td className="px-4 py-1 max-w-0 w-full">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {user.name}
                        </div>
                        {/* User info on mobile */}
                        <div className="md:hidden space-y-1 mt-1">
                          <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                            <Mail className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                              <Shield className="h-3 w-3 flex-shrink-0" />
                              <span
                                className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                                  user.profile === "admin"
                                    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                                }`}
                              >
                                {user.profile}
                              </span>
                            </div>
                            {user.whatsapp?.name && (
                              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                                <MessageCircle className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">
                                  {user.whatsapp.name}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  {/* Email - hidden on mobile */}
                  <td className="hidden md:table-cell px-4 py-1">
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                      <Mail className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  </td>
                  {/* Profile - hidden on mobile and tablet */}
                  <td className="hidden lg:table-cell px-4 py-1 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.profile === "admin"
                          ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      {user.profile}
                    </span>
                  </td>
                  {/* WhatsApp - hidden on mobile and tablet */}
                  <td className="hidden lg:table-cell px-4 py-1 text-center">
                    <div className="flex items-center justify-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                      {user.whatsapp?.name ? (
                        <>
                          <MessageCircle className="h-3 w-3" />
                          {user.whatsapp.name}
                        </>
                      ) : (
                        "-"
                      )}
                    </div>
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-1">
                    <div className="flex items-center justify-center gap-1">
                      {/* Edit Button */}
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                        title={i18n.t("common.edit")}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => {
                          setConfirmModalOpen(true);
                          setDeletingUser(user);
                        }}
                        className="p-1.5 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                        title={i18n.t("common.delete")}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {loading && <TableRowSkeleton columns={4} />}
            </tbody>
          </table>
        </div>
      </div>
    </MainContainer>
  );
};

export default Users;

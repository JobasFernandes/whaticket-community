import { useState, useEffect, useReducer, useContext } from "react";
import openSocket from "../../services/socket-io.js";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import {
  Search,
  MessageCircle,
  Edit,
  Trash2,
  Plus,
  Download,
  User,
  Phone,
  Mail
} from "lucide-react";

import api from "../../services/api.js";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import ContactModal from "../../components/ContactModal";
import ConfirmationModal from "../../components/ConfirmationModal/";

import { i18n } from "../../translate/i18n.js";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import MainContainer from "../../components/MainContainer";
import toastError from "../../errors/toastError.js";
import { AuthContext } from "../../context/Auth/AuthContext";
import { Can } from "../../components/Can";

const reducer = (state, action) => {
  if (action.type === "LOAD_CONTACTS") {
    const contacts = action.payload;
    const newContacts = [];

    contacts.forEach(contact => {
      const contactIndex = state.findIndex(c => c.id === contact.id);
      if (contactIndex !== -1) {
        state[contactIndex] = contact;
      } else {
        newContacts.push(contact);
      }
    });

    return [...state, ...newContacts];
  }

  if (action.type === "UPDATE_CONTACTS") {
    const contact = action.payload;
    const contactIndex = state.findIndex(c => c.id === contact.id);

    if (contactIndex !== -1) {
      state[contactIndex] = contact;
      return [...state];
    } else {
      return [contact, ...state];
    }
  }

  if (action.type === "DELETE_CONTACT") {
    const contactId = action.payload;

    const contactIndex = state.findIndex(c => c.id === contactId);
    if (contactIndex !== -1) {
      state.splice(contactIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }
};

const Contacts = () => {
  const history = useHistory();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchParam, setSearchParam] = useState("");
  const [contacts, dispatch] = useReducer(reducer, []);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [deletingContact, setDeletingContact] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchContacts = async () => {
        try {
          const { data } = await api.get("/contacts/", {
            params: { searchParam, pageNumber }
          });
          dispatch({ type: "LOAD_CONTACTS", payload: data.contacts });
          setHasMore(data.hasMore);
          setLoading(false);
        } catch (err) {
          toastError(err);
        }
      };
      fetchContacts();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam, pageNumber]);

  useEffect(() => {
    const socket = openSocket();

    socket.on("contact", data => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_CONTACTS", payload: data.contact });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_CONTACT", payload: +data.contactId });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSearch = event => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleOpenContactModal = () => {
    setSelectedContactId(null);
    setContactModalOpen(true);
  };

  const handleCloseContactModal = () => {
    setSelectedContactId(null);
    setContactModalOpen(false);
  };

  const handleSaveTicket = async contactId => {
    if (!contactId) return;
    setLoading(true);
    try {
      const { data: ticket } = await api.post("/tickets", {
        contactId: contactId,
        userId: user?.id,
        status: "open"
      });
      history.push(`/tickets/${ticket.id}`);
    } catch (err) {
      toastError(err);
    }
    setLoading(false);
  };

  const hadleEditContact = contactId => {
    setSelectedContactId(contactId);
    setContactModalOpen(true);
  };

  const handleDeleteContact = async contactId => {
    try {
      await api.delete(`/contacts/${contactId}`);
      toast.success(i18n.t("contacts.toasts.deleted"));
    } catch (err) {
      toastError(err);
    }
    setDeletingContact(null);
    setSearchParam("");
    setPageNumber(1);
  };

  const handleCloseConfirmModal = () => {
    setConfirmOpen(false);
    setDeletingContact(null);
  };

  const handleimportContact = async () => {
    try {
      await api.post("/contacts/import");
      history.go(0);
    } catch (err) {
      toastError(err);
    }
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
      <ContactModal
        open={contactModalOpen}
        onClose={handleCloseContactModal}
        contactId={selectedContactId}
      />
      <ConfirmationModal
        title={
          deletingContact
            ? `${i18n.t("contacts.confirmationModal.deleteTitle")} ${
                deletingContact.name
              }?`
            : `${i18n.t("contacts.confirmationModal.importTitlte")}`
        }
        open={confirmOpen}
        onClose={handleCloseConfirmModal}
        onConfirm={e =>
          deletingContact
            ? handleDeleteContact(deletingContact.id)
            : handleimportContact()
        }
      >
        {deletingContact
          ? `${i18n.t("contacts.confirmationModal.deleteMessage")}`
          : `${i18n.t("contacts.confirmationModal.importMessage")}`}
      </ConfirmationModal>

      {/* Title for mobile - outside header */}
      <div className="md:hidden px-4 py-2">
        <Title className="text-center">{i18n.t("contacts.title")}</Title>
      </div>

      <MainHeader>
        {/* Title for desktop - inside header */}
        <div className="hidden md:block">
          <Title>{i18n.t("contacts.title")}</Title>
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

          {/* Import Button */}
          <button
            onClick={() => {
              setDeletingContact(null);
              setConfirmOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all duration-200 md:px-4 sm:px-3 sm:w-auto"
            title={i18n.t("contacts.buttons.import")}
          >
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">
              {i18n.t("contacts.buttons.import")}
            </span>
          </button>

          {/* Add Contact Button */}
          <button
            onClick={handleOpenContactModal}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-lg transition-all duration-200 md:px-4 sm:px-3 sm:w-auto"
            title={i18n.t("contacts.buttons.add")}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">
              {i18n.t("contacts.buttons.add")}
            </span>
          </button>
        </MainHeaderButtonsWrapper>
      </MainHeader>

      {/* Contacts Table */}
      <div
        className="flex-1 overflow-hidden bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700"
        onScroll={handleScroll}
      >
        <div className="h-full overflow-y-auto custom-scrollbar">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800/50 sticky top-0">
              <tr>
                {/* Avatar column - hidden on mobile */}
                <th className="hidden md:table-cell px-4 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">
                  {/* Avatar column */}
                </th>
                {/* Name column */}
                <th className="px-4 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider max-w-0 w-full">
                  {i18n.t("contacts.table.name")}
                </th>
                {/* WhatsApp column - hidden on mobile */}
                <th className="hidden md:table-cell px-4 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {i18n.t("contacts.table.whatsapp")}
                </th>
                {/* Email column - hidden on mobile */}
                <th className="hidden lg:table-cell px-4 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {i18n.t("contacts.table.email")}
                </th>
                {/* Actions column */}
                <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32">
                  {i18n.t("contacts.table.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-[#1e1e1e] divide-y divide-gray-200 dark:divide-gray-700">
              {contacts.map(contact => (
                <tr
                  key={contact.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                >
                  {/* Avatar - hidden on mobile */}
                  <td className="hidden md:table-cell px-4 py-1">
                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                      {contact.profilePicUrl ? (
                        <img
                          src={contact.profilePicUrl}
                          alt={contact.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </td>
                  {/* Name with contact info on mobile */}
                  <td className="px-4 py-1 max-w-0 w-full">
                    <div className="flex items-center gap-3 md:block">
                      {/* Avatar on mobile */}
                      <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden md:hidden flex-shrink-0">
                        {contact.profilePicUrl ? (
                          <img
                            src={contact.profilePicUrl}
                            alt={contact.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {contact.name}
                        </div>
                        {/* Contact info on mobile */}
                        <div className="md:hidden space-y-1 mt-1">
                          <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                            <Phone className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{contact.number}</span>
                          </div>
                          {contact.email && (
                            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                              <Mail className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{contact.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  {/* WhatsApp - hidden on mobile */}
                  <td className="hidden md:table-cell px-4 py-1 text-center">
                    <div className="flex items-center justify-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                      <Phone className="h-3 w-3" />
                      {contact.number}
                    </div>
                  </td>
                  {/* Email - hidden on mobile and tablet */}
                  <td className="hidden lg:table-cell px-4 py-1 text-center">
                    <div className="flex items-center justify-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                      {contact.email && <Mail className="h-3 w-3" />}
                      {contact.email || "-"}
                    </div>
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-1">
                    <div className="flex items-center justify-center gap-1">
                      {/* WhatsApp/Chat Button */}
                      <button
                        onClick={() => handleSaveTicket(contact.id)}
                        className="p-1.5 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30 rounded transition-colors"
                        title="Criar ticket"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => hadleEditContact(contact.id)}
                        className="p-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                        title="Editar contato"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button */}
                      <Can
                        role={user.profile}
                        perform="contacts-page:deleteContact"
                        yes={() => (
                          <button
                            onClick={() => {
                              setDeletingContact(contact);
                              setConfirmOpen(true);
                            }}
                            className="p-1.5 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                            title="Excluir contato"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {loading && <TableRowSkeleton avatar columns={3} />}
            </tbody>
          </table>
        </div>
      </div>
    </MainContainer>
  );
};

export default Contacts;

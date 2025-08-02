import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { X, User, List, MessageSquare } from "lucide-react";
import * as Yup from "yup";
import { Formik, Form } from "formik";

import { i18n } from "../../translate/i18n.js";
import api from "../../services/api.js";
import ContactModal from "../ContactModal";
import toastError from "../../errors/toastError.js";
import { AuthContext } from "../../context/Auth/context";
import useQueues from "../../hooks/useQueues";
import useWhatsApps from "../../hooks/useWhatsApps";

const ModernSelect = ({
  label,
  icon: Icon,
  error,
  helperText,
  options = [],
  value,
  onChange,
  placeholder,
  className = "",
  ...props
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <Icon className="h-3.5 w-3.5 text-gray-400" />
          </div>
        )}
        <select
          {...props}
          value={value}
          onChange={onChange}
          className={`
            block w-full ${Icon ? "pl-8" : "pl-2.5"} pr-8 py-2 
            border ${error ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"} 
            rounded-md shadow-sm
            focus:outline-none focus:ring-1 ${error ? "focus:ring-red-500" : "focus:ring-blue-500"} 
            ${error ? "focus:border-red-500" : "focus:border-blue-500"}
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            transition-all duration-200
            text-sm
          `}
        >
          <option value="">{placeholder}</option>
          {options.map(option => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
      {helperText && (
        <p className="text-xs text-red-600 dark:text-red-400">{helperText}</p>
      )}
    </div>
  );
};

const ModernAutocomplete = ({
  label,
  icon: Icon,
  error,
  helperText,
  options = [],
  value,
  onChange,
  onInputChange,
  placeholder,
  loading = false,
  className = "",
  allowNew = false,
  disabled = false,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const displayOptions = [...filteredOptions];
  if (
    allowNew &&
    inputValue.length >= 3 &&
    !filteredOptions.find(opt => opt.name === inputValue)
  ) {
    displayOptions.push({ id: "new", name: inputValue, isNew: true });
  }

  const handleInputChange = e => {
    if (disabled) return;
    const newValue = e.target.value;
    setInputValue(newValue);
    onInputChange?.(newValue);
    setIsOpen(newValue.length > 0);
  };

  const handleOptionSelect = option => {
    if (disabled) return;
    onChange(option);
    if (!option.isNew) {
      setInputValue(option.name);
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    if (disabled) return;
    onChange(null);
    setInputValue("");
    setIsOpen(false);
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <Icon className="h-3.5 w-3.5 text-gray-400" />
          </div>
        )}
        <input
          {...props}
          type="text"
          value={value && !value.isNew ? value.name : inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            block w-full ${Icon ? "pl-8" : "pl-2.5"} pr-8 py-2 
            border ${error ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"} 
            rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-1 ${error ? "focus:ring-red-500" : "focus:ring-blue-500"} 
            ${error ? "focus:border-red-500" : "focus:border-blue-500"}
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            ${disabled ? "opacity-60 cursor-not-allowed" : ""}
            transition-all duration-200
            text-sm
          `}
        />
        {value && !value.isNew && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center">
            <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Dropdown */}
        {!disabled && isOpen && displayOptions.length > 0 && (
          <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
            {displayOptions.map(option => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleOptionSelect(option)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
              >
                {option.isNew
                  ? `${i18n.t("newTicketModal.add")} ${option.name}`
                  : option.number
                    ? `${option.name} - ${option.number}`
                    : option.name}
              </button>
            ))}
          </div>
        )}
      </div>
      {helperText && (
        <p className="text-xs text-red-600 dark:text-red-400">{helperText}</p>
      )}
    </div>
  );
};

const NewTicketSchema = Yup.object().shape({
  selectedContact: Yup.object()
    .nullable()
    .required(i18n.t("newTicketModal.contact") + " é obrigatório"),
  selectedQueue: Yup.string().required(
    i18n.t("newTicketModal.queue") + " é obrigatória"
  ),
  selectedWhatsapp: Yup.string().required(
    i18n.t("newTicketModal.connection") + " é obrigatória"
  )
});

const NewTicketModal = ({ modalOpen, onClose, initialContact = null }) => {
  const history = useHistory();

  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [newContact, setNewContact] = useState({});
  const [tempSetFieldValue, setTempSetFieldValue] = useState(null);
  const { user } = useContext(AuthContext);
  const { findAll: findAllQueues } = useQueues();
  const { loading: loadingWhatsapps, whatsApps } = useWhatsApps(true);
  const [queues, setQueues] = useState([]);

  const initialState = {
    selectedContact: initialContact || null,
    selectedQueue: "",
    selectedWhatsapp: ""
  };

  useEffect(() => {
    const loadQueues = async () => {
      try {
        const list = await findAllQueues();
        setQueues(list);
      } catch (err) {
        toastError(err);
      }
    };
    loadQueues();
  }, []);

  // Limpar searchParam quando o modal for fechado ou quando um contato inicial for fornecido
  useEffect(() => {
    if (!modalOpen) {
      setSearchParam("");
    } else if (initialContact) {
      setSearchParam("");
    }
  }, [modalOpen, initialContact]);

  useEffect(() => {
    if (!modalOpen || searchParam.length < 3) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchContacts = async () => {
        try {
          const { data } = await api.get("contacts", {
            params: { searchParam }
          });
          setOptions(data.contacts);
          setLoading(false);
        } catch (err) {
          setLoading(false);
          toastError(err);
        }
      };

      fetchContacts();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam, modalOpen]);

  const handleClose = () => {
    onClose();
    setSearchParam("");
  };

  const handleContactSelect = (contact, setFieldValue) => {
    if (contact?.isNew) {
      setNewContact({ name: contact.name });
      setTempSetFieldValue(() => setFieldValue);
      setContactModalOpen(true);
    } else {
      setFieldValue("selectedContact", contact);
    }
  };

  const handleSaveTicket = async values => {
    if (!values.selectedContact?.id) return;
    setLoading(true);
    try {
      const ticketData = {
        contactId: values.selectedContact.id,
        userId: user.id,
        status: "open"
      };

      // Adicionar queueId se selecionado
      if (values.selectedQueue) {
        ticketData.queueId = parseInt(values.selectedQueue);
      }

      // Adicionar whatsappId se selecionado
      if (values.selectedWhatsapp) {
        ticketData.whatsappId = parseInt(values.selectedWhatsapp);
      }

      const { data: ticket } = await api.post("/tickets", ticketData);

      history.push(`/tickets/${ticket.id}`);
    } catch (err) {
      toastError(err);
    }
    setLoading(false);
    handleClose();
  };

  const handleCloseContactModal = () => {
    setContactModalOpen(false);
    setTempSetFieldValue(null);
  };

  const handleAddNewContactTicket = contact => {
    if (tempSetFieldValue) {
      tempSetFieldValue("selectedContact", contact);
    }
    setContactModalOpen(false);
    setTempSetFieldValue(null);
  };

  if (!modalOpen) return null;

  return (
    <>
      <ContactModal
        open={contactModalOpen}
        initialValues={newContact}
        onClose={handleCloseContactModal}
        onSave={handleAddNewContactTicket}
      />

      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-black opacity-50"></div>
          </div>

          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <div className="inline-block align-bottom bg-white dark:bg-[#1e1e1e] rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                type="button"
                className="bg-white dark:bg-[#1e1e1e] rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={handleClose}
              >
                <span className="sr-only">Close</span>
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="sm:flex sm:items-start">
              <div className="w-full mt-3 text-center sm:mt-0 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                  {i18n.t("newTicketModal.title")}
                </h3>

                <Formik
                  initialValues={initialState}
                  validationSchema={NewTicketSchema}
                  onSubmit={handleSaveTicket}
                  enableReinitialize
                >
                  {({ values, errors, touched, setFieldValue, isValid }) => (
                    <Form className="space-y-4">
                      <ModernAutocomplete
                        label={i18n.t("newTicketModal.fieldLabel")}
                        icon={User}
                        value={values.selectedContact}
                        onChange={contact =>
                          handleContactSelect(contact, setFieldValue)
                        }
                        onInputChange={setSearchParam}
                        options={options}
                        placeholder={i18n.t("newTicketModal.fieldLabel")}
                        loading={loading}
                        allowNew={!initialContact}
                        disabled={!!initialContact}
                        error={
                          touched.selectedContact && errors.selectedContact
                        }
                        helperText={
                          touched.selectedContact && errors.selectedContact
                        }
                      />

                      <ModernSelect
                        label={i18n.t("newTicketModal.queue")}
                        icon={List}
                        value={values.selectedQueue}
                        onChange={e =>
                          setFieldValue("selectedQueue", e.target.value)
                        }
                        options={queues}
                        placeholder={i18n.t("newTicketModal.selectQueue")}
                        error={touched.selectedQueue && errors.selectedQueue}
                        helperText={
                          touched.selectedQueue && errors.selectedQueue
                        }
                      />

                      {!loadingWhatsapps && (
                        <ModernSelect
                          label={i18n.t("newTicketModal.connection")}
                          icon={MessageSquare}
                          value={values.selectedWhatsapp}
                          onChange={e =>
                            setFieldValue("selectedWhatsapp", e.target.value)
                          }
                          options={whatsApps}
                          placeholder={i18n.t(
                            "newTicketModal.selectConnection"
                          )}
                          error={
                            touched.selectedWhatsapp && errors.selectedWhatsapp
                          }
                          helperText={
                            touched.selectedWhatsapp && errors.selectedWhatsapp
                          }
                        />
                      )}

                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                          type="submit"
                          disabled={
                            loading ||
                            !isValid ||
                            !values.selectedContact ||
                            !values.selectedQueue ||
                            !values.selectedWhatsapp
                          }
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          )}
                          {i18n.t("newTicketModal.buttons.ok")}
                        </button>
                        <button
                          type="button"
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                          onClick={handleClose}
                          disabled={loading}
                        >
                          {i18n.t("newTicketModal.buttons.cancel")}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewTicketModal;

import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { X, User, List, MessageSquare } from "lucide-react";
import * as Yup from "yup";
import { Formik, Form } from "formik";

import { i18n } from "../../translate/i18n";
import api from "../../services/api.js";
import toastError from "../../errors/toastError";
import useQueues from "../../hooks/useQueues";
import useWhatsApps from "../../hooks/useWhatsApps";
import { AuthContext } from "../../context/Auth/context";
import { Can } from "../Can";

// Modern Select Component
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

// Modern Autocomplete Component
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
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleInputChange = e => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onInputChange?.(newValue);
    setIsOpen(newValue.length > 0);
  };

  const handleOptionSelect = option => {
    onChange(option);
    setInputValue(option.name);
    setIsOpen(false);
  };

  const handleClear = () => {
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
          value={value ? value.name : inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`
            block w-full ${Icon ? "pl-8" : "pl-2.5"} pr-8 py-2 
            border ${error ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"} 
            rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-1 ${error ? "focus:ring-red-500" : "focus:ring-blue-500"} 
            ${error ? "focus:border-red-500" : "focus:border-blue-500"}
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            transition-all duration-200
            text-sm
          `}
        />
        {value && (
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
        {isOpen && filteredOptions.length > 0 && (
          <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
            {filteredOptions.map(option => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleOptionSelect(option)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
              >
                {option.name}
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

const TransferSchema = Yup.object().shape({
  // Todos os campos são opcionais, mas pelo menos um deve ser preenchido
});

const TransferTicketModal = ({
  modalOpen,
  onClose,
  ticketid,
  ticketWhatsappId
}) => {
  const history = useHistory();
  const { user: loggedInUser } = useContext(AuthContext);

  if (!loggedInUser?.id) return null;

  const [options, setOptions] = useState([]);
  const [queues, setQueues] = useState([]);
  const [allQueues, setAllQueues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const { findAll: findAllQueues } = useQueues();
  const { loading: loadingWhatsapps, whatsApps } = useWhatsApps(true);

  const initialState = {
    selectedUser: null,
    selectedQueue: "",
    selectedWhatsapp: ticketWhatsappId || ""
  };

  useEffect(() => {
    const loadQueues = async () => {
      const list = await findAllQueues();
      setAllQueues(list);
      setQueues(list);
    };
    loadQueues();
  }, []);

  useEffect(() => {
    if (!modalOpen || searchParam.length < 3 || !loggedInUser?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchUsers = async () => {
        try {
          const { data } = await api.get("/users/", {
            params: { searchParam }
          });
          setOptions(data.users);
          setLoading(false);
        } catch (err) {
          setLoading(false);
          if (err?.response?.status !== 401 && err?.response?.status !== 403) {
            toastError(err);
          }
        }
      };

      fetchUsers();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam, modalOpen, loggedInUser?.id]);

  const handleClose = () => {
    onClose();
    setSearchParam("");
  };

  const handleUserChange = (user, setFieldValue) => {
    setFieldValue("selectedUser", user);
    if (user && Array.isArray(user.queues)) {
      setQueues(user.queues);
    } else {
      setQueues(allQueues);
      setFieldValue("selectedQueue", "");
    }
  };

  const handleSaveTicket = async values => {
    if (!ticketid) return;
    setLoading(true);
    try {
      let data = {};

      if (values.selectedUser) {
        data.userId = values.selectedUser.id;
      }

      if (values.selectedQueue && values.selectedQueue !== "") {
        data.queueId = values.selectedQueue;

        // Se não há usuário selecionado, colocar como pending
        if (!values.selectedUser) {
          data.status = "pending";
          data.userId = null;
        }
      }

      if (values.selectedWhatsapp) {
        data.whatsappId = values.selectedWhatsapp;
      }

      await api.put(`/tickets/${ticketid}`, data);

      setLoading(false);
      history.push(`/tickets`);
    } catch (err) {
      setLoading(false);
      toastError(err);
    }
  };

  if (!modalOpen) return null;

  return (
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
                {i18n.t("transferTicketModal.title")}
              </h3>

              <Formik
                initialValues={initialState}
                validationSchema={TransferSchema}
                onSubmit={handleSaveTicket}
                enableReinitialize
              >
                {({ values, errors, touched, setFieldValue, isSubmitting }) => (
                  <Form className="space-y-4">
                    <ModernAutocomplete
                      label={i18n.t("transferTicketModal.fieldLabel")}
                      icon={User}
                      value={values.selectedUser}
                      onChange={user => handleUserChange(user, setFieldValue)}
                      onInputChange={setSearchParam}
                      options={options}
                      placeholder={i18n.t("transferTicketModal.fieldLabel")}
                      loading={loading}
                      error={touched.selectedUser && errors.selectedUser}
                      helperText={touched.selectedUser && errors.selectedUser}
                    />

                    <ModernSelect
                      label={i18n.t("transferTicketModal.fieldQueueLabel")}
                      icon={List}
                      value={values.selectedQueue}
                      onChange={e =>
                        setFieldValue("selectedQueue", e.target.value)
                      }
                      options={queues}
                      placeholder={i18n.t(
                        "transferTicketModal.fieldQueuePlaceholder"
                      )}
                      error={touched.selectedQueue && errors.selectedQueue}
                      helperText={touched.selectedQueue && errors.selectedQueue}
                    />

                    <Can
                      role={loggedInUser.profile}
                      perform="ticket-options:transferWhatsapp"
                      yes={() =>
                        !loadingWhatsapps && (
                          <ModernSelect
                            label={i18n.t(
                              "transferTicketModal.fieldConnectionLabel"
                            )}
                            icon={MessageSquare}
                            value={values.selectedWhatsapp}
                            onChange={e =>
                              setFieldValue("selectedWhatsapp", e.target.value)
                            }
                            options={whatsApps}
                            placeholder={i18n.t(
                              "transferTicketModal.fieldConnectionPlaceholder"
                            )}
                            error={
                              touched.selectedWhatsapp &&
                              errors.selectedWhatsapp
                            }
                            helperText={
                              touched.selectedWhatsapp &&
                              errors.selectedWhatsapp
                            }
                          />
                        )
                      }
                    />

                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading && (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        )}
                        {i18n.t("transferTicketModal.buttons.ok")}
                      </button>
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                        onClick={handleClose}
                        disabled={loading}
                      >
                        {i18n.t("transferTicketModal.buttons.cancel")}
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
  );
};

export default TransferTicketModal;

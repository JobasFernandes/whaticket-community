import React, { useState, useEffect, useContext } from "react";
import { X, List, User } from "lucide-react";
import * as Yup from "yup";
import { Formik, Form } from "formik";

import { i18n } from "../../translate/i18n.js";
import api from "../../services/api.js";
import toastError from "../../errors/toastError.js";
import { AuthContext } from "../../context/Auth/context";
import useQueues from "../../hooks/useQueues";

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

const AcceptTicketSchema = Yup.object().shape({
  selectedQueue: Yup.string().required(
    i18n.t("acceptTicketModal.queue") + " é obrigatória"
  )
});

const AcceptTicketWithoutQueueModal = ({
  modalOpen,
  onClose,
  ticket,
  onAccept
}) => {
  const { user } = useContext(AuthContext);
  const { findAll: findAllQueues } = useQueues();
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(false);

  const initialState = {
    selectedQueue: ""
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

  const handleClose = () => {
    onClose();
  };

  const handleAcceptTicket = async values => {
    if (!ticket?.id || !values.selectedQueue) return;
    setLoading(true);

    try {
      await api.put(`/tickets/${ticket.id}`, {
        status: "open",
        userId: user?.id,
        queueId: parseInt(values.selectedQueue)
      });

      if (onAccept) {
        onAccept(ticket.id);
      }

      handleClose();
    } catch (err) {
      toastError(err);
    } finally {
      setLoading(false);
    }
  };

  if (!modalOpen || !ticket || ticket.queueId) return null;

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-black opacity-75"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white dark:bg-[#1e1e1e] rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6">
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
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0">
                  {ticket?.contact?.profilePicUrl ? (
                    <img
                      src={ticket.contact.profilePicUrl}
                      alt={ticket.contact.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                      <User
                        size={20}
                        className="text-gray-500 dark:text-gray-400"
                      />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    {i18n.t("acceptTicketModal.title")}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {ticket.contact.name}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {i18n.t("acceptTicketModal.description")}
                </p>
              </div>

              <Formik
                initialValues={initialState}
                validationSchema={AcceptTicketSchema}
                onSubmit={handleAcceptTicket}
                enableReinitialize
              >
                {({ values, errors, touched, setFieldValue, isValid }) => (
                  <Form className="space-y-4">
                    <ModernSelect
                      label={i18n.t("acceptTicketModal.queue")}
                      icon={List}
                      value={values.selectedQueue}
                      onChange={e =>
                        setFieldValue("selectedQueue", e.target.value)
                      }
                      options={queues}
                      placeholder={i18n.t("acceptTicketModal.selectQueue")}
                      error={touched.selectedQueue && errors.selectedQueue}
                      helperText={touched.selectedQueue && errors.selectedQueue}
                    />

                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                      <button
                        type="submit"
                        disabled={loading || !isValid || !values.selectedQueue}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading && (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        )}
                        {i18n.t("acceptTicketModal.buttons.accept")}
                      </button>
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                        onClick={handleClose}
                        disabled={loading}
                      >
                        {i18n.t("acceptTicketModal.buttons.cancel")}
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

export default AcceptTicketWithoutQueueModal;

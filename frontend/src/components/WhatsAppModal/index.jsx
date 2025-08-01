import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import {
  X,
  Loader2,
  Save,
  Plus,
  MessageCircle,
  Wifi,
  List
} from "lucide-react";

import api from "../../services/api.js";
import { i18n } from "../../translate/i18n.js";
import toastError from "../../errors/toastError.js";
import QueueSelect from "../QueueSelect";

// Modern Input Component
const ModernInput = ({
  label,
  icon: Icon,
  error,
  helperText,
  type = "text",
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
        <input
          {...props}
          type={type}
          className={`
            block w-full ${Icon ? "pl-8" : "pl-2.5"} pr-2.5 py-2 
            border ${error ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"} 
            rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-1 ${error ? "focus:ring-red-500" : "focus:ring-blue-500"} 
            ${error ? "focus:border-red-500" : "focus:border-blue-500"}
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            transition-all duration-200
            text-sm
          `}
        />
      </div>
      {helperText && (
        <p className="text-xs text-red-600 dark:text-red-400">{helperText}</p>
      )}
    </div>
  );
};

// Modern Textarea Component
const ModernTextarea = ({
  label,
  icon: Icon,
  error,
  helperText,
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
          <div className="absolute top-2.5 left-2.5 flex items-start pointer-events-none">
            <Icon className="h-3.5 w-3.5 text-gray-400" />
          </div>
        )}
        <textarea
          {...props}
          className={`
            block w-full ${Icon ? "pl-8" : "pl-2.5"} pr-2.5 py-2 
            border ${error ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"} 
            rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-1 ${error ? "focus:ring-red-500" : "focus:ring-blue-500"} 
            ${error ? "focus:border-red-500" : "focus:border-blue-500"}
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            transition-all duration-200 resize-vertical
            text-sm
          `}
        />
      </div>
      {helperText && (
        <p className="text-xs text-red-600 dark:text-red-400">{helperText}</p>
      )}
    </div>
  );
};

const SessionSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required")
});

const WhatsAppModal = ({ open, onClose, whatsAppId }) => {
  const initialState = {
    name: "",
    greetingMessage: "",
    farewellMessage: "",
    isDefault: false
  };
  const [whatsApp, setWhatsApp] = useState(initialState);
  const [selectedQueueIds, setSelectedQueueIds] = useState([]);

  useEffect(() => {
    const fetchSession = async () => {
      if (!whatsAppId) return;

      try {
        const { data } = await api.get(`whatsapp/${whatsAppId}`);
        setWhatsApp(data);

        const whatsQueueIds = data.queues?.map(queue => queue.id);
        setSelectedQueueIds(whatsQueueIds);
      } catch (err) {
        toastError(err);
      }
    };
    fetchSession();
  }, [whatsAppId]);

  const handleSaveWhatsApp = async values => {
    const whatsappData = { ...values, queueIds: selectedQueueIds };

    try {
      if (whatsAppId) {
        await api.put(`/whatsapp/${whatsAppId}`, whatsappData);
      } else {
        await api.post("/whatsapp", whatsappData);
      }
      toast.success(i18n.t("whatsappModal.success"));
      handleClose();
    } catch (err) {
      toastError(err);
    }
  };

  const handleClose = () => {
    onClose();
    setWhatsApp(initialState);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-[#1e1e1e] rounded-lg shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-md">
              <MessageCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-base font-medium text-gray-900 dark:text-white">
              {whatsAppId
                ? i18n.t("whatsappModal.title.edit")
                : i18n.t("whatsappModal.title.add")}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <Formik
            initialValues={whatsApp}
            enableReinitialize={true}
            validationSchema={SessionSchema}
            onSubmit={(values, actions) => {
              setTimeout(() => {
                handleSaveWhatsApp(values);
                actions.setSubmitting(false);
              }, 400);
            }}
          >
            {({ values, touched, errors, isSubmitting, setFieldValue }) => (
              <Form>
                <div className="p-4 space-y-4">
                  {/* Main Info Section */}
                  <div>
                    <h3 className="text-xs font-medium text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
                      {i18n.t("common.mainInfo")}
                    </h3>
                    <div className="space-y-3">
                      {/* Name Row */}
                      <Field name="name">
                        {({ field }) => (
                          <ModernInput
                            {...field}
                            label={i18n.t("whatsappModal.form.name")}
                            icon={Wifi}
                            error={touched.name && Boolean(errors.name)}
                            helperText={touched.name && errors.name}
                            autoFocus
                            placeholder={i18n.t("whatsappModal.form.name")}
                          />
                        )}
                      </Field>

                      {/* Default Switch */}
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                          {i18n.t("whatsappModal.form.default")}
                        </label>
                        <div className="flex items-center">
                          <Field name="isDefault">
                            {({ field }) => (
                              <label className="flex items-center cursor-pointer">
                                <input
                                  {...field}
                                  type="checkbox"
                                  className="sr-only"
                                  checked={values.isDefault}
                                  onChange={e =>
                                    setFieldValue("isDefault", e.target.checked)
                                  }
                                />
                                <div
                                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                    values.isDefault
                                      ? "bg-blue-600"
                                      : "bg-gray-200 dark:bg-gray-600"
                                  }`}
                                >
                                  <span
                                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                                      values.isDefault
                                        ? "translate-x-5"
                                        : "translate-x-0.5"
                                    }`}
                                  />
                                </div>
                                <span className="ml-2 text-xs text-gray-700 dark:text-gray-300">
                                  {i18n.t("common.defaultWhatsApp")}
                                </span>
                              </label>
                            )}
                          </Field>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Messages Section */}
                  <div>
                    <h3 className="text-xs font-medium text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
                      {i18n.t("common.messages")}
                    </h3>
                    <div className="space-y-3">
                      {/* Greeting Message */}
                      <Field name="greetingMessage">
                        {({ field }) => (
                          <ModernTextarea
                            {...field}
                            label={i18n.t("whatsappModal.form.greetingMessage")}
                            icon={MessageCircle}
                            rows={3}
                            error={
                              touched.greetingMessage &&
                              Boolean(errors.greetingMessage)
                            }
                            helperText={
                              touched.greetingMessage && errors.greetingMessage
                            }
                            placeholder={i18n.t(
                              "whatsappModal.form.greetingMessage"
                            )}
                          />
                        )}
                      </Field>

                      {/* Farewell Message */}
                      <Field name="farewellMessage">
                        {({ field }) => (
                          <ModernTextarea
                            {...field}
                            label={i18n.t("whatsappModal.form.farewellMessage")}
                            icon={MessageCircle}
                            rows={3}
                            error={
                              touched.farewellMessage &&
                              Boolean(errors.farewellMessage)
                            }
                            helperText={
                              touched.farewellMessage && errors.farewellMessage
                            }
                            placeholder={i18n.t(
                              "whatsappModal.form.farewellMessage"
                            )}
                          />
                        )}
                      </Field>
                    </div>
                  </div>

                  {/* Queue Selection */}
                  <div>
                    <h3 className="text-xs font-medium text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
                      {i18n.t("common.queueSection")}
                    </h3>
                    <QueueSelect
                      selectedQueueIds={selectedQueueIds}
                      onChange={selectedIds => setSelectedQueueIds(selectedIds)}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {i18n.t("whatsappModal.buttons.cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
                  >
                    {isSubmitting && (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    )}
                    {whatsAppId
                      ? i18n.t("whatsappModal.buttons.okEdit")
                      : i18n.t("whatsappModal.buttons.okAdd")}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default React.memo(WhatsAppModal);

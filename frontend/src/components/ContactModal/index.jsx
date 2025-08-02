import { useState, useEffect, useRef } from "react";
import * as Yup from "yup";
import { Formik, FieldArray, Form, Field } from "formik";
import { toast } from "react-toastify";
import { User, Phone, Mail, Plus, Trash2, X, Loader2 } from "lucide-react";

import { i18n } from "../../translate/i18n.js";
import api from "../../services/api.js";
import toastError from "../../errors/toastError.js";

const ContactSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  number: Yup.string().min(8, "Too Short!").max(50, "Too Long!"),
  email: Yup.string().email("Invalid email")
});

// Modern Input Component
const ModernInput = ({
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
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <Icon className="h-3.5 w-3.5 text-gray-400" />
          </div>
        )}
        <input
          {...props}
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

const ContactModal = ({ open, onClose, contactId, initialValues, onSave }) => {
  const isMounted = useRef(true);

  const initialState = {
    name: "",
    number: "",
    email: "",
    extraInfo: []
  };

  const [contact, setContact] = useState(initialState);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchContact = async () => {
      if (initialValues) {
        setContact(prevState => {
          return { ...prevState, ...initialValues };
        });
      }

      if (!contactId) return;

      try {
        const { data } = await api.get(`/contacts/${contactId}`);
        if (isMounted.current) {
          setContact(data);
        }
      } catch (err) {
        toastError(err);
      }
    };

    fetchContact();
  }, [contactId, open, initialValues]);

  const handleClose = () => {
    onClose();
    setContact(initialState);
  };

  const handleSaveContact = async values => {
    try {
      if (contactId) {
        await api.put(`/contacts/${contactId}`, values);
        handleClose();
      } else {
        const { data } = await api.post("/contacts", values);
        if (onSave) {
          onSave(data);
        }
        handleClose();
      }
      toast.success(i18n.t("contactModal.success"));
    } catch (err) {
      toastError(err);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-75">
      <div className="bg-white dark:bg-[#1e1e1e] rounded-lg shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
              <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-base font-medium text-gray-900 dark:text-white">
              {contactId
                ? i18n.t("contactModal.title.edit")
                : i18n.t("contactModal.title.add")}
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
            initialValues={contact}
            enableReinitialize={true}
            validationSchema={ContactSchema}
            onSubmit={(values, actions) => {
              setTimeout(() => {
                handleSaveContact(values);
                actions.setSubmitting(false);
              }, 400);
            }}
          >
            {({ values, errors, touched, isSubmitting, setFieldValue }) => (
              <Form>
                <div className="p-4 space-y-4">
                  {/* Main Info Section */}
                  <div>
                    <h3 className="text-xs font-medium text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
                      {i18n.t("contactModal.form.mainInfo")}
                    </h3>
                    <div className="space-y-3">
                      <Field name="name">
                        {({ field }) => (
                          <ModernInput
                            {...field}
                            label={i18n.t("contactModal.form.name")}
                            icon={User}
                            error={touched.name && Boolean(errors.name)}
                            helperText={touched.name && errors.name}
                            autoFocus
                          />
                        )}
                      </Field>

                      <Field name="number">
                        {({ field }) => (
                          <ModernInput
                            {...field}
                            label={i18n.t("contactModal.form.number")}
                            icon={Phone}
                            placeholder="5513912344321"
                            error={touched.number && Boolean(errors.number)}
                            helperText={touched.number && errors.number}
                          />
                        )}
                      </Field>

                      <Field name="email">
                        {({ field }) => (
                          <ModernInput
                            {...field}
                            label={i18n.t("contactModal.form.email")}
                            icon={Mail}
                            type="email"
                            placeholder="Email address"
                            error={touched.email && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                          />
                        )}
                      </Field>
                    </div>
                  </div>

                  {/* Extra Info Section */}
                  <div>
                    <h3 className="text-xs font-medium text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
                      {i18n.t("contactModal.form.extraInfo")}
                    </h3>
                    <FieldArray name="extraInfo">
                      {({ push, remove }) => (
                        <div className="space-y-2">
                          {values.extraInfo &&
                            values.extraInfo.length > 0 &&
                            values.extraInfo.map((info, index) => (
                              <div
                                key={`${index}-info`}
                                className="flex gap-2 items-end"
                              >
                                <Field name={`extraInfo[${index}].name`}>
                                  {({ field }) => (
                                    <ModernInput
                                      {...field}
                                      label={i18n.t(
                                        "contactModal.form.extraName"
                                      )}
                                      className="flex-1"
                                    />
                                  )}
                                </Field>
                                <Field name={`extraInfo[${index}].value`}>
                                  {({ field }) => (
                                    <ModernInput
                                      {...field}
                                      label={i18n.t(
                                        "contactModal.form.extraValue"
                                      )}
                                      className="flex-1"
                                    />
                                  )}
                                </Field>
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          <button
                            type="button"
                            onClick={() => push({ name: "", value: "" })}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            {i18n.t("contactModal.buttons.addExtraInfo")}
                          </button>
                        </div>
                      )}
                    </FieldArray>
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
                    {i18n.t("contactModal.buttons.cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
                  >
                    {isSubmitting && (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    )}
                    {contactId
                      ? i18n.t("contactModal.buttons.okEdit")
                      : i18n.t("contactModal.buttons.okAdd")}
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

export default ContactModal;

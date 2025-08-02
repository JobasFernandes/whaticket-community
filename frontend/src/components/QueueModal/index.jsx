import { useState, useEffect, useRef } from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import { Palette, MessageSquare, Hash } from "lucide-react";

import { i18n } from "../../translate/i18n.js";
import api from "../../services/api.js";
import toastError from "../../errors/toastError.js";
import ColorPicker from "../ColorPicker";

// Modern Input Component
const ModernInput = ({
  label,
  icon: Icon,
  error,
  helperText,
  className = "",
  endIcon,
  onEndIconClick,
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
            block w-full ${Icon ? "pl-8" : "pl-2.5"} ${endIcon ? "pr-8" : "pr-2.5"} py-2 
            border ${error ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"} 
            rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-1 ${error ? "focus:ring-red-500" : "focus:ring-blue-500"} 
            ${error ? "focus:border-red-500" : "focus:border-blue-500"}
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            transition-all duration-200
            text-sm
          `}
        />
        {endIcon && (
          <button
            type="button"
            onClick={onEndIconClick}
            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {endIcon}
          </button>
        )}
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
  rows = 4,
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
          rows={rows}
          className={`
            block w-full ${Icon ? "pl-8" : "pl-2.5"} pr-2.5 py-2 
            border ${error ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"} 
            rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-1 ${error ? "focus:ring-red-500" : "focus:ring-blue-500"} 
            ${error ? "focus:border-red-500" : "focus:border-blue-500"}
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            transition-all duration-200
            text-sm resize-vertical
          `}
        />
      </div>
      {helperText && (
        <p className="text-xs text-red-600 dark:text-red-400">{helperText}</p>
      )}
    </div>
  );
};

const QueueSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  color: Yup.string().min(3, "Too Short!").max(9, "Too Long!").required(),
  greetingMessage: Yup.string()
});

const QueueModal = ({ open, onClose, queueId }) => {
  const initialState = {
    name: "",
    color: "#1976d2",
    greetingMessage: ""
  };

  const [colorPickerModalOpen, setColorPickerModalOpen] = useState(false);
  const [queue, setQueue] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      if (!queueId) return;
      try {
        const { data } = await api.get(`/queue/${queueId}`);
        setQueue(prevState => {
          return { ...prevState, ...data };
        });
      } catch (err) {
        toastError(err);
      }
    })();

    return () => {
      setQueue(initialState);
    };
  }, [queueId, open]);

  const handleClose = () => {
    onClose();
    setQueue(initialState);
    setColorPickerModalOpen(false);
  };

  const handleSaveQueue = async values => {
    setIsSubmitting(true);
    try {
      if (queueId) {
        await api.put(`/queue/${queueId}`, values);
      } else {
        await api.post("/queue", values);
      }
      toast.success(i18n.t("queueModal.success"));
      handleClose();
    } catch (err) {
      toastError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#1e1e1e] rounded-lg shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden border border-gray-200 dark:border-gray-700">
        <Formik
          initialValues={queue}
          enableReinitialize={true}
          validationSchema={QueueSchema}
          onSubmit={values => {
            handleSaveQueue(values);
          }}
        >
          {({ touched, errors, values, setFieldValue }) => (
            <Form>
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {queueId
                    ? i18n.t("queueModal.title.edit")
                    : i18n.t("queueModal.title.add")}
                </h3>
              </div>

              {/* Content */}
              <div className="px-4 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
                {/* Main Info Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                    <MessageSquare className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {i18n.t("queueModal.form.mainInfo") ||
                        "Informações da Fila"}
                    </h4>
                  </div>

                  {/* Queue Name */}
                  <Field name="name">
                    {({ field }) => (
                      <ModernInput
                        {...field}
                        label={i18n.t("queueModal.form.name")}
                        icon={Hash}
                        error={touched.name && errors.name}
                        helperText={touched.name && errors.name}
                        autoFocus
                      />
                    )}
                  </Field>

                  {/* Queue Color */}
                  <Field name="color">
                    {({ field }) => (
                      <ModernInput
                        {...field}
                        label={i18n.t("queueModal.form.color")}
                        icon={Palette}
                        error={touched.color && errors.color}
                        helperText={touched.color && errors.color}
                        onClick={() => setColorPickerModalOpen(true)}
                        readOnly
                        endIcon={
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded border border-gray-300"
                              style={{ backgroundColor: values.color }}
                            />
                            <Palette className="h-3.5 w-3.5" />
                          </div>
                        }
                        onEndIconClick={() => setColorPickerModalOpen(true)}
                      />
                    )}
                  </Field>

                  {/* Color Picker Modal */}
                  <ColorPicker
                    open={colorPickerModalOpen}
                    handleClose={() => setColorPickerModalOpen(false)}
                    onChange={color => {
                      setFieldValue("color", color);
                      setQueue(prev => ({ ...prev, color }));
                    }}
                  />

                  {/* Greeting Message */}
                  <Field name="greetingMessage">
                    {({ field }) => (
                      <ModernTextarea
                        {...field}
                        label={i18n.t("queueModal.form.greetingMessage")}
                        icon={MessageSquare}
                        error={
                          touched.greetingMessage && errors.greetingMessage
                        }
                        helperText={
                          touched.greetingMessage && errors.greetingMessage
                        }
                        rows={4}
                        placeholder="Digite a mensagem de saudação..."
                      />
                    )}
                  </Field>
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  {i18n.t("queueModal.buttons.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting && (
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {queueId
                    ? i18n.t("queueModal.buttons.okEdit")
                    : i18n.t("queueModal.buttons.okAdd")}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default QueueModal;

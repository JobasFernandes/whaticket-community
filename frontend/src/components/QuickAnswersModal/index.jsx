import { useState, useEffect, useRef } from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import { X, MessageSquare, Loader2 } from "lucide-react";
import { i18n } from "../../translate/i18n.js";
import api from "../../services/api.js";
import toastError from "../../errors/toastError.js";

const QuickAnswerSchema = Yup.object().shape({
  shortcut: Yup.string()
    .min(2, "Too Short!")
    .max(15, "Too Long!")
    .required("Required"),
  message: Yup.string()
    .min(8, "Too Short!")
    .max(30000, "Too Long!")
    .required("Required")
});

const QuickAnswersModal = ({
  open,
  onClose,
  quickAnswerId,
  initialValues,
  onSave
}) => {
  const isMounted = useRef(true);

  const initialState = {
    shortcut: "",
    message: ""
  };

  const [quickAnswer, setQuickAnswer] = useState(initialState);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchQuickAnswer = async () => {
      if (initialValues) {
        setQuickAnswer(prevState => {
          return { ...prevState, ...initialValues };
        });
      }

      if (!quickAnswerId) return;

      try {
        const { data } = await api.get(`/quickAnswers/${quickAnswerId}`);
        if (isMounted.current) {
          setQuickAnswer(data);
        }
      } catch (err) {
        toastError(err);
      }
    };

    fetchQuickAnswer();
  }, [quickAnswerId, open, initialValues]);

  const handleClose = () => {
    onClose();
    setQuickAnswer(initialState);
  };

  const handleSaveQuickAnswer = async values => {
    try {
      if (quickAnswerId) {
        await api.put(`/quickAnswers/${quickAnswerId}`, values);
        handleClose();
      } else {
        const { data } = await api.post("/quickAnswers", values);
        if (onSave) {
          onSave(data);
        }
        handleClose();
      }
      toast.success(i18n.t("quickAnswersModal.success"));
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#1e1e1e] rounded-lg shadow-2xl w-full max-w-md max-h-[85vh] overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                  <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-base font-medium text-gray-900 dark:text-white">
                  {quickAnswerId
                    ? i18n.t("quickAnswersModal.title.edit")
                    : i18n.t("quickAnswersModal.title.add")}
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
                initialValues={quickAnswer}
                enableReinitialize={true}
                validationSchema={QuickAnswerSchema}
                onSubmit={(values, actions) => {
                  setTimeout(() => {
                    handleSaveQuickAnswer(values);
                    actions.setSubmitting(false);
                  }, 400);
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  isSubmitting,
                  handleChange,
                  handleBlur
                }) => (
                  <Form>
                    <div className="p-4 space-y-4">
                      <div>
                        <h3 className="text-xs font-medium text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
                          {i18n.t("quickAnswersModal.form.mainInfo") ||
                            "Informações Principais"}
                        </h3>
                        <div className="space-y-3">
                          {/* Shortcut Field */}
                          <div className="space-y-1">
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                              {i18n.t("quickAnswersModal.form.shortcut")}
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                                <MessageSquare className="h-3.5 w-3.5 text-gray-400" />
                              </div>
                              <input
                                name="shortcut"
                                type="text"
                                value={values.shortcut}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`
                                  block w-full pl-8 pr-2.5 py-2 
                                  border ${touched.shortcut && errors.shortcut ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"} 
                                  rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500
                                  focus:outline-none focus:ring-1 ${touched.shortcut && errors.shortcut ? "focus:ring-red-500" : "focus:ring-blue-500"} 
                                  ${touched.shortcut && errors.shortcut ? "focus:border-red-500" : "focus:border-blue-500"}
                                  bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                  transition-all duration-200
                                  text-sm
                                `}
                                placeholder={i18n.t(
                                  "quickAnswersModal.form.shortcut"
                                )}
                                autoFocus
                              />
                            </div>
                            {touched.shortcut && errors.shortcut && (
                              <p className="text-xs text-red-600 dark:text-red-400">
                                {errors.shortcut}
                              </p>
                            )}
                          </div>

                          {/* Message Field */}
                          <div className="space-y-1">
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                              {i18n.t("quickAnswersModal.form.message")}
                            </label>
                            <textarea
                              name="message"
                              rows={5}
                              value={values.message}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={`
                                block w-full px-2.5 py-2 
                                border ${touched.message && errors.message ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"} 
                                rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500
                                focus:outline-none focus:ring-1 ${touched.message && errors.message ? "focus:ring-red-500" : "focus:ring-blue-500"} 
                                ${touched.message && errors.message ? "focus:border-red-500" : "focus:border-blue-500"}
                                bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                transition-all duration-200
                                text-sm resize-none
                              `}
                              placeholder={i18n.t(
                                "quickAnswersModal.form.message"
                              )}
                            />
                            {touched.message && errors.message && (
                              <p className="text-xs text-red-600 dark:text-red-400">
                                {errors.message}
                              </p>
                            )}
                          </div>
                        </div>
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
                        {i18n.t("quickAnswersModal.buttons.cancel")}
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
                      >
                        {isSubmitting && (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        )}
                        {quickAnswerId
                          ? i18n.t("quickAnswersModal.buttons.okEdit")
                          : i18n.t("quickAnswersModal.buttons.okAdd")}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickAnswersModal;

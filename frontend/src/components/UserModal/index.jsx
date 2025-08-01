import { useState, useEffect, useContext } from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import {
  X,
  User,
  Mail,
  Lock,
  Shield,
  MessageCircle,
  Eye,
  EyeOff,
  Loader2
} from "lucide-react";

import { i18n } from "../../translate/i18n.js";
import api from "../../services/api.js";
import toastError from "../../errors/toastError.js";
import QueueSelect from "../QueueSelect";
import { AuthContext } from "../../context/Auth/AuthContext";
import { Can } from "../Can";
import useWhatsApps from "../../hooks/useWhatsApps";

// Modern Input Component
const ModernInput = ({
  label,
  icon: Icon,
  error,
  helperText,
  type = "text",
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
          type={type}
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
            className="absolute inset-y-0 right-0 pr-2.5 flex items-center"
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

// Modern Select Component
const ModernSelect = ({
  label,
  icon: Icon,
  error,
  helperText,
  children,
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
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none z-10">
            <Icon className="h-3.5 w-3.5 text-gray-400" />
          </div>
        )}
        <select
          {...props}
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
          {children}
        </select>
      </div>
      {helperText && (
        <p className="text-xs text-red-600 dark:text-red-400">{helperText}</p>
      )}
    </div>
  );
};

const UserSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  password: Yup.string().min(5, "Too Short!").max(50, "Too Long!"),
  email: Yup.string().email("Invalid email").required("Required")
});

const UserModal = ({ open, onClose, userId }) => {
  const initialState = {
    name: "",
    email: "",
    password: "",
    profile: "user"
  };

  const { user: loggedInUser } = useContext(AuthContext);

  if (!loggedInUser?.id) {
    return null;
  }

  const [user, setUser] = useState(initialState);
  const [selectedQueueIds, setSelectedQueueIds] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [whatsappId, setWhatsappId] = useState("");
  const { loading, whatsApps } = useWhatsApps(!!loggedInUser?.id);

  useEffect(() => {
    if (!loggedInUser?.id) return;

    let isMounted = true;

    const fetchUser = async () => {
      if (!userId) return;
      try {
        const { data } = await api.get(`/users/${userId}`);
        if (isMounted) {
          setUser(prevState => {
            return { ...prevState, ...data };
          });
          const userQueueIds = data.queues?.map(queue => queue.id);
          setSelectedQueueIds(userQueueIds);
          setWhatsappId(data.whatsappId ? data.whatsappId : "");
        }
      } catch (err) {
        if (
          isMounted &&
          err?.response?.status !== 401 &&
          err?.response?.status !== 403
        ) {
          toastError(err);
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [userId, open, loggedInUser?.id]);

  const handleClose = () => {
    onClose();
    setUser(initialState);
    setSelectedQueueIds([]);
    setWhatsappId("");
  };

  const handleSaveUser = async values => {
    const userData = { ...values, whatsappId, queueIds: selectedQueueIds };
    try {
      if (userId) {
        await api.put(`/users/${userId}`, userData);
      } else {
        await api.post("/users", userData);
      }
      toast.success(i18n.t("userModal.success"));
    } catch (err) {
      toastError(err);
    }
    handleClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-[#1e1e1e] rounded-lg shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
              <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-base font-medium text-gray-900 dark:text-white">
              {userId
                ? i18n.t("userModal.title.edit")
                : i18n.t("userModal.title.add")}
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
            initialValues={user}
            enableReinitialize={true}
            validationSchema={UserSchema}
            onSubmit={(values, actions) => {
              setTimeout(() => {
                handleSaveUser(values);
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
                      {/* Name and Password Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Field name="name">
                          {({ field }) => (
                            <ModernInput
                              {...field}
                              label={i18n.t("userModal.form.name")}
                              icon={User}
                              error={touched.name && Boolean(errors.name)}
                              helperText={touched.name && errors.name}
                              autoFocus
                            />
                          )}
                        </Field>

                        <Field name="password">
                          {({ field }) => (
                            <ModernInput
                              {...field}
                              label={i18n.t("userModal.form.password")}
                              icon={Lock}
                              type={showPassword ? "text" : "password"}
                              error={
                                touched.password && Boolean(errors.password)
                              }
                              helperText={touched.password && errors.password}
                              endIcon={
                                showPassword ? (
                                  <EyeOff className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <Eye className="h-4 w-4 text-gray-400" />
                                )
                              }
                              onEndIconClick={() =>
                                setShowPassword(!showPassword)
                              }
                              placeholder="••••••••"
                            />
                          )}
                        </Field>
                      </div>

                      {/* Email and Profile Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Field name="email">
                          {({ field }) => (
                            <ModernInput
                              {...field}
                              label={i18n.t("userModal.form.email")}
                              icon={Mail}
                              type="email"
                              error={touched.email && Boolean(errors.email)}
                              helperText={touched.email && errors.email}
                              placeholder="user@example.com"
                            />
                          )}
                        </Field>

                        <Can
                          role={loggedInUser.profile}
                          perform="user-modal:editProfile"
                          yes={() => (
                            <Field name="profile">
                              {({ field }) => (
                                <ModernSelect
                                  {...field}
                                  label={i18n.t("userModal.form.profile")}
                                  icon={Shield}
                                >
                                  <option value="admin">Admin</option>
                                  <option value="user">User</option>
                                </ModernSelect>
                              )}
                            </Field>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Queue Selection */}
                  <Can
                    role={loggedInUser.profile}
                    perform="user-modal:editQueues"
                    yes={() => (
                      <div>
                        <h3 className="text-xs font-medium text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
                          {i18n.t("common.queueSection")}
                        </h3>
                        <QueueSelect
                          selectedQueueIds={selectedQueueIds}
                          onChange={values => setSelectedQueueIds(values)}
                        />
                      </div>
                    )}
                  />

                  {/* WhatsApp Selection */}
                  <Can
                    role={loggedInUser.profile}
                    perform="user-modal:editQueues"
                    yes={() =>
                      !loading && (
                        <div>
                          <h3 className="text-xs font-medium text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
                            WhatsApp
                          </h3>
                          <ModernSelect
                            label={i18n.t("userModal.form.whatsapp")}
                            icon={MessageCircle}
                            value={whatsappId}
                            onChange={e => setWhatsappId(e.target.value)}
                          >
                            <option value="">&nbsp;</option>
                            {whatsApps.map(whatsapp => (
                              <option key={whatsapp.id} value={whatsapp.id}>
                                {whatsapp.name}
                              </option>
                            ))}
                          </ModernSelect>
                        </div>
                      )
                    }
                  />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {i18n.t("userModal.buttons.cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
                  >
                    {isSubmitting && (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    )}
                    {userId
                      ? i18n.t("userModal.buttons.okEdit")
                      : i18n.t("userModal.buttons.okAdd")}
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

export default UserModal;

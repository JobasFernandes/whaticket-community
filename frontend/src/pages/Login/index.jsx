import { useState, useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Lock, Eye, EyeOff, Mail, Sun, Moon } from "lucide-react";

import { i18n } from "../../translate/i18n.js";
import { AuthContext } from "../../context/Auth/context";
import { useThemeContext } from "../../hooks/useThemeContext";
import { useSignupStatus } from "../../hooks/useSignupStatus";

const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const { handleLogin } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useThemeContext();
  const { signupEnabled } = useSignupStatus();

  const handleChangeInput = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlSubmit = e => {
    e.preventDefault();
    handleLogin(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#121212] px-4 sm:px-6 lg:px-8">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 flex items-center justify-center w-10 h-10 rounded-lg bg-white dark:bg-[#2c2c2c] hover:bg-gray-100 dark:hover:bg-[#3d3d3d] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
        title={darkMode ? "Modo claro" : "Modo escuro"}
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {i18n.t("login.title")}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Entre em sua conta para continuar
          </p>
        </div>

        <div className="bg-white dark:bg-[#1e1e1e] py-8 px-6 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <form className="space-y-6" onSubmit={handlSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {i18n.t("login.form.email")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={user.email}
                  onChange={handleChangeInput}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                  placeholder="Digite seu email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {i18n.t("login.form.password")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={user.password}
                  onChange={handleChangeInput}
                  className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                  placeholder="Digite sua senha"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:text-gray-600 dark:focus:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {i18n.t("login.buttons.submit")}
              </button>
            </div>

            {signupEnabled && (
              <div className="text-center">
                <RouterLink
                  to="/signup"
                  className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  {i18n.t("login.buttons.register")}
                </RouterLink>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

import { createContext } from "react";

import useAuth from "../../hooks/useAuth";

const AuthContext = createContext({
  loading: true,
  user: {},
  isAuth: false,
  handleLogin: () => {},
  handleLogout: () => {}
});

const AuthProvider = ({ children }) => {
  const authData = useAuth();

  const contextValue = {
    loading: authData?.loading ?? true,
    user: authData?.user ?? {},
    isAuth: authData?.isAuth ?? false,
    handleLogin: authData?.handleLogin ?? (() => {}),
    handleLogout: authData?.handleLogout ?? (() => {})
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

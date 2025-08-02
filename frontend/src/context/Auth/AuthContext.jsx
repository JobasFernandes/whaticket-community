import useAuth from "../../hooks/useAuth";
import { AuthContext } from "./context";

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

export default AuthProvider;

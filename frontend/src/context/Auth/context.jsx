import { createContext } from "react";

export const AuthContext = createContext({
  loading: true,
  user: {},
  isAuth: false,
  handleLogin: () => {},
  handleLogout: () => {}
});

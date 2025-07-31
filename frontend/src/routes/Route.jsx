import { useContext } from "react";
import { Route as RouterRoute, Redirect } from "react-router-dom";

import { AuthContext } from "../context/Auth/AuthContext";
import BackdropLoading from "../components/BackdropLoading/index";

const Route = ({ component: Component, isPrivate = false, ...rest }) => {
  const { isAuth, loading } = useContext(AuthContext);

  return (
    <RouterRoute
      {...rest}
      render={props => {
        if (loading) {
          return <BackdropLoading />;
        }

        if (!isAuth && isPrivate) {
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          );
        }

        if (
          isAuth &&
          !isPrivate &&
          (props.location.pathname === "/login" ||
            props.location.pathname === "/signup")
        ) {
          return (
            <Redirect
              to={{
                pathname: "/",
                state: { from: props.location }
              }}
            />
          );
        }

        return <Component {...props} />;
      }}
    />
  );
};

export default Route;

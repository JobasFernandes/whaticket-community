import React, { useContext } from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import LoggedInLayout from "../layout/index";
import Dashboard from "../pages/Dashboard/index";
import Tickets from "../pages/Tickets/index";
import Signup from "../pages/Signup/index";
import Login from "../pages/Login/index";
import Connections from "../pages/Connections/index";
import Settings from "../pages/Settings/index";
import Users from "../pages/Users/index";
import Contacts from "../pages/Contacts/index";
import QuickAnswers from "../pages/QuickAnswers/index";
import Queues from "../pages/Queues/index";
import { AuthProvider, AuthContext } from "../context/Auth/AuthContext";
import { WhatsAppsProvider } from "../context/WhatsApp/WhatsAppsContext";
import { ThemeProvider } from "../context/DarkMode/index";
import Route from "./Route";

const PrivateRoutes = () => {
  const { isAuth, user, loading } = useContext(AuthContext);

  if (loading) {
    return null;
  }

  if (!isAuth || !user?.id) {
    return <Route exact path="*" component={() => null} isPrivate />;
  }

  return (
    <WhatsAppsProvider>
      <LoggedInLayout>
        <Route exact path="/" component={Dashboard} isPrivate />
        <Route exact path="/tickets/:ticketId?" component={Tickets} isPrivate />
        <Route exact path="/connections" component={Connections} isPrivate />
        <Route exact path="/contacts" component={Contacts} isPrivate />
        <Route exact path="/users" component={Users} isPrivate />
        <Route exact path="/quickAnswers" component={QuickAnswers} isPrivate />
        <Route exact path="/Settings" component={Settings} isPrivate />
        <Route exact path="/Queues" component={Queues} isPrivate />
        <Route path="*" component={() => <Redirect to="/" />} isPrivate />
      </LoggedInLayout>
    </WhatsAppsProvider>
  );
};

const Routes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <PrivateRoutes />
          </Switch>
          <ToastContainer autoClose={3000} />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;

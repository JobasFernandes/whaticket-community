import React, { useContext } from "react";
import { BrowserRouter, Switch, Redirect } from "react-router-dom";
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
import { I18nProvider } from "../context/I18n/index";
import Route from "./Route";

const PrivateRoutes = () => {
  const { isAuth, user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuth || !user?.id) {
    return <Redirect to="/login" />;
  }

  return (
    <WhatsAppsProvider>
      <LoggedInLayout>
        <Switch>
          <Route exact path="/" component={Dashboard} isPrivate />
          <Route
            exact
            path="/tickets/:ticketId?"
            component={Tickets}
            isPrivate
          />
          <Route exact path="/connections" component={Connections} isPrivate />
          <Route exact path="/contacts" component={Contacts} isPrivate />
          <Route exact path="/users" component={Users} isPrivate />
          <Route
            exact
            path="/quickAnswers"
            component={QuickAnswers}
            isPrivate
          />
          <Route exact path="/Settings" component={Settings} isPrivate />
          <Route exact path="/Queues" component={Queues} isPrivate />
          <Redirect from="*" to="/" />
        </Switch>
      </LoggedInLayout>
    </WhatsAppsProvider>
  );
};

const Routes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <I18nProvider>
          <ThemeProvider>
            <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />
              <PrivateRoutes />
            </Switch>
            <ToastContainer autoClose={3000} />
          </ThemeProvider>
        </I18nProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;

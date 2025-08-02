import { useContext } from "react";

import useWhatsApps from "../../hooks/useWhatsApps";
import { AuthContext } from "../Auth/context";
import { WhatsAppsContext } from "./context";

const WhatsAppsProvider = ({ children }) => {
  const { isAuth } = useContext(AuthContext);
  const { loading, whatsApps } = useWhatsApps(isAuth);

  return (
    <WhatsAppsContext.Provider value={{ whatsApps, loading }}>
      {children}
    </WhatsAppsContext.Provider>
  );
};

export default WhatsAppsProvider;

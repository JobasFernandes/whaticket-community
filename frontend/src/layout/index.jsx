import { useContext } from "react";
import MainListItems from "./MainListItems";
import { AuthContext } from "../context/Auth/AuthContext";
import BackdropLoading from "../components/BackdropLoading";

const LoggedInLayout = ({ children }) => {
  const { loading, user } = useContext(AuthContext);

  if (loading) return <BackdropLoading />;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212] pt-16">
      <MainListItems />
      <main className="w-full h-[calc(100vh-64px)] flex flex-col px-2 sm:px-4 lg:px-8 overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default LoggedInLayout;

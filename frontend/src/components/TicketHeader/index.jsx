import React from "react";
import { ArrowLeft } from "lucide-react";
import { useHistory } from "react-router-dom";

import TicketHeaderSkeleton from "../TicketHeaderSkeleton";

const TicketHeader = ({ loading, children }) => {
  const history = useHistory();

  const handleBack = () => {
    history.push("/tickets");
  };

  return (
    <>
      {loading ? (
        <TicketHeaderSkeleton />
      ) : (
        <div className="flex items-center bg-white dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-gray-700 px-2 py-3 flex-shrink-0 max-h-[61px]">
          <button
            onClick={handleBack}
            className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mr-1"
          >
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          {children}
        </div>
      )}
    </>
  );
};

export default TicketHeader;

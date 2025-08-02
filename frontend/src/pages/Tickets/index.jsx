import React from "react";
import { useParams } from "react-router-dom";
import { MessageSquare } from "lucide-react";

import TicketsManager from "../../components/TicketsManager/";
import Ticket from "../../components/Ticket/";

import { i18n } from "../../translate/i18n.js";

const Chat = () => {
  const { ticketId } = useParams();

  return (
    <div className="flex-1 h-[calc(100vh-3rem)] overflow-hidden rounded-lg bg-gray-50 dark:bg-[#121212] pb-2">
      <div className="flex h-full rounded-lg bg-white dark:bg-[#1e1e1e]">
        {/* Left Sidebar - Tickets Manager */}
        <div
          className={`flex flex-col h-full overflow-hidden ${
            ticketId
              ? "hidden md:flex md:w-[38%] lg:w-[35%] xl:w-[30%]"
              : "w-full md:w-[38%] lg:w-[35%] xl:w-[30%]"
          }`}
        >
          <TicketsManager />
        </div>

        {/* Right Content - Ticket View */}
        <div className="flex flex-col h-full flex-1 overflow-hidden border-l-0 border-r-0 md:border-r border-b border-t border-gray-200 dark:border-gray-700 rounded-bl-lg md:rounded-bl-none rounded-r-lg">
          {ticketId ? (
            <Ticket />
          ) : (
            <div className="hidden md:flex items-center justify-center h-full bg-white dark:bg-[#1e1e1e]">
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {i18n.t("chat.noTicketMessage")}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;

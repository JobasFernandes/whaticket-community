import React from "react";
import { User } from "lucide-react";

import { i18n } from "../../translate/i18n.js";

const TicketInfo = ({ contact, ticket, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center cursor-pointer rounded-lg px-1 py-1 transition-colors max-h-[47px]"
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mr-2">
        {contact.profilePicUrl ? (
          <img
            src={contact.profilePicUrl}
            alt="contact_image"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <User size={16} className="text-gray-400 dark:text-gray-500" />
          </div>
        )}
      </div>

      {/* Contact Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {contact.name}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            #{ticket.id}
          </span>
        </div>

        {ticket.user && (
          <p className="text-xs text-gray-600 dark:text-gray-400 truncate leading-tight">
            {i18n.t("messagesList.header.assignedTo")} {ticket.user.name}
          </p>
        )}
      </div>
    </div>
  );
};

export default TicketInfo;

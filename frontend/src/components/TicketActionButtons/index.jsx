import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { RotateCcw, MoreVertical, Loader2, Check } from "lucide-react";

import { i18n } from "../../translate/i18n.js";
import api from "../../services/api.js";
import TicketOptionsMenu from "../TicketOptionsMenu";
import toastError from "../../errors/toastError.js";
import { AuthContext } from "../../context/Auth/context";

const TicketActionButtons = ({ ticket }) => {
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const ticketOptionsMenuOpen = Boolean(anchorEl);
  const { user } = useContext(AuthContext);

  const handleOpenTicketOptionsMenu = e => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseTicketOptionsMenu = e => {
    setAnchorEl(null);
  };

  const handleUpdateTicketStatus = async (e, status, userId) => {
    setLoading(true);
    try {
      await api.put(`/tickets/${ticket.id}`, {
        status: status,
        userId: userId || null
      });

      setLoading(false);
      if (status === "open") {
        history.push(`/tickets/${ticket.id}`);
      } else {
        history.push("/tickets");
      }
    } catch (err) {
      setLoading(false);
      toastError(err);
    }
  };

  return (
    <div className="flex items-center gap-2 ml-auto">
      {ticket.status === "closed" && (
        <button
          disabled={loading}
          onClick={e => handleUpdateTicketStatus(e, "open", user?.id)}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <RotateCcw size={16} />
          )}
          <span className="hidden sm:inline">
            {i18n.t("messagesList.header.buttons.reopen")}
          </span>
        </button>
      )}

      {ticket.status === "open" && (
        <>
          <button
            disabled={loading}
            onClick={e => handleUpdateTicketStatus(e, "pending", null)}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <RotateCcw size={16} />
            )}
            <span className="hidden sm:inline">
              {i18n.t("messagesList.header.buttons.return")}
            </span>
          </button>

          <button
            disabled={loading}
            onClick={e => handleUpdateTicketStatus(e, "closed", user?.id)}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Check size={16} />
            )}
            <span className="hidden sm:inline">
              {i18n.t("messagesList.header.buttons.resolve")}
            </span>
          </button>

          <button
            onClick={handleOpenTicketOptionsMenu}
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <MoreVertical
              size={16}
              className="text-gray-600 dark:text-gray-300"
            />
          </button>

          <TicketOptionsMenu
            ticket={ticket}
            anchorEl={anchorEl}
            menuOpen={ticketOptionsMenuOpen}
            handleClose={handleCloseTicketOptionsMenu}
          />
        </>
      )}

      {ticket.status === "pending" && (
        <button
          disabled={loading}
          onClick={e => handleUpdateTicketStatus(e, "open", user?.id)}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Check size={16} />
          )}
          <span className="hidden sm:inline">
            {i18n.t("messagesList.header.buttons.accept")}
          </span>
        </button>
      )}
    </div>
  );
};

export default TicketActionButtons;

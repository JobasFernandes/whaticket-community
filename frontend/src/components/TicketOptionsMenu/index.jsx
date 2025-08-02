import { useContext, useEffect, useRef, useState } from "react";
import { ArrowRightLeft, Trash2 } from "lucide-react";

import { i18n } from "../../translate/i18n.js";
import api from "../../services/api.js";
import ConfirmationModal from "../ConfirmationModal";
import TransferTicketModal from "../TransferTicketModal";
import toastError from "../../errors/toastError.js";
import { Can } from "../Can";
import { AuthContext } from "../../context/Auth/context";

const TicketOptionsMenu = ({ ticket, menuOpen, handleClose, anchorEl }) => {
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [transferTicketModalOpen, setTransferTicketModalOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const isMounted = useRef(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (menuOpen && anchorEl) {
      const rect = anchorEl.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 8,
        left: rect.left - 160 // Ajustar para alinhar à direita
      });
    }
  }, [menuOpen, anchorEl]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleDeleteTicket = async () => {
    try {
      await api.delete(`/tickets/${ticket.id}`);
    } catch (err) {
      toastError(err);
    }
  };

  const handleOpenConfirmationModal = e => {
    setConfirmationOpen(true);
    handleClose();
  };

  const handleOpenTransferModal = e => {
    setTransferTicketModalOpen(true);
    handleClose();
  };

  const handleCloseTransferTicketModal = () => {
    if (isMounted.current) {
      setTransferTicketModalOpen(false);
    }
  };

  return (
    <>
      {menuOpen && (
        <div className="fixed inset-0 z-50" onClick={handleClose}>
          <div
            className="absolute z-40 min-w-[200px] rounded-xl bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 shadow-lg py-2"
            style={{
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={handleOpenTransferModal}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-150 text-gray-700 dark:text-gray-300"
            >
              <ArrowRightLeft size={18} />
              <span>{i18n.t("ticketOptionsMenu.transfer")}</span>
            </button>

            <Can
              role={user.profile}
              perform="ticket-options:deleteTicket"
              yes={() => (
                <button
                  onClick={handleOpenConfirmationModal}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-150 text-gray-700 dark:text-gray-300"
                >
                  <Trash2 size={18} />
                  <span>{i18n.t("ticketOptionsMenu.delete")}</span>
                </button>
              )}
            />
          </div>
        </div>
      )}

      <ConfirmationModal
        title={`${i18n.t("ticketOptionsMenu.confirmationModal.title")}${
          ticket.id
        } ${i18n.t("ticketOptionsMenu.confirmationModal.titleFrom")} ${
          ticket.contact.name
        }?`}
        open={confirmationOpen}
        onClose={setConfirmationOpen}
        onConfirm={handleDeleteTicket}
      >
        {i18n.t("ticketOptionsMenu.confirmationModal.message")}
      </ConfirmationModal>
      <TransferTicketModal
        modalOpen={transferTicketModalOpen}
        onClose={handleCloseTransferTicketModal}
        ticketid={ticket.id}
        ticketWhatsappId={ticket.whatsappId}
      />
    </>
  );
};

export default TicketOptionsMenu;

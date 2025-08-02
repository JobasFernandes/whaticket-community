import { useState, useContext, useEffect } from "react";
import { Reply, Trash2 } from "lucide-react";

import { i18n } from "../../translate/i18n.js";
import api from "../../services/api.js";
import ConfirmationModal from "../ConfirmationModal";
import { ReplyMessageContext } from "../../context/ReplyingMessage/context";
import toastError from "../../errors/toastError.js";

const MessageOptionsMenu = ({ message, menuOpen, handleClose, anchorEl }) => {
  const { setReplyingMessage } = useContext(ReplyMessageContext);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (menuOpen && anchorEl) {
      const rect = anchorEl.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const menuWidth = 180; // Largura aproximada do menu
      const menuHeight = 120; // Altura aproximada do menu

      let left = rect.left;
      let top = rect.bottom + 8;

      // Ajustar posição horizontal
      if (rect.left + menuWidth > viewportWidth) {
        // Se ultrapassar a direita, posicionar à esquerda do elemento
        left = rect.right - menuWidth;
      }

      // Se ainda assim ultrapassar a esquerda, ajustar com margem mínima
      if (left < 8) {
        left = 8;
      }

      // Ajustar posição vertical
      if (rect.bottom + menuHeight > viewportHeight) {
        // Se ultrapassar embaixo, posicionar acima do elemento
        top = rect.top - menuHeight - 8;
      }

      // Se ainda assim ultrapassar o topo, ajustar com margem mínima
      if (top < 8) {
        top = 8;
      }

      setMenuPosition({ top, left });
    }
  }, [menuOpen, anchorEl]);

  // Fechar menu ao redimensionar a tela
  useEffect(() => {
    const handleResize = () => {
      if (menuOpen) {
        handleClose();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuOpen, handleClose]);

  const handleDeleteMessage = async () => {
    try {
      await api.delete(`/messages/${message.id}`);
    } catch (err) {
      toastError(err);
    }
  };

  const hanldeReplyMessage = () => {
    setReplyingMessage(message);
    handleClose();
  };

  const handleOpenConfirmationModal = e => {
    setConfirmationOpen(true);
    handleClose();
  };

  return (
    <>
      <ConfirmationModal
        title={i18n.t("messageOptionsMenu.confirmationModal.title")}
        open={confirmationOpen}
        onClose={setConfirmationOpen}
        onConfirm={handleDeleteMessage}
      >
        {i18n.t("messageOptionsMenu.confirmationModal.message")}
      </ConfirmationModal>

      {menuOpen && (
        <div className="fixed inset-0 z-50" onClick={handleClose}>
          <div
            className="absolute z-40 w-[180px] rounded-xl bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 shadow-lg py-2"
            style={{
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              maxWidth: "calc(100vw - 16px)", // Garantir que não ultrapasse a tela
              maxHeight: "calc(100vh - 16px)" // Garantir que não ultrapasse a tela
            }}
            onClick={e => e.stopPropagation()}
          >
            {message.fromMe && (
              <button
                onClick={handleOpenConfirmationModal}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-150 text-gray-700 dark:text-gray-300"
              >
                <Trash2 size={18} />
                <span>{i18n.t("messageOptionsMenu.delete")}</span>
              </button>
            )}
            <button
              onClick={hanldeReplyMessage}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-150 text-gray-700 dark:text-gray-300"
            >
              <Reply size={18} />
              <span>{i18n.t("messageOptionsMenu.reply")}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageOptionsMenu;

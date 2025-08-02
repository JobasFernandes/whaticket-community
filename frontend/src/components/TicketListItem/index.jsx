import React, { useState, useEffect, useRef, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { parseISO, format, isSameDay } from "date-fns";
import clsx from "clsx";
import { User, Check } from "lucide-react";

import { i18n } from "../../translate/i18n.js";
import api from "../../services/api.js";
import ButtonWithSpinner from "../ButtonWithSpinner";
import MarkdownWrapper from "../MarkdownWrapper";
import AcceptTicketWithoutQueueModal from "../AcceptTicketWithoutQueueModal";
import { AuthContext } from "../../context/Auth/context";
import toastError from "../../errors/toastError.js";

const TicketListItem = ({ ticket }) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [resolveLoading, setResolveLoading] = useState(false);
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const { ticketId } = useParams();
  const isMounted = useRef(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleAcepptTicket = async id => {
    // Se o ticket já tem uma queue, aceita diretamente
    if (ticket.queueId) {
      setLoading(true);
      try {
        await api.put(`/tickets/${id}`, {
          status: "open",
          userId: user?.id
        });
        if (isMounted.current) {
          setLoading(false);
        }
        history.push(`/tickets/${id}`);
      } catch (err) {
        setLoading(false);
        toastError(err);
      }
    } else {
      // Se não tem queue, abrir modal para selecionar
      setAcceptModalOpen(true);
    }
  };

  const handleAcceptWithQueue = async ticketId => {
    // Callback chamado após aceitar ticket com queue selecionada
    if (isMounted.current) {
      setLoading(false);
    }
    history.push(`/tickets/${ticketId}`);
  };

  const handleCloseAcceptModal = () => {
    setAcceptModalOpen(false);
  };

  const handleResolveTicket = async e => {
    e.stopPropagation();
    setResolveLoading(true);
    try {
      await api.put(`/tickets/${ticket.id}`, {
        status: "closed",
        userId: user?.id
      });
      if (isMounted.current) {
        setResolveLoading(false);
      }
      // Redirecionar para a lista de tickets após resolver
      history.push("/tickets");
    } catch (err) {
      setResolveLoading(false);
      toastError(err);
    }
  };

  const handleSelectTicket = id => {
    history.push(`/tickets/${id}`);
  };

  const getMediaTypeText = message => {
    if (!message) return message;

    if (message.includes(".")) {
      const extension = message.toLowerCase().split(".").pop();

      if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
        return "📷 Foto";
      }
      if (["mp4", "avi", "mov", "wmv", "webm"].includes(extension)) {
        return "🎥 Vídeo";
      }
      if (["mp3", "wav", "ogg", "aac", "m4a"].includes(extension)) {
        return "🎵 Áudio";
      }
      if (
        ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"].includes(
          extension
        )
      ) {
        return "📄 Documento";
      }
      if (["zip", "rar", "7z", "tar", "gz"].includes(extension)) {
        return "📦 Arquivo";
      }

      if (message.includes("-") && message.length > 20) {
        return "📎 Arquivo";
      }
    }

    if (message.includes("|") && message.match(/^-?\d+\.\d+,-?\d+\.\d+/)) {
      return "📍 Localização";
    }

    if (
      message.includes("BEGIN:VCARD") ||
      message.includes("FN:") ||
      message.includes("TEL:")
    ) {
      return "👤 Contato";
    }

    return message;
  };

  const isSelected = ticketId && +ticketId === ticket.id;
  const isPending = ticket.status === "pending";
  const isClosed = ticket.status === "closed";

  return (
    <div className="relative">
      <div
        className={clsx(
          "relative flex items-center px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 cursor-pointer border-l-4",
          {
            "bg-blue-50 dark:bg-blue-900/20 border-l-blue-500": isSelected,
            "border-l-transparent": !isSelected,
            "cursor-default": isPending,
            "bg-yellow-50 dark:bg-yellow-900/20 border-l-yellow-500": isPending
          }
        )}
        style={{
          borderLeftColor:
            !isSelected && !isPending && ticket.queue?.color
              ? ticket.queue.color
              : undefined
        }}
        onClick={e => {
          if (isPending) return;
          handleSelectTicket(ticket.id);
        }}
      >
        {/* Avatar */}
        <div className="flex-shrink-0 mr-3 relative">
          {ticket?.contact?.profilePicUrl ? (
            <img
              src={ticket.contact.profilePicUrl}
              alt={ticket.contact.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
              <User size={16} className="text-gray-500 dark:text-gray-400" />
            </div>
          )}

          {/* Unread count badge on avatar */}
          {ticket.unreadMessages > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-[16px] w-[16px] text-xs font-bold text-white bg-green-500 rounded-full">
              {ticket.unreadMessages > 9 ? "9+" : ticket.unreadMessages}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3
              className={clsx(
                "text-sm font-medium truncate pr-2",
                isPending
                  ? "text-gray-900 dark:text-white font-semibold"
                  : "text-gray-900 dark:text-white"
              )}
            >
              {ticket.contact.name}
            </h3>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Status badge */}
              {isClosed && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {i18n.t("ticketsList.status.closed")}
                </span>
              )}

              {/* Pending badge */}
              {isPending && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300">
                  {i18n.t("ticketsList.status.pending")}
                </span>
              )}

              {/* Resolve button for open tickets */}
              {ticket.status === "open" && (
                <ButtonWithSpinner
                  color="primary"
                  variant="contained"
                  size="small"
                  loading={resolveLoading}
                  onClick={handleResolveTicket}
                  style={{ padding: "4px" }}
                  className="!inline-flex !items-center px-1.5 py-0.5 !text-xs !font-medium !rounded !bg-green-600 hover:!bg-green-700 !text-white !shadow-none !border-none !min-h-0 !h-auto !leading-none"
                >
                  {!resolveLoading && <Check size={12} className="mr-1" />}
                  {i18n.t("ticketsList.buttons.resolve")}
                </ButtonWithSpinner>
              )}

              {/* Time */}
              {ticket.lastMessage && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {isSameDay(parseISO(ticket.updatedAt), new Date())
                    ? format(parseISO(ticket.updatedAt), "HH:mm")
                    : format(parseISO(ticket.updatedAt), "dd/MM")}
                </span>
              )}
            </div>
          </div>

          {/* Message and Tags */}
          <div className="flex items-center justify-between mt-1">
            <div className="flex-1 min-w-0">
              {ticket.lastMessage ? (
                <div
                  className={clsx(
                    "text-xs truncate pr-2",
                    isPending
                      ? "text-gray-800 dark:text-gray-200 font-medium"
                      : "text-gray-600 dark:text-gray-400"
                  )}
                >
                  <MarkdownWrapper>
                    {getMediaTypeText(ticket.lastMessage)}
                  </MarkdownWrapper>
                </div>
              ) : (
                <div
                  className={clsx(
                    "text-xs italic",
                    isPending
                      ? "text-yellow-700 dark:text-yellow-300"
                      : "text-gray-400 dark:text-gray-500"
                  )}
                >
                  {isPending
                    ? i18n.t("ticketsList.messages.pending")
                    : i18n.t("ticketsList.messages.noMessages")}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Accept button for pending tickets - positioned with tags */}
              {isPending && (
                <ButtonWithSpinner
                  color="primary"
                  variant="contained"
                  size="small"
                  loading={loading}
                  onClick={e => {
                    e.stopPropagation();
                    handleAcepptTicket(ticket.id);
                  }}
                  style={{ padding: "4px" }}
                  className="!inline-flex !items-center px-1.5 py-0.5 !text-xs !font-medium !rounded !bg-red-600 hover:!bg-red-700 !text-white !shadow-none !border-none !min-h-0 !h-auto !leading-none"
                >
                  {i18n.t("ticketsList.buttons.accept")}
                </ButtonWithSpinner>
              )}

              {/* Queue tag */}
              {ticket.queue && (
                <span
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium text-white"
                  style={{ backgroundColor: ticket.queue.color || "#6B7280" }}
                  title={ticket.queue.name}
                >
                  {ticket.queue.name}
                </span>
              )}

              {/* WhatsApp connection */}
              {ticket.whatsappId && (
                <span
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300"
                  title={i18n.t("ticketsList.connectionTitle")}
                >
                  {ticket.whatsapp?.name}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-b border-gray-200 dark:border-gray-600 ml-11" />

      {/* Accept Ticket Modal - só aparece para tickets sem queue */}
      {!ticket.queueId && (
        <AcceptTicketWithoutQueueModal
          modalOpen={acceptModalOpen}
          onClose={handleCloseAcceptModal}
          ticket={ticket}
          onAccept={handleAcceptWithQueue}
        />
      )}
    </div>
  );
};

export default TicketListItem;

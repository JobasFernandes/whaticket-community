import { useState, useRef, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { format } from "date-fns";
import openSocket from "../../services/socket-io.js";
import useSound from "use-sound";
import { Bell, BellRing } from "lucide-react";

import TicketListItem from "../TicketListItem";
import { i18n } from "../../translate/i18n.js";
import useTickets from "../../hooks/useTickets";
import alertSound from "../../assets/sound.mp3";
import { AuthContext } from "../../context/Auth/AuthContext";

const NotificationsPopOver = () => {
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const ticketIdUrl = +history.location.pathname.split("/")[2];
  const ticketIdRef = useRef(ticketIdUrl);
  const anchorEl = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [, setDesktopNotifications] = useState([]);

  const { tickets } = useTickets({ withUnreadMessages: "true" });
  const [play] = useSound(alertSound, {
    volume: 0.5,
    interrupt: true
  });
  const soundAlertRef = useRef();
  const [audioContextResumed, setAudioContextResumed] = useState(false);

  const historyRef = useRef(history);

  const resumeAudioContext = async () => {
    if (!audioContextResumed) {
      try {
        if (window.AudioContext || window.webkitAudioContext) {
          const audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
          if (audioContext.state === "suspended") {
            await audioContext.resume();
          }
        }
        setAudioContextResumed(true);
      } catch (error) {
        console.warn("Erro ao resumir AudioContext:", error);
      }
    }
  };

  useEffect(() => {
    soundAlertRef.current = async () => {
      await resumeAudioContext();
      try {
        play();
      } catch (error) {
        console.warn("Erro ao reproduzir som:", error);
      }
    };

    if (!("Notification" in window)) {
      console.log("This browser doesn't support notifications");
    } else {
      Notification.requestPermission();
    }

    const handleFirstInteraction = () => {
      resumeAudioContext();
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
    };

    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("keydown", handleFirstInteraction);

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
    };
  }, [play]);

  useEffect(() => {
    setNotifications(tickets);
  }, [tickets]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setDesktopNotifications([]);
      setIsOpen(false);
    }
  }, [user]);

  useEffect(() => {
    ticketIdRef.current = ticketIdUrl;
  }, [ticketIdUrl]);

  useEffect(() => {
    const socket = openSocket();

    socket.on("connect", () => socket.emit("joinNotification"));

    socket.on("ticket", data => {
      if (data.action === "updateUnread" || data.action === "delete") {
        setNotifications(prevState => {
          const ticketIndex = prevState.findIndex(t => t.id === data.ticketId);
          if (ticketIndex !== -1) {
            prevState.splice(ticketIndex, 1);
            return [...prevState];
          }
          return prevState;
        });

        setDesktopNotifications(prevState => {
          const notfiticationIndex = prevState.findIndex(
            n => n.tag === String(data.ticketId)
          );
          if (notfiticationIndex !== -1) {
            prevState[notfiticationIndex].close();
            prevState.splice(notfiticationIndex, 1);
            return [...prevState];
          }
          return prevState;
        });
      }
    });

    socket.on("appMessage", data => {
      if (
        data.action === "create" &&
        !data.message.read &&
        (data.ticket.userId === user?.id || !data.ticket.userId)
      ) {
        setNotifications(prevState => {
          const ticketIndex = prevState.findIndex(t => t.id === data.ticket.id);
          if (ticketIndex !== -1) {
            prevState[ticketIndex] = data.ticket;
            return [...prevState];
          }
          return [data.ticket, ...prevState];
        });

        const shouldNotNotificate =
          (data.message.ticketId === ticketIdRef.current &&
            document.visibilityState === "visible") ||
          (data.ticket.userId && data.ticket.userId !== user?.id) ||
          data.ticket.isGroup;

        if (shouldNotNotificate) return;

        handleNotifications(data);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const handleNotifications = data => {
    const { message, contact, ticket } = data;

    const options = {
      body: `${message.body} - ${format(new Date(), "HH:mm")}`,
      icon: contact.profilePicUrl,
      tag: ticket.id,
      renotify: true
    };

    const notification = new Notification(
      `${i18n.t("tickets.notification.message")} ${contact.name}`,
      options
    );

    notification.onclick = e => {
      e.preventDefault();
      window.focus();
      historyRef.current.push(`/tickets/${ticket.id}`);
    };

    setDesktopNotifications(prevState => {
      const notfiticationIndex = prevState.findIndex(
        n => n.tag === notification.tag
      );
      if (notfiticationIndex !== -1) {
        prevState[notfiticationIndex] = notification;
        return [...prevState];
      }
      return [notification, ...prevState];
    });

    soundAlertRef.current();
  };

  const handleClick = () => {
    setIsOpen(prevState => !prevState);
  };

  const handleClickAway = () => {
    setIsOpen(false);
  };

  const NotificationTicket = ({ children }) => {
    return <div onClick={handleClickAway}>{children}</div>;
  };

  return (
    <div className="relative">
      {user && (
        <>
          <button
            onClick={handleClick}
            ref={anchorEl}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 dark:bg-[#2c2c2c] hover:bg-gray-200 dark:hover:bg-[#3d3d3d] text-gray-600 dark:text-gray-300 transition-colors duration-150"
            aria-label="Notificações"
          >
            {notifications.length > 0 ? (
              <BellRing size={20} />
            ) : (
              <Bell size={20} />
            )}
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-[16px] w-[16px] flex items-center justify-center font-medium text-[10px]">
                {notifications.length > 9 ? "9+" : notifications.length}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {isOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={handleClickAway}
              ></div>

              {/* Popover */}
              <div className="absolute right-0 mt-2 w-80 max-w-sm bg-white dark:bg-[#1e1e1e] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {i18n.t("notifications.title") || "Notificações"}
                  </h3>
                </div>

                {/* Content */}
                <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <Bell
                        size={48}
                        className="mx-auto text-gray-400 dark:text-gray-500 mb-3"
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {i18n.t("notifications.noTickets") ||
                          "Sem notificações"}
                      </p>
                    </div>
                  ) : (
                    <div className="py-2">
                      {notifications.map(ticket => (
                        <NotificationTicket key={ticket.id}>
                          <TicketListItem ticket={ticket} />
                        </NotificationTicket>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default NotificationsPopOver;

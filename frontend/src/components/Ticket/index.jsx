import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";

import { toast } from "react-toastify";
import openSocket from "../../services/socket-io.js";
import clsx from "clsx";

import ContactDrawer from "../ContactDrawer";
import MessageInput from "../MessageInput/";
import TicketHeader from "../TicketHeader";
import TicketInfo from "../TicketInfo";
import TicketActionButtons from "../TicketActionButtons";
import MessagesList from "../MessagesList";
import api from "../../services/api.js";
import ReplyMessageProvider from "../../context/ReplyingMessage/ReplyingMessageContext";
import toastError from "../../errors/toastError.js";

const Ticket = () => {
  const { ticketId } = useParams();
  const history = useHistory();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contact, setContact] = useState({});
  const [ticket, setTicket] = useState({});

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchTicket = async () => {
        try {
          const { data } = await api.get("/tickets/" + ticketId);

          setContact(data.contact);
          setTicket(data);
          setLoading(false);
        } catch (err) {
          setLoading(false);
          toastError(err);
        }
      };
      fetchTicket();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [ticketId, history]);

  useEffect(() => {
    const socket = openSocket();

    socket.on("connect", () => socket.emit("joinChatBox", ticketId));

    socket.on("ticket", data => {
      if (data.action === "update") {
        setTicket(data.ticket);
      }

      if (data.action === "delete") {
        toast.success("Ticket deleted sucessfully.");
        history.push("/tickets");
      }
    });

    socket.on("contact", data => {
      if (data.action === "update") {
        setContact(prevState => {
          if (prevState.id === data.contact?.id) {
            return { ...prevState, ...data.contact };
          }
          return prevState;
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [ticketId, history]);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <div className="flex h-full relative overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 h-full flex flex-col overflow-hidden bg-white dark:bg-[#1e1e1e] rounded-lg sm:rounded-r-lg sm:rounded-l-none">
        <TicketHeader loading={loading}>
          <div className="flex-1 max-w-[50%] sm:max-w-[80%]">
            <TicketInfo
              contact={contact}
              ticket={ticket}
              onClick={handleDrawerOpen}
            />
          </div>
          <div className="flex-1 max-w-[50%] sm:max-w-full flex sm:mb-1">
            <TicketActionButtons ticket={ticket} />
          </div>
        </TicketHeader>

        <ReplyMessageProvider>
          <MessagesList ticketId={ticketId} isGroup={ticket.isGroup} />
          <MessageInput ticketStatus={ticket.status} />
        </ReplyMessageProvider>
      </div>

      {/* Contact Drawer */}
      <ContactDrawer
        open={drawerOpen}
        handleDrawerClose={handleDrawerClose}
        contact={contact}
        loading={loading}
      />
    </div>
  );
};

export default Ticket;

import { useState, useEffect, useContext } from "react";
import { getHoursCloseTicketsAuto } from "../../config.js";
import toastError from "../../errors/toastError.js";
import { AuthContext } from "../../context/Auth/context";

import api from "../../services/api.js";

const useTickets = ({
  searchParam,
  pageNumber,
  status,
  date,
  showAll,
  queueIds,
  withUnreadMessages
}) => {
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [count, setCount] = useState(0);
  const { isAuth } = useContext(AuthContext);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchTickets = async () => {
        try {
          // Check if user is authenticated before making the request
          if (!isAuth) {
            if (isMounted) {
              setLoading(false);
            }
            return;
          }

          // Check if there's a token before making the request
          const token = localStorage.getItem("token");
          if (!token) {
            if (isMounted) {
              setLoading(false);
            }
            return;
          }

          const { data } = await api.get("/tickets", {
            params: {
              searchParam,
              pageNumber,
              status,
              date,
              showAll,
              queueIds,
              withUnreadMessages
            }
          });

          if (!isMounted) return;

          setTickets(data.tickets);

          let horasFecharAutomaticamente = getHoursCloseTicketsAuto();

          if (
            status === "open" &&
            horasFecharAutomaticamente &&
            horasFecharAutomaticamente !== "" &&
            horasFecharAutomaticamente !== "0" &&
            Number(horasFecharAutomaticamente) > 0
          ) {
            let dataLimite = new Date();
            dataLimite.setHours(
              dataLimite.getHours() - Number(horasFecharAutomaticamente)
            );

            data.tickets.forEach(ticket => {
              if (ticket.status !== "closed") {
                let dataUltimaInteracaoChamado = new Date(ticket.updatedAt);
                if (dataUltimaInteracaoChamado < dataLimite)
                  closeTicket(ticket);
              }
            });
          }

          if (isMounted) {
            setHasMore(data.hasMore);
            setCount(data.count);
            setLoading(false);
          }
        } catch (err) {
          if (isMounted) {
            setLoading(false);
            // Don't show error toast if it's an unauthorized error (likely due to logout)
            if (err.response?.status !== 401) {
              toastError(err);
            }
          }
        }
      };

      const closeTicket = async ticket => {
        if (isMounted) {
          await api.put(`/tickets/${ticket.id}`, {
            status: "closed",
            userId: ticket.userId || null
          });
        }
      };

      fetchTickets();
    }, 500);
    return () => {
      clearTimeout(delayDebounceFn);
      isMounted = false;
    };
  }, [
    searchParam,
    pageNumber,
    status,
    date,
    showAll,
    queueIds,
    withUnreadMessages,
    isAuth
  ]);

  return { tickets, loading, hasMore, count };
};

export default useTickets;

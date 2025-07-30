import { useState, useEffect, useReducer } from "react";
import openSocket from "../../services/socket-io.js";
import toastError from "../../errors/toastError.js";

import api from "../../services/api.js";

const reducer = (state, action) => {
  if (action.type === "LOAD_WHATSAPPS") {
    const whatsApps = action.payload;

    return [...whatsApps];
  }

  if (action.type === "UPDATE_WHATSAPPS") {
    const whatsApp = action.payload;
    const whatsAppIndex = state.findIndex(s => s.id === whatsApp.id);

    if (whatsAppIndex !== -1) {
      state[whatsAppIndex] = whatsApp;
      return [...state];
    } else {
      return [whatsApp, ...state];
    }
  }

  if (action.type === "UPDATE_SESSION") {
    const whatsApp = action.payload;
    const whatsAppIndex = state.findIndex(s => s.id === whatsApp.id);

    if (whatsAppIndex !== -1) {
      state[whatsAppIndex].status = whatsApp.status;
      state[whatsAppIndex].updatedAt = whatsApp.updatedAt;
      state[whatsAppIndex].qrcode = whatsApp.qrcode;
      state[whatsAppIndex].retries = whatsApp.retries;
      return [...state];
    } else {
      return [...state];
    }
  }

  if (action.type === "DELETE_WHATSAPPS") {
    const whatsAppId = action.payload;

    const whatsAppIndex = state.findIndex(s => s.id === whatsAppId);
    if (whatsAppIndex !== -1) {
      state.splice(whatsAppIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }
};

const useWhatsApps = (isAuth = false) => {
  const [whatsApps, dispatch] = useReducer(reducer, []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuth) {
      dispatch({ type: "RESET" });
      setLoading(false);
      return;
    }

    setLoading(true);
    const fetchSession = async () => {
      try {
        const { data } = await api.get("/whatsapp/");
        dispatch({ type: "LOAD_WHATSAPPS", payload: data });
        setLoading(false);
      } catch (err) {
        setLoading(false);
        // Só mostra erro se não for 401 ou 403 (usuário deslogado)
        if (err?.response?.status !== 401 && err?.response?.status !== 403) {
          toastError(err);
        }
      }
    };
    fetchSession();
  }, [isAuth]);

  useEffect(() => {
    if (!isAuth) return;

    const socket = openSocket();
    if (!socket) return;

    socket.on("whatsapp", data => {
      if (data.action === "update") {
        dispatch({ type: "UPDATE_WHATSAPPS", payload: data.whatsapp });
      }
      if (data.action === "delete") {
        dispatch({ type: "DELETE_WHATSAPPS", payload: data.whatsappId });
      }
    });

    socket.on("whatsappSession", data => {
      if (data.action === "update") {
        dispatch({ type: "UPDATE_SESSION", payload: data.session });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [isAuth]);

  return { whatsApps, loading };
};

export default useWhatsApps;

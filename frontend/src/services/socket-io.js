import openSocket from "socket.io-client";
import { getBackendUrl } from "../config";

function connectToSocket() {
  const token = localStorage.getItem("token");

  // Verifica se o token existe e não é null/undefined
  if (!token || token === "null" || token === "undefined") {
    console.warn("No valid token found, skipping socket connection");
    return null;
  }

  try {
    const parsedToken = JSON.parse(token);
    if (!parsedToken) {
      console.warn("Invalid token format, skipping socket connection");
      return null;
    }

    return openSocket(getBackendUrl(), {
      transports: ["websocket", "polling", "flashsocket"],
      query: {
        token: parsedToken
      }
    });
  } catch (error) {
    console.warn("Error parsing token, skipping socket connection", error);
    return null;
  }
}

export default connectToSocket;

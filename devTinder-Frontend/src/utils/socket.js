// utils/socket.js
import { io } from "socket.io-client";
import { BASE_URL } from "./constants";

let socket;

export const createSocketConnection = () => {
  if (!socket) {
    socket =
      location.hostname === "localhost"
        ? io(BASE_URL, { withCredentials: true })
        : io("/", { path: "/api/socket.io", withCredentials: true });
  }
  return socket;
};

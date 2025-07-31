// src/shared/socket.js ✅ CORRECT
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  withCredentials: true,
});

export default socket;

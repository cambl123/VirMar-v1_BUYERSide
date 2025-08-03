// src/shared/socket.js
import { io } from "socket.io-client";
import { API_BASE_URL } from "../configs/api.config"; // Adjust the import path as necessary

// Use the dynamic base URL for the socket connection
const socket = io(API_BASE_URL, {
  withCredentials: true,
});

export default socket;
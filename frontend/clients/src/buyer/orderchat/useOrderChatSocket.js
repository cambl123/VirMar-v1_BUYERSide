import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { API_BASE_URL } from '../../configs/api.config'; // Adjust the import path as necessary

const useOrderChatSocket = (orderId, handleNewMessage) => {
  useEffect(() => {
    // 1️⃣ Use the dynamic API_BASE_URL instead of a hard-coded one
    const socket = io(API_BASE_URL, {
      withCredentials: true,
    });

    socket.emit('joinRoom', { orderId });

    socket.on(`chat-${orderId}`, (messageData) => {
      handleNewMessage(messageData);
    });

    // 2️⃣ Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, [orderId, handleNewMessage]);
};

export default useOrderChatSocket;
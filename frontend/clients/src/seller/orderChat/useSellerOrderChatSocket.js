import { useEffect } from 'react';
import { io } from 'socket.io-client';

const useSellerOrderChatSocket = (orderId, handleNewMessage) => {
  useEffect(() => {
    const socket = io('http://localhost:5000', {
      withCredentials: true,
    });

    socket.emit('joinRoom', { orderId });

    socket.on(`chat-${orderId}`, (messageData) => {
      handleNewMessage(messageData);
    });

    return () => {
      socket.disconnect();
    };
  }, [orderId, handleNewMessage]);
};

export default useSellerOrderChatSocket;

import React, { useState, useEffect } from 'react';
import SellerChatMessageList from './SellerChatMessageList';
import SellerChatInputBox from './SellerChatInputBox';
import useSellerOrderChatSocket from './useSellerOrderChatSocket';
import { io } from 'socket.io-client';
import './chat.css';

const SellerOrderChatPage = ({ orderId }) => {
  const [messages, setMessages] = useState([]);
  const sellerId = 'seller456'; // TODO: Replace with logged-in seller ID
  const buyerId = 'buyer123';  // TODO: Replace with real buyer ID

  useEffect(() => {
    // Optional: Fetch past messages from backend via API
    setMessages([
      { senderId: buyerId, message: 'Hi, is my order shipped?', timestamp: new Date() },
      { senderId: sellerId, message: 'Yes, it’s on the way!', timestamp: new Date() },
    ]);
  }, [orderId]);

  const handleNewMessage = (newMsg) => {
    setMessages((prev) => [...prev, newMsg]);
  };

  // Hook to handle socket logic
  useSellerOrderChatSocket(orderId, handleNewMessage);

  const handleSend = (newMsg) => {
    setMessages((prev) => [...prev, newMsg]);

    const socket = io('http://localhost:5000', {
      withCredentials: true,
    });

    socket.emit('sendMessage', newMsg);
  };

  return (
    <div className="chat-container">
      <h2>Order Chat</h2>
      <SellerChatMessageList messages={messages} sellerId={sellerId} />
      <SellerChatInputBox
        onSend={handleSend}
        senderId={sellerId}
        receiverId={buyerId}
        orderId={orderId}
      />
    </div>
  );
};

export default SellerOrderChatPage;

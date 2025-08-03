import React, { useState, useEffect } from 'react';
import SellerChatMessageList from './SellerChatMessageList';
import SellerChatInputBox from './SellerChatInputBox';
import useSellerOrderChatSocket from './useSellerOrderChatSocket';
import './chat.css';

// ⚠️ Note: For production, ensure you have an authentication context
// to get the real sellerId, instead of hard-coding it.

const SellerOrderChatPage = ({ orderId, sellerId, buyerId }) => {
  const [messages, setMessages] = useState([]);

  // Use the hook to get the socket and handle incoming messages
  const { socket } = useSellerOrderChatSocket(orderId, (newMsg) => {
    // This callback runs when a new message is received from the server
    setMessages((prev) => [...prev, newMsg]);
  });

  useEffect(() => {
    // This is where you would fetch and set past messages from your backend API
    // For now, using mock data as in your original component
    setMessages([
      { senderId: buyerId, message: 'Hi, is my order shipped?', timestamp: new Date() },
      { senderId: sellerId, message: 'Yes, it’s on the way!', timestamp: new Date() },
    ]);
  }, [orderId, buyerId, sellerId]);

  // Correct message sending function
  const handleSend = (messageText) => {
    // Check if the socket is connected and the message is not empty
    if (socket && messageText.trim()) {
      const newMessage = {
        senderId,
        buyerId,
        orderId,
        message: messageText,
        timestamp: new Date(),
      };

      // 1️⃣ Emit the message using the socket instance from the hook
      socket.emit('sendMessage', newMessage);

      // 2️⃣ Optimistically update the UI for instant feedback
      setMessages((prev) => [...prev, newMessage]);
    }
  };

  return (
    <div className="chat-container">
      <h2>Order Chat for Order #{orderId}</h2>
      <SellerChatMessageList messages={messages} currentUserId={sellerId} />
      <SellerChatInputBox onSend={handleSend} />
    </div>
  );
};

export default SellerOrderChatPage;
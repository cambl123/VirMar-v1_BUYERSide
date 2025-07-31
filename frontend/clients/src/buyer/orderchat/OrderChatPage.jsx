// src/buyer/orderChat/OrderChatPage.jsx
import React, { useState, useEffect } from 'react';
import ChatMessageList from './ChatMessageList';
import ChatInputBox from './ChatInputBox';
import useOrderChatSocket from './useOrderChatSocket';  // <-- use the socket hook
import './chat.css'; 

const OrderChatPage = ({ orderId }) => {
  const [messages, setMessages] = useState([]);
  const buyerId = 'buyer123'; // ← Replace with actual buyer ID from auth
  const sellerId = 'seller456'; // ← Replace with seller from order

  // Fetching initial messages (Could use API here)
  useEffect(() => {
    setMessages([
      { senderId: buyerId, message: 'Hi, is my order shipped?', timestamp: new Date() },
      { senderId: sellerId, message: 'Yes, it’s on the way!', timestamp: new Date() },
    ]);
  }, [orderId]);

  // New message handler from socket
  const handleNewMessage = (newMsg) => {
    setMessages((prev) => [...prev, newMsg]);
  };

  // Use socket to receive and send messages
  useOrderChatSocket(orderId, handleNewMessage);

  const handleSend = (newMsg) => {
    setMessages((prev) => [...prev, newMsg]);
    // Emit message to backend through socket
    const socket = io('http://localhost:5000');  // Assuming socket is already initialized here
    socket.emit('sendMessage', newMsg);
  };

  return (
    <div className="chat-container">
      <h2>Order Chat</h2>
      <ChatMessageList messages={messages} buyerId={buyerId} />
      <ChatInputBox onSend={handleSend} senderId={buyerId} receiverId={sellerId} orderId={orderId} />
    </div>
  );
};

export default OrderChatPage;

// src/buyer/orderChat/OrderChatPage.jsx
import React, { useState, useEffect } from 'react';
import ChatMessageList from './ChatMessageList';
import ChatInputBox from './ChatInputBox';
import useOrderChatSocket from './useOrderChatSocket';
import './Chat.css';
import { useAuth } from '../../configs/AuthContext'; // Import your authentication context

const OrderChatPage = ({ orderId }) => {
  const [messages, setMessages] = useState([]);
  const { user } = useAuth(); // Get authenticated user from context

  // 1️⃣ Get socket instance and sender ID from the hook
  const { socket, senderId, receiverId } = useOrderChatSocket(orderId, (newMsg) => {
    setMessages((prev) => [...prev, newMsg]);
  });

  // Fetching initial messages (This should be an API call)
  useEffect(() => {
    // In a real application, you would fetch old messages here
    // For now, let's use a dummy message for demonstration
    //
    // try {
    //   const response = await axios.get(`${API_BASE_URL}/api/chat/messages/${orderId}`);
    //   setMessages(response.data);
    // } catch (error) {
    //   console.error("Failed to fetch messages:", error);
    // }

    setMessages([
      { senderId: 'seller456', message: 'Hi, is my order shipped?', timestamp: new Date() },
      { senderId: 'buyer123', message: 'Yes, it’s on the way!', timestamp: new Date() },
    ]);
  }, [orderId]);

  // 2️⃣ Correct message sending
  const handleSend = (newMessageText) => {
    if (socket && newMessageText.trim()) {
      const newMessage = {
        senderId,
        receiverId,
        orderId,
        message: newMessageText,
        timestamp: new Date(),
      };
      
      // Emit message to backend through the socket from the hook
      socket.emit('sendMessage', newMessage);

      // Optimistically update the UI
      setMessages((prev) => [...prev, newMessage]);
    }
  };

  if (!user) {
    return <div>Please log in to view the chat.</div>;
  }

  return (
    <div className="chat-container">
      <h2>Order Chat for Order #{orderId}</h2>
      <ChatMessageList messages={messages} currentUserId={user.id} />
      <ChatInputBox onSend={handleSend} />
    </div>
  );
};

export default OrderChatPage;
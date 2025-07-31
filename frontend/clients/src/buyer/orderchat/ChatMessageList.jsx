// src/buyer/orderChat/ChatMessageList.jsx
import React from 'react';

const ChatMessageList = ({ messages, buyerId }) => {
  return (
    <div className="chat-messages">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`chat-bubble ${msg.senderId === buyerId ? 'sent' : 'received'}`}
        >
          <p>{msg.message}</p>
          <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
        </div>
      ))}
    </div>
  );
};

export default ChatMessageList;

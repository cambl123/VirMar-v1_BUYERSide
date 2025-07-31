import React from 'react';

const SellerChatMessageList = ({ messages, sellerId }) => {
  return (
    <div className="chat-messages">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`chat-bubble ${msg.senderId === sellerId ? 'sent' : 'received'}`}
        >
          <p>{msg.message}</p>
          <span className="timestamp">
            {new Date(msg.timestamp).toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default SellerChatMessageList;

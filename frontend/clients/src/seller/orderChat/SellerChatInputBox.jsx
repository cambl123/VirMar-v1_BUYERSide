import React, { useState } from 'react';

const SellerChatInputBox = ({ onSend, senderId, receiverId, orderId }) => {
  const [text, setText] = useState('');

  const sendMessage = () => {
    if (text.trim() === '') return;

    const newMsg = {
      senderId,
      receiverId,
      orderId,
      message: text,
      timestamp: new Date(),
    };

    onSend(newMsg);
    setText('');
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default SellerChatInputBox;

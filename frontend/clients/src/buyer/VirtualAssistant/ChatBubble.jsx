// src/buyer/components/VirtualAssistant/ChatBubble.jsx
import React from "react";
import "./chat.css"; // you can style as needed

function ChatBubble({ message, sender }) {
  const isUser = sender === "user";

  return (
    <div className={`chat-bubble ${isUser ? "user" : "assistant"}`}>
      <p>{message}</p>
    </div>
  );
}

export default ChatBubble;

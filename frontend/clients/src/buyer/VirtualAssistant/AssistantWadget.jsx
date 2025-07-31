// src/buyer/components/VirtualAssistant/AssistantWidget.jsx
import React, { useState } from "react";
import ChatBubble from "./ChatBubble";
import { getAssistantReply } from "./assistantLogic";
import "./widget.css"; // Optional styling

function AssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "assistant", message: "Hi! Need help with anything?" }
  ]);
  const [input, setInput] = useState("");

  const toggleWidget = () => setIsOpen(!isOpen);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", message: input };
    const replyMsg = { sender: "assistant", message: getAssistantReply(input) };

    setMessages([...messages, userMsg, replyMsg]);
    setInput("");
  };

  return (
    <div className="assistant-widget">
      <button onClick={toggleWidget} className="toggle-btn">
        {isOpen ? "×" : "🤖"}
      </button>

      {isOpen && (
        <div className="chat-box">
          <div className="messages">
            {messages.map((msg, i) => (
              <ChatBubble key={i} {...msg} />
            ))}
          </div>
          <div className="input-area">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me something..."
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssistantWidget;

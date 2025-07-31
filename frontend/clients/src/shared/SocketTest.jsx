// src/buyer/components/test/SocketTest.jsx
import React, { useEffect } from "react";
import socket from "./socket";

const SocketTest = () => {
  useEffect(() => {
    socket.emit("joinRoom", "test-room");

    socket.on("orderStatusUpdate", (data) => {
      alert(`Order ${data.orderId} is now ${data.status}`);
    });

    return () => {
      socket.off("orderStatusUpdate");
    };
  }, []);

  const simulateUpdate = () => {
    socket.emit("orderStatusUpdate", {
      orderId: "123ABC",
      status: "delivered",
    });
  };

  return (
    <div>
      <h2>🧪 Socket Test</h2>
      <button onClick={simulateUpdate}>Simulate Order Update</button>
    </div>
  );
};

export default SocketTest;

import { Server } from "socket.io";

export function initSocketServer(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // ✅ Must match your frontend port
      credentials: true,               // ✅ Allow cookies/auth headers
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    // Join a room (based on orderId)
    socket.on("joinRoom", ({ orderId }) => {
      socket.join(orderId);
      console.log(`🔗 ${socket.id} joined room: ${orderId}`);
    });

    // Handle chat messages
    socket.on("sendMessage", (messageData) => {
      const { orderId } = messageData;
      if (!orderId) {
        console.warn("⚠️ Missing orderId in message");
        return;
      }
      io.to(orderId).emit(`chat-${orderId}`, messageData);
      console.log(`💬 Message sent to room ${orderId}:`, messageData.message);
    });

    // Optional: Handle order status updates
    socket.on("orderUpdate", ({ orderId, status }) => {
      io.to(orderId).emit("orderUpdated", status);
      console.log(`📦 Order ${orderId} updated to ${status}`);
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });
}

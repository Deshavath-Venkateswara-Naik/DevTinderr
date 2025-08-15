const { Server } = require("socket.io");

let io;

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*", // adjust in production
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
    });

    // Handle sending message
    socket.on("sendMessage", (msgData) => {
      // Send back instantly to sender
      io.to(msgData.roomId).emit("messageReceived", {
        ...msgData,
        _id: Date.now().toString(), // temp ID before DB save
      });

      // TODO: Save to DB async
      // Example: saveChatMessage(msgData);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}

function getIO() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}

module.exports = initializeSocket;

export const initSocket = (io) => {

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Клиент может подписаться на уведомления конкретного юзера
    socket.on("join", (userId) => {
      socket.join(`user:${userId}`);
      console.log(`Socket ${socket.id} joined room user:${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

};
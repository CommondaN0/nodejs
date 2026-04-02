import env from "./config/env.js";
import app from "./app.js";
import sequelize from "./database/db.js";
import "./models/User.js";
import "./models/Post.js";
import "./models/Tag.js";
import "./models/RefreshToken.js";
import "./models/associations.js";
import http from "http";
import { Server } from "socket.io";
import { initSocket } from "./socket/index.js";

const server = http.createServer(app); // оборачиваем app в http сервер

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

initSocket(io); // инициализируем socket логику
app.set("io", io); // делаем io доступным в роутах

async function start() {
  try {
    await sequelize.authenticate();
    console.log("Database connected");
    await sequelize.sync();
    server.listen(env.port, () => { // слушаем server, а не app
      console.log(`Server started on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();
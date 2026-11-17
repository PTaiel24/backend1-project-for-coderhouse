import { createServer } from "node:http";
import { Server } from "socket.io";

import envConfig from "./config/env.config.js";
import app from "./app.js";
import connectDB from "./config/database.config.js";

async function startServer() {
  await connectDB();

  const httpServer = createServer(app);
  const io = new Server(httpServer);

  app.set("io", io);

  io.on("connection", (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Cliente desconectado: ${socket.id}`);
    });
  });

  httpServer.listen(envConfig.port, () => {
    console.log(`Server started on port: ${envConfig.port}`);
    console.log(`Bienvenido a ${envConfig.app_name}`);
  });
}

startServer();

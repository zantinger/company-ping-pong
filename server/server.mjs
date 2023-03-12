import { createServer } from "http";
import { Server } from "socket.io";

export const httpServer = createServer();
export const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

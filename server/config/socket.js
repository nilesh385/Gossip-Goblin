import jwt from "jsonwebtoken";
import { config } from "./env.js";
import User from "../models/User.js";

const onlineUsers = new Map();

export const configureSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(token, config.jwtSecret);
      const user = await User.findById(decoded.userId);

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.userId = user._id;
      socket.username = user.username;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    onlineUsers.set(socket.userId.toString(), socket.id);
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));

    socket.on("typing", ({ conversationId, username }) => {
      socket.to(conversationId).emit("typing", { username, conversationId });
    });

    socket.on("stopTyping", (conversationId) => {
      socket.to(conversationId).emit("stopTyping", conversationId);
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(socket.userId.toString());
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });
  });

  return {
    getOnlineUsers: () => Array.from(onlineUsers.keys()),
    getUserSocketId: (userId) => onlineUsers.get(userId.toString()),
  };
};

export default configureSocket;

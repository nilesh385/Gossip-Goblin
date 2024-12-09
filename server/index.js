import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import { config } from "./config/env.js";
import { configureSocket } from "./config/socket.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import messageRoutes from "./routes/messages.js";
import conversationRoutes from "./routes/conversations.js";
import { authenticateUser } from "./middleware/auth.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  },
});

// Middleware
app.use("/uploads/", express.static("uploads/"));
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Configure Socket.IO
const socketUtils = configureSocket(io);

// Make socket utils accessible to route handlers
app.use((req, res, next) => {
  req.io = io;
  req.socketUtils = socketUtils;
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", authenticateUser, userRoutes);
app.use("/api/messages", authenticateUser, messageRoutes);
app.use("/api/conversations", authenticateUser, conversationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

// Connect to MongoDB
const PORT = config.port;
mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log("Connected to MongoDB");
    // Start server
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));

export default app;

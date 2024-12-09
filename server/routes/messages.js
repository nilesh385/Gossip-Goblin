import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import {
  sendMessage,
  getMessages,
  markMessageAsRead,
} from "../controllers/messageController.js";

const router = express.Router();

router.use(authenticateUser);

router.post("/", sendMessage);
router.get("/:conversationId", getMessages);
router.patch("/:messageId/read", markMessageAsRead);

export default router;

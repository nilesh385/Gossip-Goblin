import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import { createError } from "../utils/errorHandler.js";

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const {
      limit = 50,
      offset = 0,
      sort = "desc",
      startDate,
      endDate,
    } = req.query;

    // Verify user is participant in conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id,
    });

    if (!conversation) {
      throw createError(403, "Not authorized to access this conversation");
    }

    // Build query
    const query = { conversationId };
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Get total count for pagination
    const total = await Message.countDocuments(query);

    // Get messages with pagination
    const messages = await Message.find(query)
      .sort({ createdAt: 1 })
      .skip(Number(offset))
      .limit(Number(limit))
      .populate("sender", "username fullName profilePic");

    res.json({
      messages,
      pagination: {
        total,
        offset: Number(offset),
        limit: Number(limit),
        hasMore: total > Number(offset) + messages.length,
      },
    });
  } catch (error) {
    throw createError(500, "Failed to fetch messages", error);
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, content, type = "text" } = req.body;

    // Validate message content
    if (!content?.trim()) {
      throw createError(400, "Message content cannot be empty");
    }

    // Verify user is participant in conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id,
    });

    if (!conversation) {
      throw createError(
        403,
        "Not authorized to send messages in this conversation"
      );
    }

    const message = new Message({
      conversationId,
      sender: req.user._id,
      content,
      type,
    });

    await message.save();

    // Update conversation's last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      updatedAt: new Date(),
    });

    const populatedMessage = await message.populate(
      "sender",
      "username fullName profilePic"
    );

    // Emit socket event
    req.io.to(conversationId).emit("newMessage", populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (error) {
    throw createError(500, "Failed to send message", error);
  }
};

export const markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      throw createError(404, "Message not found");
    }

    // Verify user is participant in conversation
    const conversation = await Conversation.findOne({
      _id: message.conversationId,
      participants: req.user._id,
    });

    if (!conversation) {
      throw createError(403, "Not authorized to access this message");
    }

    message.read = true;
    await message.save();

    res.json(message);
  } catch (error) {
    throw createError(500, "Failed to mark message as read", error);
  }
};

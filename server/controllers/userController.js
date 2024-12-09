import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs/promises";
import jwt from "jsonwebtoken";
import config from "../config/env.js";

const JWT_SECRET = config.jwtSecret;

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const users = await User.find({
      $and: [
        {
          $or: [
            { email: { $regex: query, $options: "i" } },
            { username: { $regex: query, $options: "i" } },
          ],
        },
        { _id: { $ne: req.user._id } },
        { _id: { $nin: [req.user.friends] } },
        { blockedUsers: { $nin: [req.user._id] } },
      ],
    }).select("username fullName profilePic");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, bio } = req.body;
    const updates = { fullName, bio };

    const currentUser = await User.findById(req.user._id);
    if (req.file) {
      if (currentUser.profilePic) {
        const publicId = currentUser.profilePic.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "chat-app/profiles",
        transformation: [{ width: 500, height: 500, crop: "fill" }],
      });
      updates.profilePic = result.secure_url;
      fs.unlink(req.file.path);
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    return res.json({ user, token });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

export const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(req.user._id);

    if (user.blockedUsers.includes(userId)) {
      return res.status(400).json({ message: "User is already blocked" });
    }

    user.blockedUsers.push(userId);
    user.friends = user.friends.filter((id) => id.toString() !== userId);
    await user.save();

    res.json({ message: "User blocked successfully" });
  } catch (error) {
    console.error("Block user error:", error);
    res.status(500).json({ message: "Failed to block user" });
  }
};

export const removeFriend = async (req, res) => {
  try {
    const { friendId } = req.params;
    const user = await User.findById(req.user._id);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User not found" });
    }

    user.friends = user.friends.filter((id) => id.toString() !== friendId);
    friend.friends = friend.friends.filter(
      (id) => id.toString() !== req.user._id.toString()
    );

    await Promise.all([user.save(), friend.save()]);

    res.json({ message: "Friend removed successfully" });
  } catch (error) {
    console.error("Remove friend error:", error);
    res.status(500).json({ message: "Failed to remove friend" });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const sender = await User.findById(req.user._id);
    const receiver = await User.findById(userId);

    if (!receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    if (sender.friends.includes(userId)) {
      return res.status(400).json({ message: "Already friends" });
    }

    if (sender.sentFriendRequests.includes(userId)) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    sender.sentFriendRequests.push(userId);
    receiver.pendingFriendRequests.push(req.user._id);

    await sender.save();
    await receiver.save();

    res.json({ message: "Friend request sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const receiver = await User.findById(req.user._id);
    const sender = await User.findById(userId);

    if (!sender) {
      return res.status(404).json({ message: "User not found" });
    }

    receiver.pendingFriendRequests.pull(userId);
    sender.sentFriendRequests.pull(req.user._id);

    receiver.friends.push(userId);
    sender.friends.push(req.user._id);

    await receiver.save();
    await sender.save();

    res.json({ message: "Friend request accepted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const receiver = await User.findById(req.user._id);
    const sender = await User.findById(userId);

    if (!sender) {
      return res.status(404).json({ message: "User not found" });
    }

    receiver.pendingFriendRequests.pull(userId);
    sender.sentFriendRequests.pull(req.user._id);

    await receiver.save();
    await sender.save();

    return res.json({ message: "Friend request rejected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllFriends = async (req, res) => {
  try {
    // const friends = await User.findById(req.user._id).populate(
    //   "friends",
    //   "username fullName profilePic"
    // );
    const user = await User.findById(req.user._id);
    const friends = await User.find({ _id: { $in: user.friends } }).select(
      "username fullName profilePic"
    );
    return res.json(friends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const friendRequests = await User.findById(req.user._id).populate(
      "pendingFriendRequests",
      "username fullName profilePic"
    );
    return res.json(friendRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

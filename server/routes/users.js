import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import {
  updateProfile,
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  blockUser,
  getAllFriends,
  getFriendRequests,
  getFriendProfile,
  cancelFriendRequest,
  getSentFriendRequests,
} from "../controllers/userController.js";

const router = express.Router();

router.use(authenticateUser);

router.get("/search", searchUsers);
router.get("/all-friends", getAllFriends);
router.get("/pending-friend-requests", getFriendRequests);
router.get("/get-sent-friend-requests", getSentFriendRequests);
router.get("/friend-profile/:friendId", getFriendProfile);
router.post("/friend-request/:userId", sendFriendRequest);
router.post("/friend-request/:userId/accept", acceptFriendRequest);
router.post("/friend-request/:userId/reject", rejectFriendRequest);
router.patch("/profile", upload.single("profilePic"), updateProfile);
router.delete("/friend-request/:userId/cancel", cancelFriendRequest);
router.delete("/friends/:friendId", removeFriend);
router.post("/block/:userId", blockUser);

export default router;

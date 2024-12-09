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
} from "../controllers/userController.js";

const router = express.Router();

router.use(authenticateUser);

router.get("/search", searchUsers);
router.get("/all-friends", getAllFriends);
router.get("/pending-friend-requests", getFriendRequests);
router.post("/friend-request/:userId", sendFriendRequest);
router.post("/friend-request/:userId/accept", acceptFriendRequest);
router.post("/friend-request/:userId/reject", rejectFriendRequest);
router.patch("/profile", upload.single("profilePic"), updateProfile);
router.delete("/friends/:friendId", removeFriend);
router.post("/block/:userId", blockUser);

export default router;

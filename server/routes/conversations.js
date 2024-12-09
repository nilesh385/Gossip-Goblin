import express from 'express';
import { authenticateUser } from '../middleware/auth.js';
import {
  getConversations,
  createConversation,
  deleteConversation,
} from '../controllers/conversationController.js';

const router = express.Router();

router.use(authenticateUser);

router.get('/', getConversations);
router.post('/', createConversation);
router.delete('/:conversationId', deleteConversation);

export default router;
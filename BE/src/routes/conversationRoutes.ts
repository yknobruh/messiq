import { Router } from "express";
import { ConversationController } from "../controllers/ConversationController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
const conversationController = new ConversationController();

/**
 * @swagger
 * /api/conversations:
 *   get:
 *     summary: List all conversation sessions
 *     tags: [Chat]
 */
router.get("/", authMiddleware, conversationController.sessions); // Moved from /sessions
router.get("/:id", authMiddleware, conversationController.sessions); // Placeholder for single session if needed, or just list

/**
 * @swagger
 * /api/conversations/{id}/messages:
 *   get:
 *     summary: Get message history for a session
 *     tags: [Chat]
 */
router.get("/:id/messages", authMiddleware, conversationController.messages);

/**
 * @swagger
 * /api/conversations/{id}/takeover:
 *   post:
 *     summary: Request human takeover for a session
 *     tags: [Chat]
 */
router.post("/:id/takeover", authMiddleware, conversationController.takeover);
router.post("/:id/close", authMiddleware, conversationController.close);
router.post("/:id/send", authMiddleware, conversationController.send);

export default router;

import { Router } from "express";
import { ChannelController } from "../controllers/ChannelController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
const channelController = new ChannelController();

/**
 * @swagger
 * tags:
 *   name: Channels
 *   description: Channel management and social media connections
 */

/**
 * @swagger
 * /api/channels:
 *   get:
 *     summary: List all connected channels
 *     tags: [Channels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of channels
 *   post:
 *     summary: Connect a new channel manually
 *     tags: [Channels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               channel:
 *                 type: string
 *               config:
 *                 type: object
 *     responses:
 *       201:
 *         description: Channel connected
 */
router.get("/", authMiddleware, channelController.list);
router.post("/", authMiddleware, channelController.connect);

/**
 * @swagger
 * /api/channels/{id}:
 *   delete:
 *     summary: Disconnect a channel
 *     tags: [Channels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Channel disconnected
 */
router.delete("/:id", authMiddleware, channelController.disconnect);

/**
 * @swagger
 * /api/channels/instagram/connect:
 *   get:
 *     summary: Get Instagram OAuth connection URL
 *     tags: [Channels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OAuth URL
 */
router.get("/instagram/connect", authMiddleware, channelController.instagramConnect);

/**
 * @swagger
 * /api/channels/instagram/callback:
 *   get:
 *     summary: Instagram OAuth callback
 *     tags: [Channels]
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirects after connection
 */
router.get("/instagram/callback", channelController.instagramCallback);

/**
 * @swagger
 * /api/channels/facebook/connect:
 *   get:
 *     summary: Get Facebook OAuth connection URL
 *     tags: [Channels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OAuth URL
 */
router.get("/facebook/connect", authMiddleware, channelController.facebookConnect);

/**
 * @swagger
 * /api/channels/facebook/callback:
 *   get:
 *     summary: Facebook OAuth callback
 *     tags: [Channels]
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirects after connection
 */
router.get("/facebook/callback", channelController.facebookCallback);

export default router;

import { Router } from "express";
import { WebhookController } from "../controllers/WebhookController";

const router = Router();
const webhookController = new WebhookController();

/**
 * @swagger
 * tags:
 *   name: Webhooks
 *   description: External service webhooks (Meta, etc.)
 */

/**
 * @swagger
 * /api/webhooks/meta:
 *   get:
 *     summary: Meta webhook verification
 *     tags: [Webhooks]
 *     parameters:
 *       - in: query
 *         name: hub.mode
 *         schema:
 *           type: string
 *       - in: query
 *         name: hub.challenge
 *         schema:
 *           type: string
 *       - in: query
 *         name: hub.verify_token
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the hub.challenge if verification succeeds
 *   post:
 *     summary: Receive Meta webhook payload (WhatsApp/IG/FB)
 *     tags: [Webhooks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processed
 */
router.get("/meta", webhookController.verify);
router.post("/meta", webhookController.receive);

export default router;

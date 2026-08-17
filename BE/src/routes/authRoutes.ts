import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
const authController = new AuthController();


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login to the application
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current store/user info
 *     tags: [Auth]
 *   put:
 *     summary: Update store/user info
 *     tags: [Auth]
 */
router.get("/me", authMiddleware, authController.me);
router.put("/me", authMiddleware, authController.updateMe);

export default router;

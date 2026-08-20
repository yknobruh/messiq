import { Router } from "express";
import { CustomerController } from "../controllers/CustomerController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
const customerController = new CustomerController();

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: List all customers
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of customers
 *       401:
 *         description: Not authenticated
 */
router.get("/", authMiddleware, customerController.list);
router.delete("/", authMiddleware, customerController.deleteAll);

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Get customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Customer details
 */
router.get("/:id", authMiddleware, customerController.get);

/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Update customer
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.put("/:id", authMiddleware, customerController.update);

// Merge
router.put("/:id/merge", authMiddleware, customerController.merge);

// Addresses
router.get("/:id/addresses", authMiddleware, customerController.listAddresses);
router.post("/:id/addresses", authMiddleware, customerController.addAddress);
router.put("/:id/addresses/:address_id", authMiddleware, customerController.updateAddress);
router.delete("/:id/addresses/:address_id", authMiddleware, customerController.deleteAddress);

// Tags
router.post("/:id/tags", authMiddleware, customerController.addTag);
router.delete("/:id/tags/:tag_id", authMiddleware, customerController.removeTag);

export default router;

import { Request, Response, NextFunction } from "express";
import { decodeToken } from "../utils/AuthUtils";
import { AuthService } from "../services/AuthService";

const authService = new AuthService();

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ detail: "Not authenticated" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = decodeToken(token);

    if (!decoded || !decoded.store_id) {
        return res.status(401).json({ detail: "Invalid or expired token" });
    }

    const store = await authService.getStoreById(decoded.store_id);
    if (!store) {
        return res.status(401).json({ detail: "Store not found" });
    }

    (req as any).store = store;
    next();
};

import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

const authService = new AuthService();

export class AuthController {

    async login(req: Request, res: Response) {
        try {
            const result = await authService.login(req.body);
            res.json(result);
        } catch (err: any) {
            res.status(err.status || 401).json({ detail: err.message || "Invalid credentials" });
        }
    }

    async me(req: Request, res: Response) {
        try {
            // Assuming store is attached to req by middleware
            const store = (req as any).store;
            res.json(store);
        } catch (err: any) {
            res.status(500).json({ detail: "Internal server error" });
        }
    }

    async updateMe(req: Request, res: Response) {
        try {
            const storeId = (req as any).store.id;
            const result = await authService.updateStore(storeId, req.body);
            res.json(result);
        } catch (err: any) {
            res.status(err.status || 500).json({ detail: err.message || "Internal server error" });
        }
    }
}

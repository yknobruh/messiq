import { Request, Response } from "express";
import { ConversationService } from "../services/ConversationService";

const conversationService = new ConversationService();

export class ConversationController {
    async sessions(req: Request, res: Response) {
        try {
            const storeId = (req as any).store.id;
            const sessions = await conversationService.getSessions(storeId, req.query);
            res.json(sessions);
        } catch (err: any) {
            console.error("Error in /api/conversations:", err);
            res.status(500).json({ detail: "Internal server error" });
        }
    }

    async messages(req: Request, res: Response) {
        try {
            const storeId = (req as any).store.id;
            const messages = await conversationService.getMessages(storeId, parseInt(req.params.id as string));
            res.json(messages);
        } catch (err: any) {
            res.status(err.status || 500).json({ detail: err.message || "Internal server error" });
        }
    }

    async takeover(req: Request, res: Response) {
        try {
            const storeId = (req as any).store.id;
            const result = await conversationService.takeover(storeId, parseInt(req.params.id as string), req.body);
            res.json(result);
        } catch (err: any) {
            res.status(err.status || 500).json({ detail: err.message || "Internal server error" });
        }
    }

    async close(req: Request, res: Response) {
        try {
            const storeId = (req as any).store.id;
            const result = await conversationService.close(storeId, parseInt(req.params.id as string));
            res.json(result);
        } catch (err: any) {
            res.status(err.status || 500).json({ detail: err.message || "Internal server error" });
        }
    }

    async send(req: Request, res: Response) {
        try {
            const storeId = (req as any).store.id;
            const result = await conversationService.sendMessage(storeId, parseInt(req.params.id as string), req.body);
            res.json(result);
        } catch (err: any) {
            res.status(err.status || 500).json({ detail: err.message || "Internal server error" });
        }
    }
}

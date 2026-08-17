import { Request, Response } from "express";
import { ChannelService } from "../services/ChannelService";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const channelService = new ChannelService();
const FRONTEND_URL = process.env.FRONTEND_URL;

export class ChannelController {
    async list(req: Request, res: Response) {
        try {
            const storeId = (req as any).store.id;
            const channels = await channelService.listChannels(storeId);
            res.json(channels);
        } catch (err: any) {
            res.status(500).json({ detail: "Internal server error" });
        }
    }

    async connect(req: Request, res: Response) {
        try {
            const storeId = (req as any).store.id;
            const channel = await channelService.connectChannel(storeId, req.body);
            res.status(201).json(channel);
        } catch (err: any) {
            res.status(500).json({ detail: "Internal server error" });
        }
    }

    async disconnect(req: Request, res: Response) {
        try {
            const storeId = (req as any).store.id;
            await channelService.disconnectChannel(storeId, parseInt(req.params.id as string));
            res.status(204).send();
        } catch (err: any) {
            res.status(500).json({ detail: "Internal server error" });
        }
    }

    async instagramConnect(req: Request, res: Response) {
        try {
            const storeId = (req as any).store.id;
            const needsBusiness = req.query.business === "true";
            const authUrl = channelService.getInstagramConnectUrl(storeId, needsBusiness);
            res.json({ auth_url: authUrl });
        } catch (err: any) {
            res.status(500).json({ detail: "Internal server error" });
        }
    }

    async instagramCallback(req: Request, res: Response) {
        try {
            const code = String(req.query.code || "");
            const storeId = String(req.query.state || "");
            await channelService.handleInstagramCallback(code, storeId);
            res.redirect(`${FRONTEND_URL}/dashboard/connections?channel_connected=instagram`);
        } catch (err: any) {
            console.error("Instagram Callback Error:", err);
            const errorLog = `IG Error at ${new Date().toISOString()}:\n${err.message}\n${err.stack}\n${JSON.stringify(err.response?.data || {}, null, 2)}\n\n`;
            fs.appendFileSync("/tmp/callback_error.log", errorLog);

            if (err.message.includes("BUSINESS_PORTFOLIO_REQUIRED")) {
                return res.redirect(`${FRONTEND_URL}/dashboard/connections?error=business_portfolio_required`);
            }
            res.redirect(`${FRONTEND_URL}/dashboard/connections?error=oauth_failed`);
        }
    }

    async facebookConnect(req: Request, res: Response) {
        try {
            const storeId = (req as any).store.id;
            const needsBusiness = req.query.business === "true";
            const authUrl = channelService.getFacebookConnectUrl(storeId, needsBusiness);
            res.json({ auth_url: authUrl });
        } catch (err: any) {
            res.status(500).json({ detail: "Internal server error" });
        }
    }

    async facebookCallback(req: Request, res: Response) {
        try {
            const code = String(req.query.code || "");
            const storeId = String(req.query.state || "");
            await channelService.handleFacebookCallback(code, storeId);
            res.redirect(`${FRONTEND_URL}/dashboard/connections?channel_connected=facebook`);
        } catch (err: any) {
            console.error("Facebook Callback Error:", err);
            const errorLog = `FB Error at ${new Date().toISOString()}:\n${err.message}\n${err.stack}\n${JSON.stringify(err.response?.data || {}, null, 2)}\n\n`;
            fs.appendFileSync("/tmp/callback_error.log", errorLog);

            if (err.message.includes("BUSINESS_PORTFOLIO_REQUIRED")) {
                return res.redirect(`${FRONTEND_URL}/dashboard/connections?error=business_portfolio_required`);
            }
            res.redirect(`${FRONTEND_URL}/dashboard/connections?error=oauth_failed`);
        }
    }
}

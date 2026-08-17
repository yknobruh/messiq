import { Request, Response } from "express";
import { WebhookService } from "../services/WebhookService";
import { parseInstagramWebhook, parseFacebookWebhook } from "../services/parsers/meta";
import { parseMetaChanges } from "../services/parsers/comments";
import dotenv from "dotenv";

dotenv.config();

const webhookService = new WebhookService();
const META_VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || "verify";

export class WebhookController {
    async verify(req: Request, res: Response) {
        const mode = req.query["hub.mode"];
        const token = req.query["hub.verify_token"];
        const challenge = req.query["hub.challenge"];

        if (mode === "subscribe" && token === META_VERIFY_TOKEN) {
            console.log("Webhook verified!");
            return res.status(200).send(challenge);
        }
        res.status(403).send("Forbidden");
    }

    async receive(req: Request, res: Response) {
        const payload = req.body;
        
        console.log(`\n\n🟢 [WEBHOOK RECEIVED] - ${new Date().toISOString()}`);
        console.log(JSON.stringify(payload, null, 2));
        console.log(`---------------------------------------------------\n`);

        const objType = payload.object;
        let messages: any[] = [];

        if (objType === "instagram") {
            messages = parseInstagramWebhook(payload);
        } else if (objType === "page") {
            messages = parseFacebookWebhook(payload);
        }


        // Handle comments/feed
        const commentMessages = parseMetaChanges(payload);
        if (commentMessages.length > 0) {
            messages = messages.concat(commentMessages);
        }

        if (messages.length === 0) {
            return res.json({ status: "ok", messages: 0 });
        }

        // Process in background
        for (const msg of messages) {
            webhookService.processMessage(msg).catch(err => {
                console.error("Webhook processing error:", err);
            });
        }

        res.json({ status: "ok", messages: messages.length });
    }
}

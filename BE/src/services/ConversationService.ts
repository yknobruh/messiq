import { AppDataSource } from "../data-source";
import { ChatSession, ChatLog, Escalation } from "../entities/Chat";
import { Customer } from "../entities/Customer";
import { StoreChannel } from "../entities/StoreChannel";
import * as igSender from "./senders/instagram";
import * as fbSender from "./senders/facebook";

export class ConversationService {
    private sessionRepository = AppDataSource.getRepository(ChatSession);
    private logRepository = AppDataSource.getRepository(ChatLog);
    private escalationRepository = AppDataSource.getRepository(Escalation);

    async getSessions(storeId: string, query: any) {
        const { status, channel, skip = 0, limit = 50 } = query;
        const where: any = { store_id: storeId };

        if (status) where.status = status;
        if (channel) where.channel = channel;

        const skipNum = parseInt(skip as string) || 0;
        const limitNum = parseInt(limit as string) || 50;

        const sessions = await this.sessionRepository.find({
            where,
            relations: ["customer"],
            order: { last_message_at: "DESC" },
            skip: skipNum,
            take: limitNum,
        });

        // Enrich with last message preview and escalation status
        return await Promise.all(sessions.map(async (session) => {
            const lastMsg = await this.logRepository.findOne({
                where: { session_id: session.id },
                order: { created_at: "DESC" }
            });

            const activeEscalation = await this.escalationRepository.findOneBy({
                session_id: session.id,
                status: "open"
            });

            return {
                ...session,
                customer_name: session.customer?.name,
                customer_phone: session.customer?.phone,
                last_message_preview: lastMsg ? lastMsg.message_text?.substring(0, 80) : null,
                has_escalation: !!activeEscalation,
            };
        }));
    }

    async getMessages(storeId: string, sessionId: number) {
        // Verify session belongs to store
        const session = await this.sessionRepository.findOneBy({ id: sessionId, store_id: storeId });
        if (!session) throw { status: 404, message: "Conversation not found" };

        return await this.logRepository.find({
            where: { session_id: sessionId },
            order: { created_at: "ASC" },
        });
    }

    async takeover(storeId: string, sessionId: number, body: any) {
        const session = await this.sessionRepository.findOneBy({ id: sessionId, store_id: storeId });
        if (!session) throw { status: 404, message: "Session not found" };

        session.is_human_takeover = body.is_human_takeover;
        if (session.is_human_takeover) {
            session.taken_over_at = new Date();
            // In a real app, taken_over_by would come from the requesting user id
            // session.taken_over_by = body.user_id; 
        } else {
            session.taken_over_at = null;
            session.taken_over_by = null;
        }

        return await this.sessionRepository.save(session);
    }

    async close(storeId: string, sessionId: number) {
        const session = await this.sessionRepository.findOneBy({ id: sessionId, store_id: storeId });
        if (!session) throw { status: 404, message: "Session not found" };

        session.status = "closed";
        session.closed_at = new Date();
        return await this.sessionRepository.save(session);
    }

    async sendMessage(storeId: string, sessionId: number, body: any) {
        const session = await this.sessionRepository.findOne({
            where: { id: sessionId, store_id: storeId },
            relations: ["customer"],
        });
        if (!session) throw { status: 404, message: "Session not found" };

        const channelRepo = AppDataSource.getRepository(StoreChannel);
        const channel = await channelRepo.findOneBy({
            store_id: storeId,
            channel: session.channel,
            is_active: true,
        });
        if (!channel) throw { status: 400, message: `No active channel connected for ${session.channel}` };

        const messageText = body.message || body.messageText || "";
        if (!messageText.trim()) throw { status: 400, message: "Message content cannot be empty" };

        // Send via Meta Graph API
        if (session.channel === "instagram") {
            const recipientId = session.customer.insta_id;
            if (!recipientId) throw { status: 400, message: "Customer does not have an Instagram ID linked" };
            await igSender.sendText(channel.access_token, recipientId, messageText);
        } else if (session.channel === "facebook") {
            const recipientId = session.customer.fb_psid;
            if (!recipientId) throw { status: 400, message: "Customer does not have a Facebook PSID linked" };
            await fbSender.sendText(channel.access_token, recipientId, messageText);
        } else {
            throw { status: 400, message: `Channel ${session.channel} is not supported` };
        }

        // Log in database
        const log = this.logRepository.create({
            store_id: storeId,
            customer_id: session.customer_id,
            session_id: session.id,
            direction: "outbound",
            sender_type: "human",
            message_type: "text",
            message_text: messageText,
        });
        const savedLog = await this.logRepository.save(log);

        session.last_message_at = new Date();
        session.message_count += 1;
        await this.sessionRepository.save(session);

        return savedLog;
    }
}

import { AppDataSource } from "../data-source";
import { StoreChannel } from "../entities/StoreChannel";
import { Customer } from "../entities/Customer";
import { ChatSession, ChatLog } from "../entities/Chat";
import { InboundMessage } from "./parsers/types";
import * as igSender from "./senders/instagram";
import * as fbSender from "./senders/facebook";

// In-memory cache to prevent lightning-fast concurrent duplicates from Meta
const processedMessageIds = new Set<string>();

export class WebhookService {
    private channelRepository = AppDataSource.getRepository(StoreChannel);
    private customerRepository = AppDataSource.getRepository(Customer);
    private sessionRepository = AppDataSource.getRepository(ChatSession);
    private logRepository = AppDataSource.getRepository(ChatLog);

    async processMessage(message: InboundMessage) {
        // 0. Deduplicate: Block lightning-fast concurrent duplicates instantly
        if (message.external_msg_id) {
            if (processedMessageIds.has(message.external_msg_id)) {
                console.log(`[DEDUPLICATION] Blocked concurrent duplicate instantly: ${message.external_msg_id}`);
                return;
            }
            
            // Immediately add to cache to block any duplicates that arrive 1ms later
            processedMessageIds.add(message.external_msg_id);
            
            // Optional: clean up cache after 1 hour to prevent memory leaks
            setTimeout(() => processedMessageIds.delete(message.external_msg_id!), 3600000);

            const existingLog = await this.logRepository.findOne({
                where: { external_msg_id: message.external_msg_id }
            });
            if (existingLog) {
                console.log(`[DEDUPLICATION] Skipping already processed message ID in DB: ${message.external_msg_id}`);
                return;
            }
        }

        // 1. Resolve Store Channel
        const storeChannel = await this.channelRepository.findOne({
            where: {
                channel: message.channel,
                external_id: message.phone_number_id,
                is_active: true,
            },
            relations: ["store"],
        });

        if (!storeChannel) {
            console.warn(`No active store channel found for ${message.channel}:${message.phone_number_id}`);
            return;
        }

        const store = storeChannel.store;

        // 2. Resolve Customer
        let customer = await this.resolveCustomer(store.id, message, storeChannel.access_token);

        // 3. Resolve/Create Session
        let session = await this.resolveSession(store.id, customer.id, message.channel);

        // 4. Log Inbound Message
        await this.logMessage(store.id, customer.id, session.id, message, "inbound", "customer");

        // 5. Check Human Takeover
        if (session.is_human_takeover) {
            console.info(`Human takeover active for customer ${customer.id}. Skipping auto-reply.`);
            return;
        }

        // 6. Use Store's welcome message as default auto-reply
        const replyText = store.welcome_message || "Hello! Thank you for reaching out. How can we help you today?";

        // 7. Log Outbound Message
        await this.logMessage(store.id, customer.id, session.id, {
            channel: message.channel,
            message_text: replyText,
            message_type: "text",
        } as any, "outbound", "bot");

        // 8. Send Response
        await this.sendResponse(storeChannel, message, replyText);
    }

    private async resolveCustomer(storeId: string, message: InboundMessage, accessToken?: string) {
        let customer: Customer | null = null;

        const where: any = { store_id: storeId, is_merged: false };
        if (message.channel === "instagram") where.insta_id = message.sender_id;
        else if (message.channel === "facebook") where.fb_psid = message.sender_id;

        customer = await this.customerRepository.findOneBy(where) as any;

        let name: string | null = message.sender_name || null;

        // Fetch sender's profile details from Meta Graph API if it's a new customer and name wasn't in payload
        if (!customer && !name && accessToken) {
            try {
                const axios = require("axios");
                if (message.channel === "instagram") {
                    const response = await axios.get(
                        `https://graph.facebook.com/v18.0/${message.sender_id}`,
                        {
                            params: {
                                fields: "name,username",
                                access_token: accessToken,
                            },
                        }
                    );
                    name = response.data.name || response.data.username || null;
                } else if (message.channel === "facebook") {
                    const response = await axios.get(
                        `https://graph.facebook.com/v18.0/${message.sender_id}`,
                        {
                            params: {
                                fields: "first_name,last_name",
                                access_token: accessToken,
                            },
                        }
                    );
                    const firstName = response.data.first_name || "";
                    const lastName = response.data.last_name || "";
                    name = `${firstName} ${lastName}`.trim() || null;
                }
            } catch (err: any) {
                console.error("Error fetching Meta profile:", err.message);
            }
        }

        if (!customer) {
            const newCustomer = this.customerRepository.create({
                store_id: storeId,
                name: name || "Anonymous",
                ...where,
            });
            customer = await this.customerRepository.save(newCustomer) as any;
        } else if (name && customer.name === "Anonymous") {
            // Update customer's name if we previously defaulted to Anonymous
            customer.name = name;
            customer = await this.customerRepository.save(customer) as any;
        }

        if (customer) {
            customer.last_interaction_at = new Date();
            customer.current_channel = message.channel;
            return await this.customerRepository.save(customer) as any;
        }
        throw new Error("Failed to resolve customer");
    }

    private async resolveSession(storeId: string, customerId: number, channel: string) {
        let session = await this.sessionRepository.findOneBy({
            store_id: storeId,
            customer_id: customerId,
            status: "active",
        });

        if (!session) {
            session = this.sessionRepository.create({
                store_id: storeId,
                customer_id: customerId,
                channel,
                status: "active",
            });
            await this.sessionRepository.save(session);
        }

        session.last_message_at = new Date();
        session.message_count += 1;
        return await this.sessionRepository.save(session);
    }

    private async logMessage(storeId: string, customerId: number, sessionId: number, message: InboundMessage, direction: string, senderType: string) {
        const log = this.logRepository.create({
            store_id: storeId,
            customer_id: customerId,
            session_id: sessionId,
            direction,
            sender_type: senderType,
            message_type: message.message_type,
            message_text: message.message_text,
            media_url: message.media_url,
            external_msg_id: message.external_msg_id,
        });
        await this.logRepository.save(log);
    }

    private async sendResponse(storeChannel: StoreChannel, message: InboundMessage, response: string) {
        const token = storeChannel.access_token;

        if (message.channel === "instagram") {
            if (message.comment_id) {
                await igSender.replyToComment(token, message.comment_id, response);
            } else {
                await igSender.sendText(token, message.sender_id, response);
            }
        } else if (message.channel === "facebook") {
            if (message.comment_id) {
                await fbSender.replyToComment(token, message.comment_id, response);
            } else {
                await fbSender.sendText(token, message.sender_id, response);
            }
        }
    }
}


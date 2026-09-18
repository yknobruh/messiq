import { InboundMessage } from "./types";

export function parseInstagramWebhook(payload: any): InboundMessage[] {
    const messages: InboundMessage[] = [];

    for (const entry of payload.entry || []) {
        const phone_number_id = entry.id; // Page ID / IG Account ID
        for (const messaging of entry.messaging || []) {
            const sender_id = messaging.sender?.id;

            // Skip if sender is the page itself (echo)
            if (sender_id === phone_number_id) continue;

            const msg = messaging.message || {};

            let msgType = "text";
            let text = msg.text || "";
            let mediaUrl = "";

            const attachments = msg.attachments || [];
            if (attachments.length > 0 && !text) {
                const att = attachments[0];
                const attType = att.type;
                const attUrl = att.payload?.url || "";

                if (attType === "image") {
                    msgType = "image";
                    text = "[Image received]";
                    mediaUrl = attUrl;
                } else if (attType === "video") {
                    msgType = "video";
                    text = "[Video received]";
                    mediaUrl = attUrl;
                } else if (attType === "audio") {
                    msgType = "audio";
                    text = "[Voice message received]";
                    mediaUrl = attUrl;
                } else if (attType === "sticker") {
                    text = "[Sticker received]";
                }
            }

            if (text) {
                messages.push({
                    channel: "instagram",
                    sender_id,
                    phone_number_id,
                    message_text: text,
                    message_type: msgType,
                    media_url: mediaUrl,
                    external_msg_id: msg.mid,
                    timestamp: entry.time,
                });
            }
        }
    }

    return messages;
}

export function parseFacebookWebhook(payload: any): InboundMessage[] {
    const messages: InboundMessage[] = [];

    for (const entry of payload.entry || []) {
        const phone_number_id = entry.id;
        for (const messaging of entry.messaging || []) {
            const sender_id = messaging.sender?.id;

            // Skip echo
            if (sender_id === phone_number_id) continue;

            const msg = messaging.message || {};

            let msgType = "text";
            let text = msg.text || "";
            let mediaUrl = "";

            const attachments = msg.attachments || [];
            if (attachments.length > 0 && !text) {
                const att = attachments[0];
                const attType = att.type;
                const attUrl = att.payload?.url || "";

                if (attType === "image") {
                    msgType = "image";
                    text = "[Image received]";
                    mediaUrl = attUrl;
                } else if (attType === "video") {
                    msgType = "video";
                    text = "[Video received]";
                    mediaUrl = attUrl;
                } else if (attType === "audio") {
                    msgType = "audio";
                    text = "[Voice message received]";
                    mediaUrl = attUrl;
                }
            }

            if (text) {
                messages.push({
                    channel: "facebook",
                    sender_id,
                    phone_number_id,
                    message_text: text,
                    message_type: msgType,
                    media_url: mediaUrl,
                    external_msg_id: msg.mid,
                    timestamp: entry.time,
                });
            }
        }
    }

    return messages;
}

export function parseWhatsAppWebhook(payload: any): InboundMessage[] {
    const messages: InboundMessage[] = [];

    for (const entry of payload.entry || []) {
        for (const change of entry.changes || []) {
            const val = change.value || {};
            const phoneNumberId = val.metadata?.phone_number_id || entry.id;
            const contacts = val.contacts || [];
            const contactMap: Record<string, string> = {};
            for (const c of contacts) {
                if (c.wa_id) {
                    contactMap[c.wa_id] = c.profile?.name || "";
                }
            }

            for (const msg of val.messages || []) {
                const senderId = msg.from;
                const senderName = contactMap[senderId] || null;
                let msgType = msg.type || "text";
                let text = "";
                let mediaUrl = "";

                if (msgType === "text") {
                    text = msg.text?.body || "";
                } else if (msgType === "image") {
                    text = msg.image?.caption || "[Image received]";
                } else if (msgType === "video") {
                    text = msg.video?.caption || "[Video received]";
                } else if (msgType === "audio" || msgType === "voice") {
                    text = "[Voice message received]";
                } else if (msgType === "button") {
                    text = msg.button?.text || msg.button?.payload || "";
                } else if (msgType === "interactive") {
                    text = msg.interactive?.button_reply?.title || msg.interactive?.list_reply?.title || "";
                } else {
                    text = `[${msgType} message received]`;
                }

                if (text && senderId) {
                    messages.push({
                        channel: "whatsapp",
                        sender_id: senderId,
                        sender_name: senderName,
                        phone_number_id: phoneNumberId,
                        message_text: text,
                        message_type: msgType,
                        media_url: mediaUrl,
                        external_msg_id: msg.id,
                        timestamp: msg.timestamp ? parseInt(msg.timestamp) * 1000 : Date.now(),
                    });
                }
            }
        }
    }

    return messages;
}


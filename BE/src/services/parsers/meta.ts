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

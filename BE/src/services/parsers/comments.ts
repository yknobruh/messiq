import { InboundMessage } from "./types";

export function parseMetaChanges(payload: any): InboundMessage[] {
    const messages: InboundMessage[] = [];
    const obj_type = payload.object || "";

    for (const entry of payload.entry || []) {
        const target_id = entry.id;

        for (const change of entry.changes || []) {
            const field = change.field;
            const value = change.value || {};

            if (obj_type === "instagram" && field === "comments") {
                const sender_id = value.from?.id;
                if (sender_id === target_id) continue;

                if (value.text) {
                    messages.push({
                        channel: "instagram",
                        sender_id,
                        phone_number_id: target_id,
                        message_text: value.text,
                        message_type: "comment",
                        external_msg_id: value.id,
                        comment_id: value.id,
                        post_id: value.media?.id,
                        timestamp: entry.time,
                    });
                }
            } else if (obj_type === "page" && field === "feed") {
                if (value.item === "comment" && value.verb === "add") {
                    const sender_id = value.from?.id;
                    if (sender_id === target_id) continue;

                    if (value.message) {
                        messages.push({
                            channel: "facebook",
                            sender_id,
                            phone_number_id: target_id,
                            message_text: value.message,
                            message_type: "comment",
                            external_msg_id: value.comment_id,
                            comment_id: value.comment_id,
                            post_id: value.parent_id || value.post_id,
                            timestamp: entry.time,
                        });
                    }
                }
            }
        }
    }

    return messages;
}

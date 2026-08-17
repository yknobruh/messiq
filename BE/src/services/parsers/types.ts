export interface InboundMessage {
    channel: "instagram" | "facebook";
    sender_id: string;
    phone_number_id: string; // The store's page/channel identifier
    message_text: string;
    message_type: string; // text | image | audio | comment | etc.
    media_url?: string;
    external_msg_id?: string;
    timestamp?: number;
    post_id?: string;
    comment_id?: string;
}

import axios from "axios";

const GRAPH_API = "https://graph.facebook.com/v18.0";

/**
 * Send text message via WhatsApp Cloud API
 * @param access_token Meta user or system access token
 * @param phone_number_id The store's WhatsApp Business Phone Number ID
 * @param recipient_id The customer's WhatsApp ID / phone number (E.164 without '+')
 * @param text Message body
 */
export const sendText = async (
    access_token: string,
    phone_number_id: string,
    recipient_id: string,
    text: string
) => {
    const cleanRecipient = recipient_id.replace(/\+/g, "").replace(/\s+/g, "").trim();
    const url = `${GRAPH_API}/${phone_number_id}/messages`;
    const payload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: cleanRecipient,
        type: "text",
        text: { preview_url: false, body: text },
    };

    const resp = await axios.post(url, payload, {
        headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
        },
    });
    return resp.data;
};

/**
 * Send image message via WhatsApp Cloud API
 * @param access_token Meta user or system access token
 * @param phone_number_id The store's WhatsApp Business Phone Number ID
 * @param recipient_id The customer's WhatsApp ID / phone number
 * @param imageUrl Hosted URL of the image
 */
export const sendImage = async (
    access_token: string,
    phone_number_id: string,
    recipient_id: string,
    imageUrl: string
) => {
    const url = `${GRAPH_API}/${phone_number_id}/messages`;
    const payload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipient_id,
        type: "image",
        image: { link: imageUrl },
    };

    const resp = await axios.post(url, payload, {
        headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
        },
    });
    return resp.data;
};

/**
 * Send template message via WhatsApp Cloud API (used for starting conversations / outside 24h window)
 * @param access_token Meta user or system access token
 * @param phone_number_id The store's WhatsApp Business Phone Number ID
 * @param recipient_id The customer's WhatsApp ID / phone number (E.164 without '+')
 * @param templateName The pre-approved template name (default: "hello_world")
 * @param languageCode Template language code (default: "en_US")
 */
export const sendTemplate = async (
    access_token: string,
    phone_number_id: string,
    recipient_id: string,
    templateName: string = "hello_world",
    languageCode: string = "en_US"
) => {
    const url = `${GRAPH_API}/${phone_number_id}/messages`;
    const cleanRecipient = recipient_id.replace(/\+/g, "").replace(/\s+/g, "").trim();
    const payload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: cleanRecipient,
        type: "template",
        template: {
            name: templateName,
            language: { code: languageCode },
        },
    };

    const resp = await axios.post(url, payload, {
        headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
        },
    });
    return resp.data;
};

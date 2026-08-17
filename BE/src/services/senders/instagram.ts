import axios from "axios";

const GRAPH_API = "https://graph.facebook.com/v18.0";

export const sendText = async (access_token: string, recipient_id: string, text: string) => {
    const url = `${GRAPH_API}/me/messages`;
    const payload = {
        recipient: { id: recipient_id },
        message: { text },
    };

    const resp = await axios.post(url, payload, {
        params: { access_token },
    });
    return resp.data;
};

export const sendImage = async (access_token: string, recipient_id: string, imageUrl: string) => {
    const url = `${GRAPH_API}/me/messages`;
    const payload = {
        recipient: { id: recipient_id },
        message: {
            attachment: {
                type: "image",
                payload: { url: imageUrl },
            },
        },
        access_token,
    };

    const resp = await axios.post(url, payload);
    return resp.data;
};

export const sendGenericTemplate = async (access_token: string, recipient_id: string, elements: any[]) => {
    const url = `${GRAPH_API}/me/messages`;
    const payload = {
        recipient: { id: recipient_id },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements,
                },
            },
        },
        access_token,
    };

    const resp = await axios.post(url, payload);
    return resp.data;
};

export const replyToComment = async (access_token: string, comment_id: string, text: string) => {
    const url = `${GRAPH_API}/${comment_id}/replies`;
    const resp = await axios.post(url, null, {
        params: {
            message: text,
            access_token,
        },
    });
    return resp.data;
};

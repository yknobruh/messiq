import { api } from "../../../app/lib/api";

export interface ConversationSession {
    id: number;
    status: string;
    has_escalation: boolean;
    customer_name: string | null;
    last_message_preview: string | null;
    last_message_at: string | null;
    channel: string;
}

export const chatApi = {
    /**
     * Fetch all conversation sessions
     */
    getConversations: async () => {
        return api.get<ConversationSession[]>("/api/conversations");
    },

    /**
   * Fetch a single conversation by ID (including history)
   */
    getConversationById: async (sessionId: number | string) => {
        return api.get<any>(`/api/conversations/${sessionId}`);
    },

    /**
     * Fetch messages for a specific session
     */
    getMessagesBySessionId: async (sessionId: number | string) => {
        return api.get<any[]>(`/api/conversations/${sessionId}/messages`);
    },

    /**
     * Send a message to a customer
     */
    sendMessage: async (sessionId: number | string, message: string) => {
        return api.post<any>(`/api/conversations/${sessionId}/send`, { message });
    },

    /**
     * Transfer/takeover a conversation
     */
    takeover: async (sessionId: number | string, isHumanTakeover: boolean) => {
        return api.post(`/api/conversations/${sessionId}/takeover`, { is_human_takeover: isHumanTakeover });
    },
};
